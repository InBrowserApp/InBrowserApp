type AesEncryptorMessages = Readonly<{
  meta: { name: string; description: string }
  inputCardTitle: string
  inputCardDescription: string
  textInputLabel: string
  textInputPlaceholder: string
  fileInputLabel: string
  fileInputDescription: string
  chooseFileLabel: string
  selectedFileLabel: string
  clearFileLabel: string
  keyCardTitle: string
  keyCardDescription: string
  keySourceLabel: string
  passwordSourceLabel: string
  rawKeySourceLabel: string
  passwordLabel: string
  passwordPlaceholder: string
  rawKeyLabel: string
  rawKeyPlaceholder: string
  optionsCardTitle: string
  optionsCardDescription: string
  modeLabel: string
  keyLengthLabel: string
  pbkdf2IterationsLabel: string
  pbkdf2HashLabel: string
  gcmModeLabel: string
  cbcModeLabel: string
  ctrModeLabel: string
  sha256Label: string
  sha384Label: string
  sha512Label: string
  encryptLabel: string
  resetLabel: string
  resultCardTitle: string
  resultCardDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  copyJsonLabel: string
  copiedLabel: string
  downloadJsonLabel: string
  errorTitle: string
  securityNoteTitle: string
  gcmNote: string
  cbcWarning: string
  ctrWarning: string
  validationInputRequired: string
  validationPasswordRequired: string
  validationRawKeyRequired: string
  validationRawKeyInvalid: string
  validationIterationsInvalid: string
}>

type SelectOption<TValue extends string> = Readonly<{
  value: TValue
  label: string
}>

export type { AesEncryptorMessages, SelectOption }
