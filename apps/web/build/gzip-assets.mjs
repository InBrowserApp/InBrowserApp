import { readFile } from "node:fs/promises"
import { basename } from "node:path"
import { gzipSync } from "node:zlib"
import { createHash } from "node:crypto"

// Explicit opt-in for large, lazily loaded assets. The original file is never
// emitted; callers inflate the compressed response before using its bytes.
export function gzipAssets() {
  const suffix = "?gzip-url"
  const prefix = "\0gzip-asset:"
  const development = new Map()
  let serving = false
  return {
    name: "gzip-assets",
    enforce: /** @type {const} */ ("pre"),
    configResolved(config) {
      serving = config.command === "serve"
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const bytes = development.get(request.url)
        if (!bytes) return next()
        response.setHeader("Content-Type", "application/gzip")
        response.end(bytes)
      })
    },
    async resolveId(source, importer) {
      if (!source.endsWith(suffix)) return
      const resolved = await this.resolve(
        source.slice(0, -suffix.length),
        importer
      )
      if (!resolved)
        throw new Error(`Cannot resolve compressed asset: ${source}`)
      return prefix + resolved.id
    },
    async load(id) {
      if (!id.startsWith(prefix)) return
      const path = id.slice(prefix.length)
      this.addWatchFile(path)
      const bytes = gzipSync(await readFile(path), { level: 9 })
      if (serving) {
        const hash = createHash("sha256").update(bytes).digest("hex")
        const url = `/@gzip-assets/${hash}.gz`
        development.set(url, bytes)
        return `export default ${JSON.stringify(url)}`
      }
      const reference = this.emitFile({
        type: "asset",
        name: `${basename(path)}.gz`,
        source: bytes,
      })
      return `export default import.meta.ROLLUP_FILE_URL_${reference}`
    },
  }
}
