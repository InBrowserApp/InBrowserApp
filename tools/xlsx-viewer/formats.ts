export const extensions = [
  "xlsx",
  "xlsm",
  "xltx",
  "xltm",
  "xls",
  "xlsb",
  "csv",
  "tsv",
  "ods",
  "fods",
  "numbers",
  "et",
  "ett",
  "uos",
  "dif",
  "slk",
  "prn",
  "dbf",
  "wk1",
  "wk3",
  "wk4",
  "wks",
  "123",
  "wq1",
  "wq2",
  "wb1",
  "wb2",
  "wb3",
  "qpw",
  "xlr",
  "eth",
]
export const acceptedFiles = extensions.map((value) => `.${value}`).join(",")
export const extension = (name: string) => name.split(".").at(-1)!.toLowerCase()
export const isDelimited = (name: string) => /\.(csv|tsv)$/i.test(name)
export const isModernExcel = (name: string) =>
  /\.(xlsx|xlsm|xltx|xltm)$/i.test(name)
export type ImportOptions = { delimiter: string; encoding: string }
export const defaultImportOptions: ImportOptions = {
  delimiter: "auto",
  encoding: "auto",
}
export type ImportNotice =
  | "dataOnly"
  | "numbersTables"
  | "encodingFallback"
  | "unevenRows"
export type ImportResult = {
  data: ArrayBuffer
  names: string[]
  notices: ImportNotice[]
}
