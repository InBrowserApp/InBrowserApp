import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { parseArgs } from "node:util"
import { createSnapshot, sources } from "./registry-data.mjs"

const { values } = parseArgs({
  options: {
    "source-dir": { type: "string" },
    "retrieved-at": { type: "string" },
  },
})

const downloads = await Promise.all(
  sources.map(async (source) => {
    if (values["source-dir"]) {
      return {
        source,
        raw: await readFile(join(values["source-dir"], source.filename)),
      }
    }
    const response = await fetch(source.url, {
      headers: { "user-agent": "InBrowser.App MAC registry updater" },
    })
    if (!response.ok) {
      throw new Error(`${source.url}: HTTP ${response.status}`)
    }
    return {
      source,
      raw: Buffer.from(await response.arrayBuffer()),
      lastModified: response.headers.get("last-modified"),
      etag: response.headers.get("etag"),
    }
  })
)

const { snapshot, metadata } = createSnapshot(
  downloads,
  values["retrieved-at"] ?? new Date().toISOString()
)

await writeFile(
  new URL("../data/registry.json", import.meta.url),
  `${JSON.stringify(snapshot)}\n`
)
await writeFile(
  new URL("../data/sources.json", import.meta.url),
  `${JSON.stringify(metadata, null, 2)}\n`
)
console.log(
  `Updated ${metadata.totalRecords} assignments from ${metadata.sources.length} IEEE registries.`
)
