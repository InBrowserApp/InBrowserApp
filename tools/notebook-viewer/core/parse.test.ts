import { readFileSync } from "node:fs"
import { expect, test, vi } from "vitest"
import { parse } from "./parse"
import { output } from "./outputs"
import { imageData } from "./images"
import { decode, failure } from "./failure"
import { escape, pre, record, text } from "./text"
import { code } from "./highlight"
const notebook = (cells: unknown[], metadata?: unknown) =>
  JSON.stringify({
    nbformat: 4,
    nbformat_minor: 5,
    cells,
    ...(metadata === undefined ? {} : { metadata }),
  })
const cell = (cell_type = "markdown", source: unknown = "Text", rest = {}) => ({
  cell_type,
  source,
  ...rest,
})

test("reads the mixed original fixture in order with code, counts and saved outputs", () => {
  const result = parse(
    readFileSync("tools/notebook-viewer/fixtures/survey.ipynb", "utf8")
  )
  expect(result.cells.map((c) => c.kind)).toEqual([
    "markdown",
    "code",
    "code",
    "markdown",
    "code",
    "raw",
    "code",
  ])
  expect(result.cells[1]?.html).toContain('class="hljs-')
  expect(result.cells[1]?.count).toBe(7)
  expect(result.cells[1]?.outputs[0]?.html).toContain(
    "Mean: 14.666666666666666\n"
  )
  expect(result.cells[2]?.outputs[0]?.svg).toContain("<svg")
  expect(result.cells[3]?.attachments["marker.png"]).toBeTruthy()
  expect(result.cells[4]?.count).toBeNull()
  expect(result.cells[5]?.html).toContain("&lt;markup&gt;")
  expect(result.cells[6]?.outputs[0]?.html).not.toContain("\u001b")
})

test("accepts future minor versions, optional metadata, unknown cell types and every cell", () => {
  expect(parse(notebook([cell("future")])).cells[0]?.kind).toBe("unknownCell")
  expect(
    parse(
      notebook(
        [
          cell(
            "markdown",
            "```\nraw\n```\n\n```unknown\ntext\n```\n\n```python\nx = 1\n```",
            {}
          ),
        ],
        { language_info: {} }
      )
    ).cells[0]?.html
  ).toContain("hljs-number")
  const future = JSON.parse(
    notebook(
      Array.from({ length: 1001 }, (_, i) => cell("markdown", `# Cell ${i}`))
    )
  )
  future.nbformat_minor = 999
  expect(parse(JSON.stringify(future)).cells).toHaveLength(1001)
  expect(parse(notebook([])).cells).toEqual([])
})

test("rejects malformed structure and incompatible major versions without dropping data", () => {
  for (const value of [
    "{",
    "[]",
    "{}",
    JSON.stringify({ nbformat: 3 }),
    JSON.stringify({ nbformat: 5 }),
  ])
    expect(() => parse(value)).toThrow(/.+/)
  for (const override of [
    { nbformat_minor: -1 },
    { nbformat_minor: "5" },
    { cells: {} },
    { metadata: null },
    { metadata: { language_info: [] } },
  ]) {
    expect(() =>
      parse(JSON.stringify({ ...JSON.parse(notebook([])), ...override }))
    ).toThrow("INVALID")
  }
  for (const c of [
    null,
    {},
    cell("markdown", ["x", 1]),
    cell("markdown", "x", { attachments: [] }),
    cell("markdown", "x", { attachments: { x: null } }),
    cell("code", "x", { execution_count: 1.2, outputs: [] }),
    cell("code", "x", { execution_count: -1, outputs: [] }),
    cell("code", "x", { execution_count: null, outputs: {} }),
  ])
    expect(() => parse(notebook([c]))).toThrow("INVALID")
})

test("decodes UTF-8 and classifies version, encoding and resource errors", () => {
  expect(decode(new TextEncoder().encode("日本語"))).toBe("日本語")
  expect(() => decode(new Uint8Array([255]))).toThrow("ENCODING")
  expect(failure(new RangeError())).toBe("resourceLimit")
  expect(failure(new Error("allocation failed"))).toBe("resourceLimit")
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new Error("VERSION"))).toBe("version")
  expect(failure(new Error("bad"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
})

test("preserves allocation failures during text decoding", () => {
  const reason = new RangeError("Invalid string length")
  const decoder = vi
    .spyOn(TextDecoder.prototype, "decode")
    .mockImplementation(() => {
      throw reason
    })
  try {
    expect(() => decode(new Uint8Array([65]))).toThrow(reason)
    expect(failure(reason)).toBe("resourceLimit")
  } finally {
    decoder.mockRestore()
  }
})

test("multiline text, escaped markup, terminal commands and unknown code remain readable", () => {
  expect(text(["line 1\n", "  line 2"])).toBe("line 1\n  line 2")
  expect(text("text")).toBe("text")
  expect(text([])).toBe("")
  expect(() => text(null)).toThrow("INVALID")
  expect(() => record(1)).toThrow("INVALID")
  expect(escape('<x a="b">&')).toBe("&lt;x a=&quot;b&quot;&gt;&amp;")
  expect(pre("\u001b]0;title\u0007\u001b[31mred\u001b[0m")).toBe(
    "<pre>red</pre>"
  )
  expect(code("<plain>", "unknown")).toContain("&lt;plain&gt;")
})

test("chooses supported MIME representations and preserves unknown-type text", () => {
  const render = (data: Record<string, unknown>) =>
    output({ output_type: "display_data", data })
  expect(
    render({ "text/html": ["<p>", "Table</p>"], "text/plain": "fallback" }).html
  ).toBe("<p>Table</p>")
  expect(
    render({ "image/png": ["A A=="], "text/plain": "fallback" }).html
  ).toContain("data:image/png;base64,AA==")
  expect(render({ "image/svg+xml": "<svg/>" }).svg).toBe("<svg/>")
  expect(render({ "text/markdown": "**Bold**" }).html).toContain(
    "<strong>Bold</strong>"
  )
  expect(render({ "text/plain": ["a\n", "b"] }).html).toContain("a\nb")
  expect(render({ "application/json": { a: [1, 2] } }).html).toContain(
    "&quot;a&quot;"
  )
  expect(render({ "text/latex": "$x$" }).html).toContain("$x$")
  expect(render({ "application/javascript": "alert(1)" }).interactive).toBe(
    true
  )
  expect(
    render({
      "application/vnd.jupyter.widget-view+json": {},
      "text/plain": "Widget",
    }).interactive
  ).toBe(true)
  expect(render({ "custom/type": "ignored" }).unsupported).toBe(true)
  expect(output({ output_type: "future", text: "Retained" })).toMatchObject({
    unsupported: true,
    html: "<pre>Retained</pre>",
  })
  expect(
    output({ output_type: "stream", name: "stderr", text: "warning" }).label
  ).toBe("stderr")
  expect(
    output({
      output_type: "error",
      ename: "Error",
      evalue: "oops",
      traceback: [],
    }).html
  ).toBe("<pre>Error: oops</pre>")
  for (const traceback of [null, [1]])
    expect(() => output({ output_type: "error", traceback })).toThrow("INVALID")
  expect(imageData({ "image/jpeg": "AA==" })).toBe(
    "data:image/jpeg;base64,AA=="
  )
  expect(imageData({})).toBeNull()
})
