import type { AesEncryptedEnvelope } from "../core/aes-decryptor"

type AesDecryptorMessages = Readonly<{
  meta: { name: string; description: string }
  inputCardTitle: string
  inputCardDescription: string
  jsonInputLabel: string
  jsonInputPlaceholder: string
  fileInputLabel: string
  fileInputDescription: string
  chooseFileLabel: string
  selectedFileLabel: string
  clearFileLabel: string
  keyCardTitle: string
  keyCardDescription: string
  envelopeKeySourceLabel: string
  passwordSourceLabel: string
  rawKeySourceLabel: string
  passwordLabel: string
  passwordPlaceholder: string
  rawKeyLabel: string
  rawKeyPlaceholder: string
  envelopeCardTitle: string
  envelopeCardDescription: string
  emptyEnvelopeTitle: string
  emptyEnvelopeDescription: string
  invalidEnvelopeTitle: string
  modeLabel: string
  keyLengthLabel: string
  keySourceLabel: string
  pbkdf2HashLabel: string
  pbkdf2IterationsLabel: string
  plaintextTypeLabel: string
  fileNameLabel: string
  fileSizeLabel: string
  decryptLabel: string
  resetLabel: string
  resultCardTitle: string
  resultCardDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  plaintextResultLabel: string
  fileResultTitle: string
  fileResultDescription: string
  copyPlaintextLabel: string
  copiedLabel: string
  downloadPlaintextLabel: string
  downloadFileLabel: string
  errorTitle: string
  validationInputRequired: string
  validationEnvelopeInvalid: string
  validationPasswordRequired: string
  validationRawKeyRequired: string
  validationRawKeyInvalid: string
  errorDecryptFailed: string
  textPlaintextLabel: string
  filePlaintextLabel: string
}>

type ParsedEnvelopeState =
  | Readonly<{ status: "empty"; envelope: null; error: "" }>
  | Readonly<{ status: "valid"; envelope: AesEncryptedEnvelope; error: "" }>
  | Readonly<{ status: "invalid"; envelope: null; error: string }>

type DecryptOutput = Readonly<{
  bytes: Uint8Array
  text: string
  fileName: string
  mimeType: string
  isFile: boolean
}>

export type { AesDecryptorMessages, DecryptOutput, ParsedEnvelopeState }
