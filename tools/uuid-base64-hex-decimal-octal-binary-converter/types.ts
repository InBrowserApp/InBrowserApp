import type { UuidFormat } from "./core/uuid-converter"

type FormatCopy = Readonly<{
  label: string
  description: string
  placeholder: string
  copyLabel: string
  invalidMessage: string
}>

type UuidBaseConverterMessagesCatalog = Readonly<{
  actionsLabel: string
  generateUuidLabel: string
  loadSampleLabel: string
  clearAllLabel: string
  copiedLabel: string
  invalidValueTitle: string
  invalidValueDescription: string
  cryptoUnavailableTitle: string
  cryptoUnavailableDescription: string
  formats: Record<UuidFormat, FormatCopy>
}>

type UuidBaseConverterPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  UuidBaseConverterMessagesCatalog

export type {
  FormatCopy,
  UuidBaseConverterMessagesCatalog,
  UuidBaseConverterPageMessages,
}
