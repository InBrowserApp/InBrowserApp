import { slugify } from "transliteration"

type SlugSeparator = "-" | "_" | "."
type SlugCase = "lower" | "preserve"

const SLUG_SEPARATORS = ["-", "_", "."] as const
const SLUG_CASES = ["lower", "preserve"] as const

const DEFAULT_SEPARATOR: SlugSeparator = "-"
const DEFAULT_CASE: SlugCase = "lower"

function generateSlug(
  input: string,
  separator: SlugSeparator = DEFAULT_SEPARATOR,
  slugCase: SlugCase = DEFAULT_CASE
): string {
  const trimmed = input.trim()

  if (trimmed === "") {
    return ""
  }

  return slugify(trimmed, {
    separator,
    lowercase: slugCase === "lower",
    trim: true,
  })
}

function isSlugSeparator(value: string): value is SlugSeparator {
  return (SLUG_SEPARATORS as readonly string[]).includes(value)
}

function isSlugCase(value: string): value is SlugCase {
  return (SLUG_CASES as readonly string[]).includes(value)
}

export {
  DEFAULT_CASE,
  DEFAULT_SEPARATOR,
  SLUG_CASES,
  SLUG_SEPARATORS,
  generateSlug,
  isSlugCase,
  isSlugSeparator,
}
export type { SlugCase, SlugSeparator }
