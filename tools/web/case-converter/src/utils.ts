/**
 * Split input string into words by detecting various separators and case boundaries
 */
export function splitIntoWords(input: string): string[] {
  if (!input.trim()) return []

  // First, replace common separators with spaces
  let normalized = input
    .replace(/[_\-./\\]/g, ' ') // Replace _, -, ., /, \ with space
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim()

  // Handle camelCase and PascalCase boundaries
  // Insert space before uppercase letters that follow lowercase letters
  normalized = normalized.replace(/([a-z])([A-Z])/g, '$1 $2')

  // Handle consecutive uppercase followed by lowercase (e.g., XMLParser -> XML Parser)
  normalized = normalized.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')

  // Split by spaces and filter empty strings
  return normalized
    .split(' ')
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
}

/**
 * Convert to camelCase: firstWordLowercase
 */
export function toCamelCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ''

  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

/**
 * Convert to PascalCase: FirstWordUppercase
 */
export function toPascalCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ''

  return words
    .map((word) => {
      const lower = word.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join('')
}

/**
 * Convert to snake_case: words_separated_by_underscores
 */
export function toSnakeCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toLowerCase()).join('_')
}

/**
 * Convert to SCREAMING_SNAKE_CASE: CONSTANT_CASE
 */
export function toScreamingSnakeCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toUpperCase()).join('_')
}

/**
 * Convert to kebab-case: words-separated-by-hyphens
 */
export function toKebabCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toLowerCase()).join('-')
}

/**
 * Convert to SCREAMING-KEBAB-CASE: COBOL-CASE
 */
export function toScreamingKebabCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toUpperCase()).join('-')
}

/**
 * Convert to dot.case: words.separated.by.dots
 */
export function toDotCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toLowerCase()).join('.')
}

/**
 * Convert to path/case: words/separated/by/slashes
 */
export function toPathCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toLowerCase()).join('/')
}

/**
 * Convert to Title Case: Each Word Capitalized
 */
export function toTitleCase(input: string): string {
  const words = splitIntoWords(input)
  return words
    .map((word) => {
      const lower = word.toLowerCase()
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

/**
 * Convert to Sentence case: First word capitalized
 */
export function toSentenceCase(input: string): string {
  const words = splitIntoWords(input)
  if (words.length === 0) return ''

  return words
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index === 0) return lower.charAt(0).toUpperCase() + lower.slice(1)
      return lower
    })
    .join(' ')
}

/**
 * Convert to UPPERCASE: ALL CAPS
 */
export function toUpperCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toUpperCase()).join(' ')
}

/**
 * Convert to lowercase: all lowercase
 */
export function toLowerCase(input: string): string {
  const words = splitIntoWords(input)
  return words.map((word) => word.toLowerCase()).join(' ')
}

export type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'SCREAMING_SNAKE_CASE'
  | 'kebab-case'
  | 'SCREAMING-KEBAB-CASE'
  | 'dot.case'
  | 'path/case'
  | 'Title Case'
  | 'Sentence case'
  | 'UPPERCASE'
  | 'lowercase'

export const caseConverters: Record<CaseType, (input: string) => string> = {
  camelCase: toCamelCase,
  PascalCase: toPascalCase,
  snake_case: toSnakeCase,
  SCREAMING_SNAKE_CASE: toScreamingSnakeCase,
  'kebab-case': toKebabCase,
  'SCREAMING-KEBAB-CASE': toScreamingKebabCase,
  'dot.case': toDotCase,
  'path/case': toPathCase,
  'Title Case': toTitleCase,
  'Sentence case': toSentenceCase,
  UPPERCASE: toUpperCase,
  lowercase: toLowerCase,
}

export function convertCase(input: string, caseType: CaseType): string {
  return caseConverters[caseType](input)
}
