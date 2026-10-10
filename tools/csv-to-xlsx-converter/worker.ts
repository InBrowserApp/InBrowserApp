import type { WorkBook } from "xlsx"
import { readDelimited } from "./core/workbook"
import { failure, writeXlsx, preview } from "@workspace/spreadsheet-conversion"
import { defaultOptions } from "./options"
import type { ImportOptions } from "./options"
import type { Request, Response } from "./types"

declare const self: DedicatedWorkerGlobalScope
let workbook: WorkBook
let options = defaultOptions
const send = (message: Response, transfer: Transferable[] = []) =>
  self.postMessage(message, transfer)
self.onmessage = async ({
  data,
}: MessageEvent<Request | { type: "configure"; options: ImportOptions }>) => {
  try {
    if (data.type === "configure") {
      options = data.options
    } else if (data.type === "open") {
      const { book, info } = readDelimited(
        new Uint8Array(await data.file.arrayBuffer()),
        data.file.name,
        options
      )
      workbook = book
      const bytes = writeXlsx(workbook)
      send({ type: "ready", info, bytes }, [bytes])
    } else {
      send({
        type: "preview",
        id: data.id,
        preview: preview(workbook, data.sheet, data.row, data.column),
      })
    }
  } catch (reason) {
    send({ type: "error", error: failure(reason) })
  }
}
