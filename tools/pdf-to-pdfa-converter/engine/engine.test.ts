import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { gunzipSync } from "node:zlib"
import {
  decodePDFRawStream,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFRawStream,
} from "pdf-lib"
import { beforeAll, describe, expect, it } from "vitest"

type Module = {
  FS: {
    writeFile(path: string, bytes: Uint8Array): void
    readFile(path: string): Uint8Array
  }
  ccall(
    name: string,
    result: string,
    argTypes: string[],
    args: number[]
  ): string
}

const root = resolve("tools/pdf-to-pdfa-converter")
let engine: Module

beforeAll(async () => {
  const loader = pathToFileURL(resolve(root, "engine/generated/fynepdf.mjs"))
  const { default: load } = await import(/* @vite-ignore */ loader.href)
  const wasmBinary = gunzipSync(
    readFileSync(resolve(root, "engine/generated/fynepdf.bin"))
  )
  engine = await load({ wasmBinary })
})

function convert(filename: string, part: number) {
  engine.FS.writeFile(
    "/input.pdf",
    readFileSync(resolve(root, "fixtures", filename))
  )
  return JSON.parse(engine.ccall("convert_pdfa", "string", ["number"], [part]))
}

describe("built PDF/A engine", () => {
  it.each([1, 2])(
    "embeds missing fonts and keeps text and vector operators in PDF/A-%ib",
    async (part) => {
      expect(convert("searchable.pdf", part)).toMatchObject({
        ok: true,
        conforms: true,
        changes: { "fonts-embedded": 1 },
      })
      const doc = await PDFDocument.load(engine.FS.readFile("/output.pdf"))
      const page = doc.getPage(0)
      const stream = page.node.Contents()
      expect(stream).toBeInstanceOf(PDFRawStream)
      const content = new TextDecoder().decode(
        decodePDFRawStream(stream as PDFRawStream).decode()
      )
      expect(content).toMatch(/\bTj\b/)
      expect(content).toMatch(/\bre\b/)
      const fonts = page.node.Resources()!.lookup(PDFName.of("Font"), PDFDict)
      const font = fonts.lookup(fonts.keys()[0]!, PDFDict)
      const descriptor = font.lookup(PDFName.of("FontDescriptor"), PDFDict)
      expect(descriptor.lookup(PDFName.of("FontFile2"))).toBeInstanceOf(
        PDFRawStream
      )
    }
  )

  it("keeps transparency in 2b and returns a problem for 1b", () => {
    expect(convert("transparent.pdf", 2)).toMatchObject({
      ok: true,
      conforms: true,
    })
    expect(convert("transparent.pdf", 1)).toMatchObject({
      ok: true,
      conforms: false,
      problems: ["transparency"],
    })
  })
})
