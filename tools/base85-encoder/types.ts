import type { Base85Variant } from "./core/base85-encoder"

type Base85EncoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  configurationLabel: string
  configurationDescription: string
  alphabetLabel: string
  ascii85Label: string
  z85Label: string
  inputLabel: string
  inputPlaceholder: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  encodedOutputLabel: string
  encodedOutputDescription: string
  emptyStateDescription: string
  downloadFileLabel: string
  copyResultLabel: string
  copiedLabel: string
  invalidLengthTitle: string
  fileReadFailedTitle: string
}>

type EncodingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; encodedText: string }
  | { status: "error"; message: string }

type Base85EncoderClientProps = Readonly<{
  messages: Base85EncoderMessages
}>

type ConfigurationCardMessages = Pick<
  Base85EncoderMessages,
  | "configurationLabel"
  | "configurationDescription"
  | "alphabetLabel"
  | "ascii85Label"
  | "z85Label"
>

type InputCardMessages = Pick<
  Base85EncoderMessages,
  | "inputLabel"
  | "inputPlaceholder"
  | "plainTextLabel"
  | "plainTextDescription"
  | "importFromFileLabel"
>

type OutputCardMessages = Pick<
  Base85EncoderMessages,
  | "encodedOutputLabel"
  | "encodedOutputDescription"
  | "emptyStateDescription"
  | "downloadFileLabel"
  | "copyResultLabel"
  | "copiedLabel"
>

export type {
  Base85EncoderClientProps,
  ConfigurationCardMessages,
  EncodingState,
  InputCardMessages,
  OutputCardMessages,
  Base85Variant,
}
