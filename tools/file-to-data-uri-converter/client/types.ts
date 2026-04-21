import type { FileToDataUriAnalysis } from "../core/data-uri"

type FileToDataUriConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  file: string
  dragOrClick: string
  clearFile: string
  dataUri: string
  dataUriPlaceholder: string
  onlyOneFile: string
  readFailed: string
  unknownType: string
  fileSize: string
  mimeType: string
  copyLabel: string
  copiedLabel: string
}>

type FileToDataUriConverterMessagesCatalog = Omit<
  FileToDataUriConverterMessages,
  "meta"
>
type FileToDataUriConversionAnalysis = FileToDataUriAnalysis

export type {
  FileToDataUriConversionAnalysis,
  FileToDataUriConverterMessages,
  FileToDataUriConverterMessagesCatalog,
}
