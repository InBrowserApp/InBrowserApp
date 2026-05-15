type Argon2HashPasswordVerifierMessages = Readonly<{
  formLabel: string
  formDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  passwordDescription: string
  hashLabel: string
  hashPlaceholder: string
  hashDescription: string
  secretLabel: string
  secretPlaceholder: string
  secretDescription: string
  showPasswordLabel: string
  hidePasswordLabel: string
  showSecretLabel: string
  hideSecretLabel: string
  verifyButtonLabel: string
  verifyingButtonLabel: string
  resetButtonLabel: string
  resultLabel: string
  resultDescription: string
  idleTitle: string
  idleDescription: string
  verifyingTitle: string
  verifyingDescription: string
  verifiedTitle: string
  verifiedDescription: string
  mismatchTitle: string
  mismatchDescription: string
  invalidTitle: string
  invalidDescription: string
  hashDetailsLabel: string
  variantLabel: string
  versionLabel: string
  memoryCostLabel: string
  iterationsLabel: string
  parallelismLabel: string
  saltLengthLabel: string
  digestLengthLabel: string
  notAvailableLabel: string
}>

type Argon2HashPasswordVerifierPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Argon2HashPasswordVerifierMessages

export type {
  Argon2HashPasswordVerifierMessages,
  Argon2HashPasswordVerifierPageMessages,
}
