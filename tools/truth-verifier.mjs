import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"

export const STATES = ["PASS", "FAIL", "BLOCKED", "NOT RUN", "INVALID EVIDENCE"]

export function currentHead(cwd = process.cwd()) {
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" }).trim()
}

/** Parse JUnit XML nativo (sin dependencias) → ejecuciones individuales. */
export function parseJUnit(xml, { runId, artifactPath, codeRevision, collectedAt }) {
  const cases = []
  const re = /<testsuite\b([^>]*)>|<\/testsuite>|<testcase\b([^>]*)>([\s\S]*?)<\/testcase>|<testcase\b([^>]*)\/>/g
  let m
  let suiteHost = ""
  while ((m = re.exec(xml)) !== null) {
    if (m[1] !== undefined) { suiteHost = m[1].match(/hostname="([^"]*)"/)?.[1] ?? ""; continue }
    if (m[0] === "</testsuite>") { suiteHost = ""; continue }
    const attrs = m[2] ?? m[4] ?? ""
    const body = m[3] ?? ""
    const attr = (k) => attrs.match(new RegExp(`(?:^|\\s)${k}="([^"]*)"`))?.[1] ?? ""
    const name = attr("name")
    if (!name) continue
    const status = /<failure\b|<error\b/.test(body) ? "failed"
      : /<skipped\b/.test(body) ? "skipped" : "passed"
    cases.push({
      executionId: `${runId}:${path.basename(artifactPath)}:${name}`,
      testId: attr("classname") ? `${attr("classname")} > ${name}` : name,
      name,
      file: attr("file") || attr("classname") || "",
      status,
      runId, artifactPath, codeRevision, collectedAt,
      context: {
        browser: attr("browser") || suiteHost || "unspecified",
        viewport: attr("viewport") || "unspecified",
      },
    })
  }
  return cases
}

export function sha256(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex")
}

/**
 * Evalúa un criterio. `execs` = ejecuciones del run.
 * `head` = revisión de código actual. `manifest` = { [artifactPath]: sha256 }.
 * `readFile` permite inyectar archivos en los tests negativos.
 */
