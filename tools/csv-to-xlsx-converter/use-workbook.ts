import { useCallback } from "react"
import { useSpreadsheetConversion } from "@workspace/ui/lib/use-spreadsheet-conversion"
import type { ImportOptions } from "./options"
import type { Messages } from "./types"

export function useWorkbook(
  file: File | null,
  messages: Messages,
  options: ImportOptions
) {
  const createWorker = useCallback(() => {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    })
    worker.postMessage({ type: "configure", options })
    return worker
  }, [options])
  const extension = file?.name.toLowerCase().endsWith(".tsv") ? "tsv" : "csv"
  return useSpreadsheetConversion(file, messages, extension, createWorker)
}
