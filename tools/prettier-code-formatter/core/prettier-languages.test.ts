import { describe, expect, it } from "vitest"

import {
  DEFAULT_PRETTIER_FORMAT_OPTIONS,
  clampPrettierPrintWidth,
  clampPrettierTabWidth,
  createPrettierFormatRequest,
  detectPrettierLanguageFromFilename,
  getPrettierDownloadFilename,
  getPrettierLanguageConfig,
  isPrettierLanguageKey,
  isPrettierTrailingComma,
  sanitizePrettierFormatOptions,
  type PrettierFormatOptions,
} from "./prettier-languages"
import { PRETTIER_LANGUAGE_CONFIGS } from "./prettier-language-configs"

const dirtyOptions = {
  language: "unknown",
  printWidth: 500,
  tabWidth: 0,
  useTabs: "yes",
  semi: undefined,
  singleQuote: undefined,
  trailingComma: "weird",
} as unknown as Partial<PrettierFormatOptions>

describe("prettier-languages", () => {
  it("sanitizes unknown values with defaults and clamps numeric options", () => {
    expect(sanitizePrettierFormatOptions(dirtyOptions)).toEqual({
      ...DEFAULT_PRETTIER_FORMAT_OPTIONS,
      printWidth: 200,
      tabWidth: 1,
    })
  })

  it("creates requests that only include supported toggles", () => {
    expect(
      createPrettierFormatRequest("{}", {
        language: "json",
        semi: false,
        singleQuote: true,
        trailingComma: "all",
      })
    ).toEqual({
      code: "{}",
      language: "json",
      parser: "json",
      pluginKeys: ["babel", "estree"],
      highlightLanguage: "json",
      outputExtension: ".json",
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: undefined,
      singleQuote: undefined,
      trailingComma: undefined,
    })
  })

  it("detects languages from supported file names and extensions", () => {
    expect(detectPrettierLanguageFromFilename("demo.jsx")).toBe("jsx")
    expect(detectPrettierLanguageFromFilename("demo.tsx")).toBe("tsx")
    expect(detectPrettierLanguageFromFilename("schema.js.flow")).toBe("flow")
    expect(
      detectPrettierLanguageFromFilename("component/button.component.html")
    ).toBe("angular")
    expect(detectPrettierLanguageFromFilename("package.json")).toBe(
      "json-stringify"
    )
    expect(detectPrettierLanguageFromFilename("map.importmap")).toBe(
      "json-stringify"
    )
    expect(detectPrettierLanguageFromFilename("README.MD")).toBe("markdown")
    expect(detectPrettierLanguageFromFilename("newsletter.mjml")).toBe("mjml")
    expect(detectPrettierLanguageFromFilename("theme.postcss")).toBe("postcss")
    expect(detectPrettierLanguageFromFilename("snippet.unknown")).toBeNull()
    expect(detectPrettierLanguageFromFilename("no-extension")).toBeNull()
  })

  it("returns config labels and download filenames", () => {
    expect(getPrettierLanguageConfig("graphql").label).toBe("GraphQL")
    expect(getPrettierLanguageConfig("mjml").label).toBe("MJML")
    expect(getPrettierDownloadFilename("yaml")).toBe("formatted.yaml")
    expect(getPrettierDownloadFilename("postcss")).toBe("formatted.postcss")
    expect(getPrettierDownloadFilename("json-stringify")).toBe("formatted.json")
  })

  it("falls back to generic extensions when a config exposes none", () => {
    const originalYamlConfig = PRETTIER_LANGUAGE_CONFIGS.yaml

    PRETTIER_LANGUAGE_CONFIGS.yaml = {
      ...originalYamlConfig,
      extensions: [],
      outputExtension: undefined,
    }

    try {
      expect(
        createPrettierFormatRequest("name: example\n", {
          language: "yaml",
        }).outputExtension
      ).toBe(".txt")
      expect(getPrettierDownloadFilename("yaml")).toBe("formatted.formatted")
    } finally {
      PRETTIER_LANGUAGE_CONFIGS.yaml = originalYamlConfig
    }
  })

  it("guards language and trailing comma values", () => {
    expect(isPrettierLanguageKey("typescript")).toBe(true)
    expect(isPrettierLanguageKey("mjml")).toBe(true)
    expect(isPrettierLanguageKey("lua")).toBe(false)
    expect(isPrettierTrailingComma("es5")).toBe(true)
    expect(isPrettierTrailingComma("never")).toBe(false)
  })

  it("clamps print width and tab width", () => {
    expect(clampPrettierPrintWidth(10)).toBe(40)
    expect(clampPrettierPrintWidth(100)).toBe(100)
    expect(clampPrettierPrintWidth("oops")).toBe(80)
    expect(clampPrettierTabWidth(0)).toBe(1)
    expect(clampPrettierTabWidth(4)).toBe(4)
    expect(clampPrettierTabWidth("oops")).toBe(2)
  })
})