export function evaluateCriterion(criterion, ctx) {
  const { executions, head, manifest, baseDir = process.cwd(), readFile = (p) => fs.readFileSync(path.resolve(baseDir, p), "utf8") } = ctx
  const pool = executions.filter((e) =>
    (!criterion.browser || e.context.browser === criterion.browser) &&
    (!criterion.file || e.file === criterion.file || e.file.endsWith(`/${criterion.file}`) ||
      path.basename(e.file) === path.basename(criterion.file)))
  const exact = (criterion.testIds || []).flatMap((id) =>
    pool.filter((e) => e.testId === id || e.name === id || e.testId.endsWith(` > ${id}`)))
  const patterns = (criterion.testIdPatterns || []).flatMap((p) =>
    pool.filter((e) => e.name.includes(p) || e.testId.includes(p)))
  const matches = [...exact, ...patterns].filter((e, i, arr) => arr.findIndex((x) => x.executionId === e.executionId) === i)

  if (!matches.length) return { status: "NOT RUN", reason: "sin ejecución vinculada" }
  if (matches.some((e) => e.status === "failed")) return { status: "FAIL", reason: "ejecución fallida", executions: matches.map((e) => e.executionId) }
  if (matches.every((e) => e.status === "skipped")) return { status: "NOT RUN", reason: "tests omitidos" }

  for (const e of matches) {
    if (e.status !== "passed") continue
    if (e.runnerExitCode !== undefined && e.runnerExitCode !== 0) {
      return { status: "FAIL", reason: `runner exit=${e.runnerExitCode} aunque hay resultados parciales`, executions: [e.executionId] }
    }
    if (e.codeChanged === true) {
      return { status: "INVALID EVIDENCE", reason: "código modificado durante la ejecución", executions: [e.executionId] }
    }
    if (criterion.requireAssertion && !(criterion.assertionRefs?.length || criterion.assertionRef)) {
      return { status: "INVALID EVIDENCE", reason: "criterio sin aserción contractual", executions: [e.executionId] }
    }
    if (e.codeRevision && head && e.codeRevision !== head) {
      return { status: "INVALID EVIDENCE", reason: `revisión obsoleta ${e.codeRevision} != ${head}`, executions: [e.executionId] }
    }
    if (e.artifactPath && manifest && !manifest[e.artifactPath]) {
      return { status: "INVALID EVIDENCE", reason: "artefacto ausente en manifiesto", executions: [e.executionId] }
    }
    if (e.artifactPath && manifest && /^[a-f0-9]{64}$/i.test(manifest[e.artifactPath] ?? "") &&
        manifest[e.artifactPath] !== sha256(path.resolve(baseDir, e.artifactPath))) {
      return { status: "INVALID EVIDENCE", reason: "hash de artefacto no coincide", executions: [e.executionId] }
    }
    const refs = criterion.assertionRefs || (criterion.assertionRef ? [criterion.assertionRef] : [])
    if (refs.length) {
      let source = ""
      try { source = readFile(e.file || criterion.file || "") } catch { /* sin fuente */ }
      for (const ref of refs) {
        if (/expect\((true|1)\)\.toBe\((true|1)\)/.test(ref)) {
          return { status: "INVALID EVIDENCE", reason: "aserción trivial no acredita requisito", executions: [e.executionId] }
        }
        if (!source || !source.includes(ref)) {
          return { status: "INVALID EVIDENCE", reason: "asociación no demuestra el invariante (assertionRef ausente)", executions: [e.executionId] }
        }
      }
    }
    if (criterion.browser && e.context.browser !== criterion.browser) {
      return { status: "INVALID EVIDENCE", reason: `browser ${e.context.browser} != ${criterion.browser}`, executions: [e.executionId] }
    }
    if (criterion.viewport && e.context.viewport !== criterion.viewport) {
      return { status: "INVALID EVIDENCE", reason: `viewport ${e.context.viewport} != ${criterion.viewport}`, executions: [e.executionId] }
    }
  }
  return { status: "PASS", reason: "ejecución verificada", executions: matches.map((e) => e.executionId) }
}

export function evaluateScenario(scenario, ctx) {
  if (scenario.blocked) return { status: "BLOCKED", reason: scenario.blocked, criteria: [] }
  const criteria = (scenario.criteria || []).map((c) => ({ id: c.id, ...evaluateCriterion(c, ctx) }))
  const rank = { PASS: 0, "INVALID EVIDENCE": 1, "NOT RUN": 2, BLOCKED: 3, FAIL: 4 }
  const worst = criteria.reduce((acc, c) => (rank[c.status] > rank[acc] ? c.status : acc), "PASS")
  return { status: criteria.length ? worst : "NOT RUN", reason: criteria.length ? "agregado por criterios" : "sin criterios", criteria }
}

