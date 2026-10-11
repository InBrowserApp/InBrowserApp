import { expect, test } from "vitest"
import { codeScript } from "./script"
import type { Notebook } from "@workspace/notebook"

function notebook(sources: string[], language?: string): Notebook {
  return {
    language,
    cells: sources.map((source) => ({
      source,
      kind: "code",
      html: "",
      attachments: {},
      count: null,
      outputs: [],
    })),
  }
}

test("exports only original code cells in order without executing notebook syntax", () => {
  const input = notebook(["x = '世界'", "%time x\n!echo hello\n"], " Python ")
  input.cells.splice(1, 0, {
    ...input.cells[0]!,
    kind: "markdown",
    source: "# Omitted",
  })
  expect(codeScript(input)).toEqual({
    text: "x = '世界'\n\n%time x\n!echo hello\n",
    extension: "py",
    count: 2,
    unknownLanguage: false,
  })
  expect(codeScript(notebook(["const x = 1"], "JavaScript")).text).toBe(
    "const x = 1\n"
  )
  expect(codeScript(notebook([""], "r")).extension).toBe("R")
})

test("uses TXT for missing or unrecognized languages and keeps empty scripts downloadable", () => {
  for (const language of [
    undefined,
    "",
    "unknown",
    "__proto__",
    "constructor",
  ]) {
    expect(codeScript(notebook([], language))).toEqual({
      text: "",
      extension: "txt",
      count: 0,
      unknownLanguage: true,
    })
  }
  expect(codeScript(notebook([""], "python")).text).toBe("")
  const input = notebook(["x"], "python")
  delete input.cells[0]!.source
  expect(() => codeScript(input)).toThrow("INVALID")
})
