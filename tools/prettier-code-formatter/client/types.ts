import type { Dispatch, SetStateAction } from "react"

import type {
  PrettierFormatOptions,
  PrettierFormatRequest,
} from "../core/prettier-languages"

export type PrettierCodeFormatterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputLabel: string
  inputDescription: string
  inputPlaceholder: string
  outputLabel: string
  outputDescription: string
  outputEmptyDescription: string
  formattingLabel: string
  formatErrorLabel: string
  optionsLabel: string
  optionsDescription: string
  languageLabel: string
  printWidthLabel: string
  tabWidthLabel: string
  indentationLegend: string
  styleLegend: string
  useTabsLabel: string
  semicolonsLabel: string
  singleQuotesLabel: string
  trailingCommaLabel: string
  trailingCommaNoneLabel: string
  trailingCommaEs5Label: string
  trailingCommaAllLabel: string
  useSampleLabel: string
  clearLabel: string
  importFromFileLabel: string
  formatNowLabel: string
  formatPausedHint: string
  copyFormattedLabel: string
  copiedLabel: string
  downloadFormattedLabel: string
}>

export type PrettierOutputState =
  | {
      state: "empty"
    }
  | {
      state: "formatting"
    }
  | {
      state: "formatted"
      request: PrettierFormatRequest
      formatted: string
    }
  | {
      state: "error"
      request: PrettierFormatRequest
      message: string
    }

export type PrettierCodeFormatterClientProps = Readonly<{
  messages: PrettierCodeFormatterMessages
}>

export type PrettierFormatOptionsSetter = Dispatch<
  SetStateAction<PrettierFormatOptions>
>
