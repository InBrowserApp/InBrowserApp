import { decode, failure } from "./core/decode"
import { find } from "./core/search"
import { floorIndex } from "./core/text-index"
import type { Request, Response, Match } from "./types"
let loaded: Awaited<ReturnType<typeof decode>>
let latest = 0
self.onmessage = async (event: MessageEvent<Request>) => {
  const request = event.data
  latest = request.id
  try {
    if (request.kind === "open")
      loaded = await decode(request.file, request.encoding)
    const { index, encoding } = loaded
    let section = index.section(0),
      target: number | undefined
    let match: Match | null | undefined
    if (request.kind === "section") {
      section = index.section(request.index)
      target = section.rows[0]?.line
    }
    if (request.kind === "end") {
      section = index.section(index.sections.length - 1)
      target = index.lines.length
    }
    if (request.kind === "line") {
      const line = Math.min(
        index.lines.length,
        Math.max(1, Math.trunc(request.line))
      )
      target = line
      section = index.at(index.lines[line - 1]!)
    }
    if (request.kind === "search") {
      match = await find(
        index,
        request.query,
        request.from,
        request.direction,
        () => latest !== request.id
      )
      if (match) {
        section = index.at(match.offset)
        target = floorIndex(index.lines, match.offset) + 1
      }
    }
    if (latest === request.id)
      self.postMessage({
        id: request.id,
        metadata: {
          encoding,
          lines: index.length ? index.lines.length : 0,
          sections: index.sections.length,
        },
        section,
        match,
        target,
        end: request.kind === "end",
      } satisfies Response)
  } catch (error) {
    if (latest === request.id)
      self.postMessage({
        id: request.id,
        error: failure(error),
      } satisfies Response)
  }
}
