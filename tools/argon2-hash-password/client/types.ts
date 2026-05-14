import type { Argon2Algorithm } from "../core/argon2"

type Argon2Option = Readonly<{
  value: Argon2Algorithm
  label: string
}>

type Argon2HashPasswordMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  algorithmLabel: string
  secretLabel: string
  secretPlaceholder: string
  secretDescription: string
  parametersLabel: string
  parametersDescription: string
  iterationsLabel: string
  memorySizeLabel: string
  parallelismLabel: string
  hashLengthLabel: string
  iterationsInvalidMessage: string
  memorySizeInvalidMessage: string
  memoryDependencyInvalidMessage: string
  parallelismInvalidMessage: string
  hashLengthInvalidMessage: string
  estimatedMemoryLabel: string
  saltLabel: string
  saltDescription: string
  saltInvalidBase64Message: string
  saltTooShortMessage: string
  generateSaltLabel: string
  hashResultLabel: string
  hashResultDescription: string
  generateHashLabel: string
  generatingHashLabel: string
  emptyStateTitle: string
  emptyStateDescription: string
  invalidConfigurationMessage: string
  hashErrorMessage: string
  copyHashLabel: string
  copiedLabel: string
  encodedHashLabel: string
}>

type Argon2HashPasswordPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Argon2HashPasswordMessages

export type {
  Argon2HashPasswordMessages,
  Argon2HashPasswordPageMessages,
  Argon2Option,
}
