import { decodeWebDocument } from "@workspace/web-document"
import { preparePrintDocument } from "@workspace/web-document/print"
import { failure } from "./errors"

export function prepare(bytes: Uint8Array, xhtml: boolean) {
  let source: string
  try {
    source = decodeWebDocument(bytes)
  } catch (reason) {
    if (failure(reason).code === "resource") throw reason
    throw new Error("encoding")
  }
  return preparePrintDocument(source, xhtml)
}
