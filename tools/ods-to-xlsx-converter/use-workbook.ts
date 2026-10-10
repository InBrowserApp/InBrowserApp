import { useSpreadsheetConversion } from "@workspace/ui/lib/use-spreadsheet-conversion"
import type { Messages } from "./types"

const createWorker = () =>
  new Worker(new URL("./worker.ts", import.meta.url), {
    type: "module",
  })

export function useWorkbook(file: File | null, messages: Messages) {
  return useSpreadsheetConversion(file, messages, "ods", createWorker)
}
