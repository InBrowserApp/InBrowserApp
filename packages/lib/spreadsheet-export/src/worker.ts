import { readWorkbook } from "./read-workbook"
import type { Workbook } from "./read-workbook"
import { exportWorksheet } from "./export-worksheet"
import { failure } from "./errors"
import type { Request, Response } from "./types"

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<Request>) => void) | null
  postMessage: (response: Response) => void
}
let workbook: Workbook | undefined
const pending = new Map<number, AbortController>()
scope.onmessage = async ({ data }) => {
  if (data.type === "cancel") {
    pending.get(data.id)?.abort()
    return
  }
  const controller = new AbortController()
  if (data.type === "export") pending.set(data.id, controller)
  try {
    if (data.type === "open") {
      workbook = await readWorkbook(data.source)
      scope.postMessage({ type: "open", sheets: workbook.sheets })
    } else {
      if (!workbook) throw new Error("invalid")
      const output = await exportWorksheet(
        workbook,
        data.options,
        controller.signal
      )
      scope.postMessage({ type: "export", id: data.id, output })
    }
  } catch (reason) {
    if (!controller.signal.aborted)
      scope.postMessage({
        type: "error",
        id: data.type === "export" ? data.id : undefined,
        error: failure(reason),
      })
  } finally {
    if (data.type === "export") pending.delete(data.id)
  }
}
