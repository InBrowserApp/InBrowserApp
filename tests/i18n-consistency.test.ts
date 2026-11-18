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

// Named interpolation tokens used by the catalogs. Compare occurrences, not
// position: natural translations can reorder placeholders. This is not an ICU
// parser; add format-aware validation if the app adopts ICU messages.
function placeholders(value: string): string[] {
  return (value.match(/\{\{[A-Za-z_]\w*\}\}|\{[A-Za-z_]\w*\}/gu) ?? []).sort()
}

function localeContract(value: unknown): unknown {
  if (value === null) return { type: "null" }
  if (Array.isArray(value)) {
    return { type: "array", items: value.map(localeContract) }
  }
  if (typeof value === "object") {
    return {
      type: "object",
      entries: Object.fromEntries(
        Object.entries(value).map(([key, child]) => [
          key,
          localeContract(child),
        ])
      ),
    }
  }
  return {
    type: typeof value,
    ...(typeof value === "string" ? { placeholders: placeholders(value) } : {}),
  }
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

function langCodeFromFilename(file: string, ext: LocaleExt): string {
  return file.slice(0, -(ext.length + 1))
}

const families = discoverLocaleFamilies()

describe("localized value contracts", () => {
  test("allows natural word order and object key order", () => {
    expect(
      localeContract({
        label: "{total} insgesamt, Seite {page}",
        action: "Kopieren",
      })
    ).toEqual(
      localeContract({
        action: "Copy",
        label: "Page {page} of {total}",
      })
    )
  })

  test.each([
    ["Base {base}", "आधार {आधार}"],
    ["{name} and {name}", "{name}"],
    ["{{count}} files", "{count} files"],
    [{ label: "Count" }, { label: 3 }],
    [{ label: null }, { label: {} }],
    [{ label: "Text" }, { other: "Text" }],
    [["One", "Two"], ["One"]],
    [{ "a.b": "Text" }, { a: { b: "Text" } }],
  ])("rejects changed value contracts: %j → %j", (source, target) => {
    expect(localeContract(target)).not.toEqual(localeContract(source))
  })
})

describe("locale family discovery", () => {
  test("at least one en.json or en.md exists in the repo", () => {
    expect(families.length).toBeGreaterThan(0)
  })

  test.each([
    "text-line-sorter",
    "unicode-punycode-converter",
    "unix-timestamp-converter",
  ])("%s ships a non-empty guide for every supported language", (slug) => {
    const introDir = path.join(repoRoot, "tools", slug, "sections", "intro")
    const missing = SUPPORTED_SORTED.filter((lang) => {
      const file = path.join(introDir, `${lang}.md`)
      return !fs.existsSync(file) || !loadText(file).trim()
    })
    expect(missing).toEqual([])
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
  const parityKind =
    ext === "json"
      ? "JSON structure, type, and placeholder"
      : "markdown heading structure"
  const others = filesInDir.filter((f) => f !== enFile)
  for (const file of others) {
    test(`${file}: ${parityKind} parity with en`, () => {
      if (ext === "json") {
        const en = loadJson(path.join(dir, enFile))
        const localized = loadJson(path.join(dir, file))
        expect(localeContract(localized)).toEqual(localeContract(en))
      } else {
        const enLevels = extractHeadingLevels(loadText(path.join(dir, enFile)))
        const levels = extractHeadingLevels(loadText(path.join(dir, file)))
        expect(levels).toEqual(enLevels)
      }
    })

    test(`${file}: content is localized beyond the English baseline`, () => {
      const enPath = path.join(dir, enFile)
      const localizedPath = path.join(dir, file)
      if (ext === "json") {
        expect(loadJson(localizedPath)).not.toEqual(loadJson(enPath))
      } else {
        expect(loadText(localizedPath).trim()).not.toBe(loadText(enPath).trim())
      }
    })
  }
})
