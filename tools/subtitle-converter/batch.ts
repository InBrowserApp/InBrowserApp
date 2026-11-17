import { strToU8, zipSync } from "fflate"
import { convertSubtitle, decodeFile, outputFilename } from "./core/convert"
import { SubtitleError, type Options } from "./core/formats"

export type Conversion =
  | { name: string; result: ReturnType<typeof convertSubtitle>; error?: never }
  | { name: string; result?: never; error: string }

export async function convertBatch(
  files: File[],
  input: string,
  encoding: string,
  options: Options
): Promise<Conversion[]> {
  const sources = files.length ? files : [null]
  const results = await Promise.all(
    sources.map(async (file): Promise<Conversion> => {
      const name = outputFilename(file?.name ?? "subtitles", options.target)
      try {
        const text = file
          ? decodeFile(await file.arrayBuffer(), encoding)
          : input
        return { name, result: convertSubtitle(text, options) }
      } catch (error) {
        return {
          name,
          error: error instanceof SubtitleError ? error.code : "readError",
        }
      }
    })
  )
  const names = new Set<string>()
  return results.map((result) => {
    let name = result.name
    let index = 2
    while (names.has(name.toLowerCase()))
      name = result.name.replace(/(\.[^.]+)$/, ` (${index++})$1`)
    names.add(name.toLowerCase())
    return { ...result, name }
  })
}

export function batchZip(results: Conversion[]) {
  const entries = Object.fromEntries(
    results
      .filter((item) => item.result)
      .map((item) => [item.name, strToU8(item.result!.output)])
  )
  return new Blob([new Uint8Array(zipSync(entries))], {
    type: "application/zip",
  })
}
