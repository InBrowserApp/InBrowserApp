export type ImportOptions = {
  delimiter: string
  encoding: string
  header: boolean
}
export const defaultOptions: ImportOptions = {
  delimiter: "auto",
  encoding: "auto",
  header: false,
}