/** Tests negativos del verificador. Devuelven {id, expected, actual, ok}. */
export function runNegativeTests() {
  const head = "HEAD_A"
  const artifact = "runs/fixture/junit.xml"
  const manifest = { [artifact]: "hash-ok" }
  const base = process.cwd()
  const okExec = (over = {}) => ({
    executionId: "e1", testId: "t_good", name: "t_good", file: "tests/good.spec.ts", status: "passed",
    runId: "r1", artifactPath: artifact, codeRevision: head, context: { browser: "chromium", viewport: "1440" }, ...over,
  })
  const src = { readFile: (p) => (p === "tests/good.spec.ts" ? 'expect(state).toBe("DRAFT")' : p === "tests/send.spec.ts" ? 'expect(sent).toBe("SENT")' : "") }
  const baseCtx = { executions: [okExec()], head, manifest, baseDir: base, readFile: src.readFile }
  const results = []
  const check = (id, expected, scenario, ctx = baseCtx) => {
    const actual = evaluateScenario(scenario, ctx).status
    results.push({ id, expected, actual, ok: actual === expected })
  }
  check("NEG-01", "PASS", { criteria: [{ id: "c", testIds: ["t_good"], assertionRef: 'expect(state).toBe("DRAFT")' }] })
  check("NEG-02", "FAIL", { criteria: [{ id: "c", testIds: ["t_good"] }] }, { ...baseCtx, executions: [okExec({ status: "failed" })] })
  check("NEG-03", "NOT RUN", { criteria: [{ id: "c", testIds: ["t_missing"] }] })
  check("NEG-04", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] }, { ...baseCtx, manifest: {} })
  check("NEG-05", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"], assertionRef: 'expect(revision).toBe(2)' }] })
  check("NEG-06", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] }, { ...baseCtx, executions: [okExec({ codeRevision: "HEAD_OLD" })] })
  check("NEG-07", "INVALID EVIDENCE", { criteria: [
    { id: "send", testIds: ["t_send"], assertionRef: 'expect(sent).toBe("SENT")' },
    { id: "delete", testIds: ["t_send"], file: "tests/send.spec.ts", assertionRef: 'expect(deleted).toBe("DELETED")' },
  ] }, { ...baseCtx, executions: [okExec({ testId: "t_send", file: "tests/send.spec.ts" })] })
  check("NEG-08", "NOT RUN", { criteria: [
    { id: "a", testIds: ["t_good"] }, { id: "b", testIds: ["t_absent"] },
  ] })
  check("NEG-09", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"], viewport: "390" }] })
  check("NEG-10", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_manual"] }] }, { ...baseCtx, executions: [{
    executionId: "manual", testId: "t_manual", file: "results/manual.json", status: "passed", artifactPath: "results/manual.json",
    codeRevision: head, context: { browser: "chromium", viewport: "1440" },
  }], readFile: () => '"status": "PASS"' })
  check("NEG-11", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] },
    { ...baseCtx, executions: [okExec({ codeRevision: "HEAD_BEFORE_EDIT" })] })
  check("NEG-12", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] },
    { ...baseCtx, head: "HEAD_AFTER_CHANGE" })
  const hashFixture = path.resolve(base, "evidence/t05-final-closeout/verifier-fixtures/hash-fixture.txt")
  fs.mkdirSync(path.dirname(hashFixture), { recursive: true })
  fs.writeFileSync(hashFixture, "original")
  const goodHash = crypto.createHash("sha256").update(fs.readFileSync(hashFixture)).digest("hex")
  const hashArtifact = path.relative(base, hashFixture).replace(/\\/g, "/")
  const hashExec = okExec({ artifactPath: hashArtifact, file: hashArtifact })
  fs.writeFileSync(hashFixture, "modified-after-hash")
  check("NEG-13", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] },
    { ...baseCtx, executions: [hashExec], manifest: { [hashArtifact]: goodHash }, readFile: () => "original" })
  check("NEG-14", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"], requireAssertion: true }] })
  check("NEG-15", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"], assertionRef: "expect(true).toBe(true)" }] },
    { ...baseCtx, readFile: () => "expect(true).toBe(true)" })
  check("NEG-16", "FAIL", { criteria: [{ id: "c", testIds: ["t_good"] }] },
    { ...baseCtx, executions: [okExec({ runnerExitCode: 1 })] })
  check("NEG-17", "INVALID EVIDENCE", { criteria: [{ id: "c", testIds: ["t_good"] }] },
    { ...baseCtx, executions: [okExec({ codeChanged: true })] })
  return results
}

export function verifyAll(registry, ctx) {
  const out = {}
  for (const [id, scenario] of Object.entries(registry)) {
    out[id] = evaluateScenario(scenario, ctx)
    out[id].contractSource = scenario.contractSource
    out[id].expected = scenario.expected
  }
  return out
}
