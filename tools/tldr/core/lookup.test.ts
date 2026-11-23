import { expect, it } from "vitest"
import {
  catalogOptions,
  lookupHref,
  normalizeQuery,
  platformName,
  publicLanguage,
  readLookup,
  search,
  selectVariant,
  type Command,
} from "./lookup"

const commands: Command[] = [
  ["gh-git-credential", { common: ["en"] }],
  ["git-add", { common: ["en", "zh", "pt_BR"] }],
  ["git", { common: ["en", "zh"], linux: ["en", "zh_TW"] }],
  ["ls", { osx: ["en", "ja"] }],
]

it("normalizes command words and ranks exact, prefix, and substring matches", () => {
  expect(normalizeQuery("  Git   ADD  ")).toBe("git-add")
  expect(search(commands, "")).toEqual([])
  expect(search(commands, "git").map(([name]) => name)).toEqual([
    "git",
    "git-add",
    "gh-git-credential",
  ])
})

it("selects an appropriate platform before trying the same language on Common", () => {
  expect(selectVariant(commands[2]!, "linux", "zh-CN")).toEqual({
    q: "git",
    os: "linux",
    locale: "en",
  })
  expect(selectVariant(commands[2]!, "linux", "zh-TW")?.locale).toBe("zh_TW")
  expect(selectVariant(commands[2]!, "windows", "zh-CN")).toEqual({
    q: "git",
    os: "common",
    locale: "zh",
  })
  expect(selectVariant(commands[2]!, "", "zh-CN")?.os).toBe("common")
  expect(selectVariant(commands[1]!, "", "pt")?.locale).toBe("pt_BR")
})

it("handles a sole platform, a missing platform, and a translation-only page", () => {
  expect(selectVariant(commands[3]!, "macos", "ja")?.os).toBe("osx")
  expect(selectVariant(commands[3]!, "", "ja")?.os).toBe("osx")
  expect(selectVariant(commands[3]!, "windows", "ja")).toBeUndefined()
  const multiple: Command = ["tool", { windows: ["en"], osx: ["en"] }]
  expect(selectVariant(multiple, "", "en")).toBeUndefined()
  expect(selectVariant(["tool", { common: ["fr"] }], "", "ja")?.locale).toBe(
    "fr"
  )
  expect(selectVariant(["tool", { common: [] }], "", "ja")).toBeUndefined()
})

it("normalizes catalog options and encodes shareable URLs", () => {
  expect(catalogOptions(commands)).toEqual({
    os: ["common", "linux", "macos"],
    languages: ["en", "ja", "pt-BR", "zh-CN", "zh-TW"],
  })
  expect(publicLanguage("zh")).toBe("zh-CN")
  expect(platformName("common", "通用")).toBe("通用")
  expect(platformName("osx", "Common")).toBe("macOS")
  expect(platformName("unknown", "Common")).toBe("unknown")

  const path = "/zh-CN/tools/tldr/"
  const lookup = { q: "c++ / #", os: "macos", lang: "zh-TW" }
  const url = new URL(lookupHref(path, lookup), "https://inbrowser.app")
  expect(url.pathname).toBe(path)
  expect(readLookup(url.searchParams)).toEqual(lookup)
  expect(
    readLookup(new URLSearchParams("q=git-commit&os=OSX&lang=zh_TW"))
  ).toEqual({
    q: "git-commit",
    os: "macos",
    lang: "zh-TW",
  })
  expect(readLookup(new URLSearchParams())).toEqual({ q: "", os: "", lang: "" })
  expect(lookupHref(path, { q: " git-commit ", os: "", lang: "" })).toBe(
    `${path}?q=git-commit`
  )
  expect(lookupHref(path, { q: "", os: "", lang: "" })).toBe(path)
})
