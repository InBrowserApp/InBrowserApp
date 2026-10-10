import { failure } from "./errors"
import { formatPresentation } from "./format"
import type { Request, Result } from "./types"

export async function convert({ source, labels }: Request): Promise<Result> {
  try {
    const bytes = new Uint8Array(await source.file.arrayBuffer())
    return { text: formatPresentation(bytes, labels) }
  } catch (reason) {
    return { error: failure(reason) }
  }
}
