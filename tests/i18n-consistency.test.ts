import fs from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { SUPPORTED_SITE_LANGUAGES } from "../apps/web/src/lib/site"

const repoRoot = path.resolve(__dirname, "..")
const SUPPORTED = new Set<string>(SUPPORTED_SITE_LANGUAGES)
const SUPPORTED_SORTED = [...SUPPORTED_SITE_LANGUAGES].sort()

const SKIP_DIRS = new Set([
  ".astro",
  ".git",
  ".turbo",
  "coverage",
  "dist",
  "generated",
  "node_modules",
])

type LocaleExt = "json" | "md"

interface LocaleFamily {
  dir: string
  relDir: string
  ext: LocaleExt
}

/**
 * Walk the repo and collect every directory that contains an `en.json` or
 * `en.md`. Each such directory is one "locale family" — every other locale
 * file alongside it must be present, named with a supported language code,
 * and structurally consistent with the English baseline.
 */
function discoverLocaleFamilies(): LocaleFamily[] {
  const out: LocaleFamily[] = []
  function walk(dir: string) {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    let hasEnJson = false
    let hasEnMd = false
    for (const entry of entries) {
      if (entry.isFile() && entry.name === "en.json") hasEnJson = true
      if (entry.isFile() && entry.name === "en.md") hasEnMd = true
    }
    const relDir = path.relative(repoRoot, dir) || "."
    if (hasEnJson) out.push({ dir, relDir, ext: "json" })
    if (hasEnMd) out.push({ dir, relDir, ext: "md" })
    for (const entry of entries) {
      if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name))
      }
    }
  }
  walk(repoRoot)
  return out.sort((a, b) =>
    a.relDir === b.relDir
      ? a.ext.localeCompare(b.ext)
      : a.relDir.localeCompare(b.relDir)
  )
}

function loadJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function loadText(filePath: string): string {
  return fs.readFileSync(filePath, "utf8")
}

/**
 * Recursively collect every leaf path in a JSON value. Two locale files must
 * produce the same set of paths to be structurally equivalent.
 */
function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") {
    return [prefix || "<root>"]
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return [`${prefix}[]`]
    return value.flatMap((item, i) => collectKeyPaths(item, `${prefix}[${i}]`))
  }
  const entries = Object.entries(value as Record<string, unknown>)
  if (entries.length === 0) return [`${prefix}{}`]
  return entries.flatMap(([k, v]) =>
    collectKeyPaths(v, prefix ? `${prefix}.${k}` : k)
  )
}

/**
 * Extract markdown ATX heading levels in document order, ignoring fenced code
 * blocks. Heading text is intentionally discarded — translated headings are
 * expected to differ in text but share the same outline shape.
 */
function extractHeadingLevels(md: string): number[] {
  const out: number[] = []
  let inFence = false
  for (const line of md.split("\n")) {
    if (line.startsWith("```")) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const m = /^(#{1,6})\s+\S/.exec(line)
    if (m?.[1]) out.push(m[1].length)
  }
  return out
}

interface SetDiff<T> {
  missing: T[]
  extra: T[]
}

function diffSets<T>(base: T[], other: T[]): SetDiff<T> {
  const baseSet = new Set(base)
  const otherSet = new Set(other)
  return {
    missing: base.filter((x) => !otherSet.has(x)),
    extra: other.filter((x) => !baseSet.has(x)),
  }
}

function langCodeFromFilename(file: string, ext: LocaleExt): string {
  return file.slice(0, -(ext.length + 1))
}

const families = discoverLocaleFamilies()

describe("locale family discovery", () => {
  test("at least one en.json or en.md exists in the repo", () => {
    expect(families.length).toBeGreaterThan(0)
  })
})

describe.each(families)("locale family $relDir/*.$ext", ({ dir, ext }) => {
  const filesInDir = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(`.${ext}`))
    .sort()
  const langs = filesInDir.map((f) => langCodeFromFilename(f, ext))
  const langSet = new Set(langs)

  test("filename language codes are all in SUPPORTED_SITE_LANGUAGES", () => {
    const unknown = langs.filter((l) => !SUPPORTED.has(l))
    expect(unknown).toEqual([])
  })

  test("every supported language has a file", () => {
    const missing = SUPPORTED_SORTED.filter((l) => !langSet.has(l))
    expect(missing).toEqual([])
  })

  const enFile = `en.${ext}`
  const parityKind = ext === "json" ? "JSON key" : "markdown heading structure"
  const others = filesInDir.filter((f) => f !== enFile)
  for (const file of others) {
    test(`${file}: ${parityKind} parity with en`, () => {
      if (ext === "json") {
        const enKeys = collectKeyPaths(loadJson(path.join(dir, enFile)))
        const keys = collectKeyPaths(loadJson(path.join(dir, file)))
        expect(diffSets(enKeys, keys)).toEqual({ missing: [], extra: [] })
      } else {
        const enLevels = extractHeadingLevels(loadText(path.join(dir, enFile)))
        const levels = extractHeadingLevels(loadText(path.join(dir, file)))
        expect(levels).toEqual(enLevels)
      }
    })
  }
})
