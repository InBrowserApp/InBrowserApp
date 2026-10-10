import type { WorkBook } from "xlsx"
import { readOds } from "./core/workbook"
import { failure, writeXlsx, preview } from "@workspace/spreadsheet-conversion"
import type { Request, Response } from "./types"

declare const self: DedicatedWorkerGlobalScope
let workbook: WorkBook
const send = (message: Response, transfer: Transferable[] = []) =>
  self.postMessage(message, transfer)
self.onmessage = async ({ data }: MessageEvent<Request>) => {
  try {
    if (data.type === "open") {
      const { book, info } = readOds(
        new Uint8Array(await data.file.arrayBuffer())
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
