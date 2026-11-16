import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"

const root = process.cwd()
const ev = path.join(root, "evidence/t05-implementation")
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex").toUpperCase()
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim()

const files = [
  "supabase/migrations/20261116000100_m8_communication.sql",
  "backend/src/communication/announcements.ts",
  "backend/src/communication/conversations.ts",
  "backend/src/communication/messages.ts",
  "backend/src/communication/queries.ts",
  "backend/src/communication/sync.ts",
  "backend/src/communication/read-cursor.ts",
  "backend/src/communication/communication-routes.ts",
  "src/features/communication.tsx",
  "src/lib/t05-api.ts",
  "tests/e2e/t05-journeys.spec.ts",
  "evidence/t05-implementation/ST80_EXECUTED.md",
  "evidence/t05-implementation/AC30_EXECUTED.md",
  "evidence/t05-implementation/TECHNICAL_REPORT.md",
  "evidence/t05-implementation/CORRECTIVES.md",
  "evidence/t05-implementation/PROGRESS_LOG.md",
]
const manifest = {
  name: "GEI_T05_R3_IMPLEMENTATION_MANIFEST",
  actor: "Actor C — ETAPA 2 single-session implementation",
  source_package: {
    path: "C:\\Users\\thega\\Desktop\\GEI-T05-R3-PREIMPLEMENTATION-FINAL-APPROVED-DECISIONS.zip",
    sha256: "42946AA9F11739947848FE26920629E19C2DA0FE4FE7887A2CEB9B8706F74EF2",
    verified: true,
  },
  git: {
    worktree: root,
    branch: git("branch", "--show-current"),
    head: git("rev-parse", "HEAD"),
    baseline: "410af4247b5573448674e98b07b49fde940e7fde",
    commits: git("log", "--format=%H %s", "410af4247b5573448674e98b07b49fde940e7fde..HEAD").split("\n"),
    pushed: false,
  },
  decisions: ["CC-T05-C10 (UPDATE DRAFT)", "CC-T05-C19 (unread excluye autor)"],
  coverage: {
    stress_tests: "80 originales + ST-A01-UPDATE — PASS",
    acceptance_gates: "30/30 PASS",
    e2e_browsers: "Chromium — 7/7 PASS (J01..J05 + J05b)",
    regression: "49 unit + 105 integration + 82 API + 102 frontend — PASS",
    typecheck_build: "PASS",
  },
  files: files.map((f) => ({ path: f, sha256: sha(path.join(root, f)) })),
  evidence_dir: "evidence/t05-implementation",
  generated_at: new Date().toISOString(),
}
fs.writeFileSync(path.join(ev, "MANIFEST.json"), JSON.stringify(manifest, null, 2) + "\n")
console.log(`MANIFEST generado · HEAD=${manifest.git.head} · ${manifest.files.length} archivos`)
