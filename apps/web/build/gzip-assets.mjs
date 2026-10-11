import { readFile } from "node:fs/promises"
import { basename } from "node:path"
import { gzipSync } from "node:zlib"
import { createHash } from "node:crypto"

// Explicit opt-in for large, lazily loaded assets. The original file is never
// emitted; callers inflate the compressed response before using its bytes.
export function gzipAssets() {
  const suffix = "?gzip-url"
  const chunksSuffix = "?gzip-chunks"
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
      const ending = source.endsWith(chunksSuffix) ? chunksSuffix : suffix
      if (!source.endsWith(ending)) return
      const resolved = await this.resolve(
        source.slice(0, -ending.length),
        importer
      )
      if (!resolved)
        throw new Error(`Cannot resolve compressed asset: ${source}`)
      return (
        prefix + resolved.id + (ending === chunksSuffix ? chunksSuffix : "")
      )
    },
    async load(id) {
      if (!id.startsWith(prefix)) return
      const chunked = id.endsWith(chunksSuffix)
      const path = id.slice(
        prefix.length,
        chunked ? -chunksSuffix.length : undefined
      )
      this.addWatchFile(path)
      const bytes = gzipSync(await readFile(path), { level: 9 })
      // A single static asset may be at most 25 MiB on the deployment host.
      // Split the compressed stream; callers concatenate it before inflating.
      const size = chunked ? 20 * 1024 * 1024 : bytes.length
      const urls = []
      for (let offset = 0; offset < bytes.length; offset += size) {
        const part = bytes.subarray(offset, offset + size)
        if (serving) {
          const hash = createHash("sha256").update(part).digest("hex")
          const url = `/@gzip-assets/${hash}.gz`
          development.set(url, part)
          urls.push(JSON.stringify(url))
        } else {
          const reference = this.emitFile({
            type: "asset",
            name: `${basename(path)}${chunked ? `.${offset / size}` : ""}.gz`,
            source: part,
          })
          urls.push(`import.meta.ROLLUP_FILE_URL_${reference}`)
        }
      }
      return `export default ${chunked ? `[${urls.join(",")}]` : urls[0]}`
    },
  }
}
