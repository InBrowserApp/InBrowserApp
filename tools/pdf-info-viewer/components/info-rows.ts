import { formatBytes, formatDateTime, formatPageSize } from "../core/pdf-info"

import type { PdfInfoViewerMessages } from "../client/types"
import type { PdfInfo } from "../core/pdf-info"

type ResultRow = Readonly<{
  label: string
  value: string | undefined
}>

type DisplayRow = Readonly<{
  label: string
  value: string
}>

function getFileRows(
  info: PdfInfo,
  language: string,
  messages: PdfInfoViewerMessages
): DisplayRow[] {
  return [
    { label: messages.fieldFileName, value: info.file.name },
    { label: messages.fieldFileSize, value: formatBytes(info.file.size) },
    { label: messages.fieldFileType, value: info.file.type },
    {
      label: messages.fieldLastModified,
      value: formatDateTime(info.file.lastModified, language) || undefined,
    },
  ].map((row) => withFallback(row, messages))
}

function getDocumentRows(
  info: PdfInfo,
  messages: PdfInfoViewerMessages
): DisplayRow[] {
  return [
    {
      label: messages.fieldPageCount,
      value: formatMetric(info.document.pageCount, messages),
    },
    {
      label: messages.fieldPdfVersion,
      value: info.document.version ?? messages.notAvailable,
    },
    {
      label: messages.fieldEncrypted,
      value: info.document.encrypted
        ? messages.encrypted
        : messages.notEncrypted,
    },
    {
      label: messages.fieldFirstPageSize,
      value: formatPageSize(info.document.firstPageSize),
    },
  ].map((row) => withFallback(row, messages))
}

function getMetadataRows(
  info: PdfInfo,
  language: string,
  messages: PdfInfoViewerMessages
): DisplayRow[] {
  return [
    { label: messages.fieldTitle, value: info.metadata.title },
    { label: messages.fieldAuthor, value: info.metadata.author },
    { label: messages.fieldSubject, value: info.metadata.subject },
    {
      label: messages.fieldKeywords,
      value: info.metadata.keywords?.join(", "),
    },
    { label: messages.fieldCreator, value: info.metadata.creator },
    { label: messages.fieldProducer, value: info.metadata.producer },
    {
      label: messages.fieldCreationDate,
      value: formatDateTime(info.metadata.creationDate, language),
    },
    {
      label: messages.fieldModificationDate,
      value: formatDateTime(info.metadata.modificationDate, language),
    },
  ]
    .map((row) => withFallback(row, messages))
    .filter((row) => row.value !== messages.notAvailable)
}

function withFallback(row: ResultRow, messages: PdfInfoViewerMessages) {
  return {
    ...row,
    value: row.value || messages.notAvailable,
  }
}

function formatMetric(
  value: number | undefined,
  messages: PdfInfoViewerMessages
) {
  return value === undefined ? messages.notAvailable : String(value)
}

export { formatMetric, getDocumentRows, getFileRows, getMetadataRows }
export type { DisplayRow, ResultRow }
