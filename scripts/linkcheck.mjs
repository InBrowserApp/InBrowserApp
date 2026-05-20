// Seeds linkinator with the home page of every supported site language.
// Static HTML alone doesn't link to non-default-language variants — the
// language switcher is a client-rendered Radix dropdown whose <a> tags
// aren't in the DOM until hydration, and the <link rel="alternate"
// hreflang> tags point at absolute production URLs that the skip regex
// drops. So a single recurse-from-root crawl would miss every
// non-English subtree.
//
// We discover language dirs by reading dist/ rather than importing from
// apps/web/src/lib/site.ts so this script stays drift-proof and doesn't
// need to bridge the workspace boundary.
import { existsSync, readdirSync } from "node:fs"
import { spawn } from "node:child_process"

const DIST = "apps/web/dist"

if (!existsSync(DIST)) {
  console.error(`${DIST} not found. Run \`pnpm build\` first.`)
  process.exit(1)
}

const LANG_DIR = /^[a-z]{2}(-[A-Za-z]{2,4})?$/

const langDirs = readdirSync(DIST, { withFileTypes: true })
  .filter((e) => e.isDirectory() && LANG_DIR.test(e.name))
  .map((e) => e.name)
  .sort()

const seeds = ["index.html", ...langDirs.map((d) => `${d}/index.html`)]

spawn("linkinator", [...seeds, "--config", ".linkinator.config.json"], {
  stdio: "inherit",
}).on("exit", (code) => process.exit(code ?? 1))
