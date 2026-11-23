import { rename, rm, writeFile } from "node:fs/promises"

const repository = "https://api.github.com/repos/tldr-pages/tldr"
const reference = process.argv[2] ?? "main"
const destination = new URL("./commands.json", import.meta.url)
const temporary = new URL(`./commands.json.${process.pid}.tmp`, import.meta.url)

async function github(path) {
  const response = await fetch(repository + path, {
    headers: { Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`GitHub ${path}: ${response.status}`)
  return response.json()
}

const commit = await github(`/commits/${encodeURIComponent(reference)}`)
const { tree, truncated } = await github(
  `/git/trees/${commit.commit.tree.sha}?recursive=1`
)
if (truncated) throw new Error("GitHub returned an incomplete upstream tree")

const pages = new Map()
for (const { path, type } of tree) {
  const page =
    /^pages(?:\.([a-z]{2,3}(?:_[A-Z]{2})?))?\/([\w-]+)\/([^/]+)\.md$/.exec(path)
  if (type !== "blob" || !page) continue

  const [, locale = "en", platform, command] = page
  if (!pages.has(command)) pages.set(command, new Map())
  const targets = pages.get(command)
  if (!targets.has(platform)) targets.set(platform, [])
  targets.get(platform).push(locale)
}
if (!pages.size) throw new Error("No tldr pages found")

const commands = [...pages.keys()]
  .sort()
  .map((name) => [
    name,
    Object.fromEntries(
      [...pages.get(name)]
        .sort(([left], [right]) => (left < right ? -1 : 1))
        .map(([platform, locales]) => [platform, locales.sort()])
    ),
  ])
const rows = commands.map((command) => "    " + JSON.stringify(command))
const output = `{\n  "revision": "${commit.sha}",\n  "commands": [\n${rows.join(",\n")}\n  ]\n}\n`
try {
  await writeFile(temporary, output)
  await rename(temporary, destination)
} finally {
  await rm(temporary, { force: true })
}
console.log(`Indexed ${commands.length} commands at ${commit.sha}`)
