import { createHash, randomUUID } from "node:crypto"
import { access, mkdir, readFile, rename, writeFile } from "node:fs/promises"
import { promisify } from "node:util"
import { gzip } from "node:zlib"

import catalog from "@workspace/ocr-models" with { type: "json" }

const compress = promisify(gzip)
const cache = new URL(
  `../node_modules/.cache/tesseract-models/${catalog.revision}/`,
  import.meta.url
)
const source = `https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/${catalog.revision}/`
const assetSuffix = ".traineddata.gz"

async function modelFile(code) {
  const model = catalog.models[code]
  const filename = code + assetSuffix
  if (model.preferred)
    return new URL(`./ocr-models/${filename}`, import.meta.url)

  const file = new URL(filename, cache)
  try {
    await access(file)
    return file
  } catch (error) {
    if (error.code !== "ENOENT") throw error
  }

  const response = await fetch(`${source}${code}.traineddata`, {
    signal: AbortSignal.timeout(60_000),
  })
  if (!response.ok) {
    throw new Error(
      `Could not download OCR model ${code} (HTTP ${response.status})`
    )
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  const blob = createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex")
  if (blob !== model.blob)
    throw new Error(`OCR model ${code} failed its integrity check`)

  const compressed = await compress(bytes)
  await mkdir(cache, { recursive: true })
  const pending = new URL(`${filename}.${randomUUID()}.tmp`, cache)
  await writeFile(pending, compressed)
  await rename(pending, file)
  return file
}

const publicId = "virtual:tesseract-model-urls"
const moduleId = "\0" + publicId
const devPrefix = "/@tesseract-models/"

export function tesseractModels() {
  let serving = false
  return {
    name: "tesseract-models",
    configResolved(config) {
      serving = config.command === "serve"
    },
    resolveId(id) {
      if (id === publicId) return moduleId
    },
    async load(id) {
      if (id !== moduleId) return

      const codes = Object.keys(catalog.models)
      if (serving) {
        const urls = Object.fromEntries(
          codes.map((code) => [code, devPrefix + code + assetSuffix])
        )
        return `export default ${JSON.stringify(urls)}`
      }

      const urls = new Map()
      const queue = codes.values()
      await Promise.all(
        Array.from({ length: 8 }, async () => {
          for (const code of queue) {
            const reference = this.emitFile({
              type: "asset",
              name: code + assetSuffix,
              source: await readFile(await modelFile(code)),
            })
            urls.set(code, `import.meta.ROLLUP_FILE_URL_${reference}`)
          }
        })
      )
      const entries = codes.map(
        (code) => `${JSON.stringify(code)}:${urls.get(code)}`
      )
      return `export default {${entries.join(",")}}`
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const path = request.url?.split("?")[0]
        if (!path?.startsWith(devPrefix) || !path.endsWith(assetSuffix)) {
          return next()
        }
        const code = path.slice(devPrefix.length, -assetSuffix.length)
        if (!Object.hasOwn(catalog.models, code)) return next()
        try {
          const data = await readFile(await modelFile(code))
          response.setHeader("Content-Type", "application/gzip")
          response.end(data)
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
