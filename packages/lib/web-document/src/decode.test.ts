import { expect, test } from "vitest"
import { decodeWebDocument } from "./decode"

test.each([
  '<meta charset="windows-1252">',
  "<meta charset=' windows-1252'>",
  "<meta charset=   windows-1252 >",
  '<meta http-equiv="Content-Type" content="text/html; charset=windows-1252">',
  '<?xml version="1.0" encoding="windows-1252"?>',
  "<?xml".repeat(100) + '<?xml encoding="windows-1252"?>',
  "<meta\t".repeat(100) + '<meta charset="windows-1252">',
  "<meta charset=" + "\t".repeat(100) + "windows-1252>",
])(
  "recognizes declarations without matching across incomplete tags: %s",
  (head) => {
    const bytes = new Uint8Array([
      ...new TextEncoder().encode(head + "<p>caf"),
      233,
      ...new TextEncoder().encode("</p>"),
    ])
    expect(decodeWebDocument(bytes)).toBe(head + "<p>café</p>")
  }
)

test("limits encoding discovery to the document prefix", () => {
  const source =
    " ".repeat(4096) + '<meta charset="not-an-encoding"><p>中文</p>'
  expect(decodeWebDocument(new TextEncoder().encode(source))).toBe(source)
})
