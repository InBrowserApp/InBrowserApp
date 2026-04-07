import fs from "node:fs"
import path from "node:path"
import { describe, expect, test } from "vitest"

const repoRoot = path.resolve(__dirname, "..")

function loadJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

/**
 * Recursively collect every leaf path in a JSON value. Object keys are joined
 * with `.`, array indices with `[i]`. Two locale files must produce the same
 * set of paths to be considered structurally equivalent.
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

interface KeyDiff {
  missing: string[]
  extra: string[]
}

function diffKeys(base: string[], other: string[]): KeyDiff {
  const baseSet = new Set(base)
  const otherSet = new Set(other)
  return {
    missing: base.filter((k) => !otherSet.has(k)),
    extra: other.filter((k) => !baseSet.has(k)),
  }
}

function listLocaleFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .sort()
}

describe("site copy locale parity", () => {
  const dir = path.join(repoRoot, "apps/web/src/messages")
  const enPath = path.join(dir, "en.json")
  const enKeys = collectKeyPaths(loadJson(enPath))
  const others = listLocaleFiles(dir).filter((f) => f !== "en.json")

  for (const file of others) {
    test(file, () => {
      const keys = collectKeyPaths(loadJson(path.join(dir, file)))
      expect(diffKeys(enKeys, keys)).toEqual({ missing: [], extra: [] })
    })
  }
})

describe("tool locale parity", () => {
  const toolsDir = path.join(repoRoot, "tools")
  const tools = fs
    .readdirSync(toolsDir)
    .filter((entry) => fs.statSync(path.join(toolsDir, entry)).isDirectory())
    .sort()

  for (const tool of tools) {
    for (const sub of ["meta", "messages"] as const) {
      const dir = path.join(toolsDir, tool, sub)
      const enPath = path.join(dir, "en.json")
      if (!fs.existsSync(enPath)) continue
      const enKeys = collectKeyPaths(loadJson(enPath))
      const others = listLocaleFiles(dir).filter((f) => f !== "en.json")

      for (const file of others) {
        test(`${tool}/${sub}/${file}`, () => {
          const keys = collectKeyPaths(loadJson(path.join(dir, file)))
          expect(diffKeys(enKeys, keys)).toEqual({ missing: [], extra: [] })
        })
      }
    }
  }
})
