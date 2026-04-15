import type {
  StrengthReport,
  StrengthSuggestionKey,
  StrengthWarningKey,
} from "../core/password-strength"

type PasswordStrengthCheckerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  inputTitle: string
  resultTitle: string
  passwordLabel: string
  passwordPlaceholder: string
  show: string
  hide: string
  privacyHint: string
  empty: string
  entropyBits: string
  log10Guesses: string
  strength0: string
  strength1: string
  strength2: string
  strength3: string
  strength4: string
  length: string
  unique: string
  characterSets: string
  crackOffline: string
  crackOnline: string
  durationFormat: string
  durationUnderSecond: string
  unit: {
    seconds: string
    minutes: string
    hours: string
    days: string
    months: string
    years: string
  }
  warning: Record<StrengthWarningKey, string>
  suggestion: Record<StrengthSuggestionKey, string>
}>

type PasswordStrengthAnalysis = StrengthReport
type PasswordStrengthCheckerMessagesCatalog = Omit<
  PasswordStrengthCheckerMessages,
  "meta"
>

export type {
  PasswordStrengthAnalysis,
  PasswordStrengthCheckerMessages,
  PasswordStrengthCheckerMessagesCatalog,
}
