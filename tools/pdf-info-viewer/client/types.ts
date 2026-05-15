import type { ToolMeta } from "@workspace/tool-sdk"

type PdfInfoViewerMessages = Readonly<{
  meta: ToolMeta
  dragDropOrClick: string
  supportedFormats: string
  uploadHint: string
  selectedPdf: string
  changeFile: string
  removeFile: string
  fileSize: string
  documentResults: string
  resultsDescription: string
  copyAsJson: string
  copiedJson: string
  downloadJson: string
  pageCount: string
  pdfVersion: string
  encryptionStatus: string
  encrypted: string
  notEncrypted: string
  firstPageSize: string
  noFileTitle: string
  noFileDescription: string
  readingTitle: string
  readingDescription: string
  encryptedTitle: string
  encryptedDescription: string
  noMetadataTitle: string
  noMetadataDescription: string
  errorTitle: string
  parseError: string
  unsupportedFile: string
  sectionFile: string
  sectionDocument: string
  sectionMetadata: string
  fieldName: string
  fieldValue: string
  fieldFileName: string
  fieldFileSize: string
  fieldFileType: string
  fieldLastModified: string
  fieldPageCount: string
  fieldPdfVersion: string
  fieldEncrypted: string
  fieldFirstPageSize: string
  fieldTitle: string
  fieldAuthor: string
  fieldSubject: string
  fieldKeywords: string
  fieldCreator: string
  fieldProducer: string
  fieldCreationDate: string
  fieldModificationDate: string
  notAvailable: string
}>

export type { PdfInfoViewerMessages }
