/**
 * GEI CURRENT UX ATLAS — captura de motion (video) vía CDP Page.startScreencast.
 *
 *   node _harness/motion.mjs <spec.mjs>
 *
 * Cada motion del spec produce:
 *   <atlas>/<dir>/motion/<MOTION_ID>.mp4
 *   <atlas>/<dir>/motion/<MOTION_ID>.frames.txt   (timing real de cada frame)
 *   <atlas>/<dir>/motion/<MOTION_ID>.meta.json    (duración medida, fps, etc.)
 *
 * Los frames se reassemblan con ffmpeg usando un concat demuxer con la
 * duración real de cada frame, de modo que la línea de tiempo del video
 * corresponde a la de la sesión real.
 */

import { spawn } from "node:child_process"
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs"
import { setTimeout as sleep } from "node:timers/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { withBrowser, setViewport, waitStable, runStep, makeEvaluator } from "./cdp.mjs"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ATLAS_ROOT = path.resolve(HERE, "..")
const FFMPEG = "C:\\Homi\\tools\\ffmpeg-8.1.2\\ffmpeg-8.1.2-full_build\\bin\\ffmpeg.exe"
const BASE = process.env.GEI_BASE ?? "http://localhost:8443"

const specArg = process.argv[2]
if (!specArg) {
  console.error("uso: node _harness/motion.mjs <spec.mjs>")
  process.exit(1)
}
const spec = await import(
  `file://${path.resolve(process.cwd(), specArg).replace(/\\/g, "/")}`
)

const only = process.argv.find((a) => a.startsWith("--only="))?.split("=")[1]

let currentMotion = null

await withBrowser(
  async ({ send }) => {
    const ev = makeEvaluator(send)
    for (const motion of spec.motions ?? []) {
      if (only && !motion.id.includes(only)) continue
      currentMotion = motion
      const outDir = path.join(ATLAS_ROOT, motion.dir, "motion")
      const frameDir = path.join(outDir, `_frames_${motion.id}`)
      mkdirSync(frameDir, { recursive: true })

      await setViewport(send, motion.viewport)
      await send("Page.navigate", { url: "about:blank" })
      await sleep(100)
      const url = `${BASE}${motion.path}${motion.path.includes("?") ? "&" : "?"}demo=${motion.actor}`
      await send("Page.navigate", { url })
      await sleep(400)
      await waitStable(send)

      // pre-steps (estado previo, sin la acción que se quiere capturar)
      for (const step of motion.pre ?? []) {
        await runStep(send, step)
        await sleep(step.settle ?? 320)
        await waitStable(send)
      }

      const frames = currentMotion.__frames ?? []
      currentMotion.__frames = frames
      await send("Page.startScreencast", {
        format: "jpeg",
        quality: 92,
        maxWidth: 1440,
        maxHeight: 900,
        everyNthFrame: 1,
      })
      await sleep(260)
      // acción principal
      for (const step of motion.action ?? []) {
        const r = await runStep(send, step)
        if (String(r.result).startsWith("NOT_FOUND"))
          console.log(`  WARN ${motion.id}: paso no encontrado (${r.target})`)
      }
      const duration = motion.duration ?? 1400
      await sleep(duration)
      const tEnd = (frames.length ? frames[frames.length - 1].ts : 0) + duration / 1000
      await send("Page.stopScreencast").catch(() => {})
      await sleep(120)

      // frames en disco + timings
      const timeline = []
      for (let i = 0; i < frames.length; i++) {
        const f = `frame_${String(i).padStart(4, "0")}.jpg`
        writeFileSync(path.join(frameDir, f), Buffer.from(frames[i].data, "base64"))
        const next =
          i === frames.length - 1
            ? Math.max(frames[i].ts + 1 / 30, tEnd)
            : frames[i + 1]?.ts ?? frames[i].ts + 1 / 30
        timeline.push({ file: f, duration: Math.max(1 / 120, next - frames[i].ts) })
      }

      // concat demuxer con duración real por frame
      const concat = timeline
        .map((t) => `file '${t.file}'\nduration ${t.duration.toFixed(6)}`)
        .join("\n")
      // el demuxer concat ignora la duración del último archivo: se repite
      const last = timeline[timeline.length - 1]
      writeFileSync(
        path.join(frameDir, "frames.ffconcat"),
        concat + (last ? `\nfile '${last.file}'\n` : "\n"),
        "utf8",
      )

      const mp4 = path.join(outDir, `${motion.id}.mp4`)
      const fps = 30
      const proc = spawn(FFMPEG, [
        "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", path.join(frameDir, "frames.ffconcat"),
        "-vf", `fps=${fps},scale=trunc(iw/2)*2:-2`,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        mp4,
      ], { stdio: "ignore" })
      await new Promise((res) => proc.on("close", res))

      const measured = frames.length
        ? (frames[frames.length - 1].ts - frames[0].ts) * 1000
        : 0
      writeFileSync(
        path.join(outDir, `${motion.id}.meta.json`),
        JSON.stringify(
          {
            motionId: motion.id,
            route: motion.path,
            actor: motion.actor,
            viewport: motion.viewport,
            frames: frames.length,
            measuredDurationMs: Math.round(measured),
            observedDurationMs: duration,
            fps,
            action: motion.action,
            pre: motion.pre,
            source: motion.source,
          },
          null,
          2,
        ),
        "utf8",
      )
      writeFileSync(
        path.join(outDir, `${motion.id}.frames.txt`),
        timeline
          .map(
            (t, i) =>
              `#${String(i + 1).padStart(4, "0")} ${t.file} duration=${t.duration.toFixed(4)}s`,
          )
          .join("\n") + "\n",
        "utf8",
      )
      rmSync(frameDir, { recursive: true, force: true })
      console.log(
        `OK ${motion.id} -> ${path.relative(ATLAS_ROOT, mp4)} (${frames.length} frames, ${Math.round(measured)} ms)`,
      )
    }
  },
  {
    port: 9360,
    onEvent: (message) => {
      if (message.method !== "Page.screencastFrame") return
      const m = currentMotion
      if (!m) return
      m.__frames ??= []
      m.__frames.push({
        data: message.params.data,
        ts: message.params.metadata.timestamp,
      })
      sendAck(message.params.sessionId)
    },
  },
)

function sendAck() {
  /* el ack se emite dentro de withBrowser vía send; se ignora aquí */
}

