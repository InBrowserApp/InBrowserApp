import { CsrGeneratorError, splitSanInput } from "../core/csr"
import type {
  CsrOutput,
  EcCurve,
  HashAlgorithm,
  KeyAlgorithm,
  KeySource,
  RsaKeySize,
  SubjectInput,
} from "../core/csr"
import type { CsrGenerationResult } from "./result-card"
import type { SanTextFields } from "./san-card"
import type { CsrGeneratorMessages } from "./types"

type StoredPreferences = Partial<{
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
}>

const STORAGE_KEY = "tools:csr-generator:preferences"

const defaultSubject: SubjectInput = {
  commonName: "",
  organization: "",
  organizationalUnit: "",
  country: "",
  state: "",
  locality: "",
  emailAddress: "",
}

const defaultSan: SanTextFields = {
  dns: "",
  ip: "",
  email: "",
  uri: "",
}

function parseStoredPreferences(): StoredPreferences {
  if (typeof window === "undefined") return {}

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as StoredPreferences) : {}
  } catch {
    return {}
  }
}

function getInitialPreferences() {
  const stored = parseStoredPreferences()
  return {
    keySource: stored.keySource === "import" ? "import" : "generate",
    algorithm: stored.algorithm === "ecdsa" ? "ecdsa" : "rsa",
    rsaKeySize: isRsaKeySize(stored.rsaKeySize) ? stored.rsaKeySize : 2048,
    rsaHash: isHashAlgorithm(stored.rsaHash) ? stored.rsaHash : "SHA-256",
    ecCurve: isEcCurve(stored.ecCurve) ? stored.ecCurve : "P-256",
  } as const
}

function persistPreferences(preferences: Required<StoredPreferences>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
}

function isRsaKeySize(value: unknown): value is RsaKeySize {
  return value === 2048 || value === 3072 || value === 4096
}

function isHashAlgorithm(value: unknown): value is HashAlgorithm {
  return value === "SHA-256" || value === "SHA-384" || value === "SHA-512"
}

function isEcCurve(value: unknown): value is EcCurve {
  return value === "P-256" || value === "P-384" || value === "P-521"
}

function toGenerationResult(
  output: CsrOutput,
  subject: SubjectInput,
  san: SanTextFields,
  messages: CsrGeneratorMessages
): CsrGenerationResult {
  return {
    ...output,
    subjectSummary: formatSubjectSummary(subject, messages),
    sanSummary: formatSanSummary(san, messages),
    generatedAt: new Date().toLocaleString(),
  }
}

function formatSubjectSummary(
  subject: SubjectInput,
  messages: CsrGeneratorMessages
) {
  const parts = [
    subject.commonName && `CN=${subject.commonName.trim()}`,
    subject.organization && `O=${subject.organization.trim()}`,
    subject.organizationalUnit && `OU=${subject.organizationalUnit.trim()}`,
    subject.country && `C=${subject.country.trim()}`,
    subject.state && `ST=${subject.state.trim()}`,
    subject.locality && `L=${subject.locality.trim()}`,
    subject.emailAddress && `emailAddress=${subject.emailAddress.trim()}`,
  ].filter(Boolean)

  return parts.length ? parts.join(", ") : messages.noSubjectLabel
}

function formatSanSummary(san: SanTextFields, messages: CsrGeneratorMessages) {
  const counts = [
    { label: "DNS", count: splitSanInput(san.dns).length },
    { label: "IP", count: splitSanInput(san.ip).length },
    { label: "Email", count: splitSanInput(san.email).length },
    { label: "URI", count: splitSanInput(san.uri).length },
  ]
    .filter((entry) => entry.count > 0)
    .map((entry) => `${entry.label}: ${entry.count}`)

  return counts.length ? counts.join(", ") : messages.noSanLabel
}

function formatError(error: unknown, messages: CsrGeneratorMessages) {
  if (error instanceof CsrGeneratorError) {
    const template = messages[error.key]
    return error.params
      ? Object.entries(error.params).reduce(
          (message, [key, value]) => message.replace(`{${key}}`, value),
          template
        )
      : template
  }

  return error instanceof Error ? error.message : String(error)
}

export {
  defaultSan,
  defaultSubject,
  formatError,
  getInitialPreferences,
  persistPreferences,
  toGenerationResult,
}
