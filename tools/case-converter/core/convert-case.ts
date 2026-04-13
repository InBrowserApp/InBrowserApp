/**
 * Split input string into words by detecting various separators and case boundaries.
 */
export function splitIntoWords(input: string): string[] {
  if (!input.trim()) return []

  // Replace common separators with spaces, then normalize whitespace
  let normalized = input
    .replace(/[_\-./\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()

  // Insert space before uppercase letters that follow lowercase (camelCase boundary)
  normalized = normalized.replace(/([a-z])([A-Z])/g, "$1 $2")

  // Handle consecutive uppercase followed by lowercase (e.g., XMLParser -> XML Parser)
  normalized = normalized.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")

  return normalized
    .split(" ")
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
}

export function toCamelCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ""

  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join("")
}

export function toPascalCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ""

  return words
    .map((word) => {
      const lower = word.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join("")
}

export function toSnakeCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toLowerCase())
    .join("_")
}

export function toScreamingSnakeCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toUpperCase())
    .join("_")
}

export function toKebabCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toLowerCase())
    .join("-")
}

export function toScreamingKebabCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toUpperCase())
    .join("-")
}

export function toDotCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toLowerCase())
    .join(".")
}

export function toPathCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toLowerCase())
    .join("/")
}

export function toTitleCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => {
      const lower = word.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(" ")
}

export function toSentenceCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ""

  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1)
      return lower
    })
    .join(" ")
}

export function toUpperCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toUpperCase())
    .join(" ")
}

export function toLowerCase(input: string): string {
  return splitIntoWords(input)
    .map((word) => word.toLowerCase())
    .join(" ")
}

export type CaseType =
  | "camelCase"
  | "PascalCase"
  | "snake_case"
  | "SCREAMING_SNAKE_CASE"
  | "kebab-case"
  | "SCREAMING-KEBAB-CASE"
  | "dot.case"
  | "path/case"
  | "Title Case"
  | "Sentence case"
  | "UPPERCASE"
  | "lowercase"

const caseConverters: Record<CaseType, (input: string) => string> = {
  camelCase: toCamelCase,
  PascalCase: toPascalCase,
  snake_case: toSnakeCase,
  SCREAMING_SNAKE_CASE: toScreamingSnakeCase,
  "kebab-case": toKebabCase,
  "SCREAMING-KEBAB-CASE": toScreamingKebabCase,
  "dot.case": toDotCase,
  "path/case": toPathCase,
  "Title Case": toTitleCase,
  "Sentence case": toSentenceCase,
  UPPERCASE: toUpperCase,
  lowercase: toLowerCase,
}

export const CASE_TYPES = Object.keys(caseConverters) as CaseType[]

export function convertCase(input: string, caseType: CaseType): string {
  return caseConverters[caseType](input)
}
