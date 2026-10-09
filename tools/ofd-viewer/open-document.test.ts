// @vitest-environment jsdom
import { expect, test, vi } from "vitest"
import { strToU8, zipSync } from "fflate"
import { openDocument } from "./open-document"
import { diagnosticMessages } from "./diagnostics"
import m from "./messages/en.json"

const ns = 'xmlns:ofd="http://www.ofdspec.org/2016"'
function fixture(
  options: {
    pages?: number
    empty?: boolean
    multi?: boolean
    signed?: boolean
    entries?: number
    missing?: boolean
    external?: boolean
  } = {}
) {
  const body = `<ofd:DocBody><ofd:DocInfo><ofd:Title>Owned sample</ofd:Title></ofd:DocInfo><ofd:DocRoot>Doc/Document.xml</ofd:DocRoot>${options.signed ? "<ofd:Signatures>Signatures.xml</ofd:Signatures>" : ""}</ofd:DocBody>`
  const files: Record<string, Uint8Array> = {
    "OFD.xml": strToU8(
      `<ofd:OFD ${ns}>${body}${options.multi ? body : ""}</ofd:OFD>`
    ),
    "Doc/Document.xml": strToU8(
      `<ofd:Document ${ns}><ofd:CommonData><ofd:PageArea><ofd:PhysicalBox>0 0 210 297</ofd:PhysicalBox></ofd:PageArea></ofd:CommonData><ofd:Pages>${options.empty ? "" : '<ofd:Page ID="1" BaseLoc="Page.xml"/>'}</ofd:Pages></ofd:Document>`
    ),
    "Doc/Page.xml": strToU8(
      `<ofd:Page ${ns}><ofd:Area><ofd:PhysicalBox>0 0 297 210</ofd:PhysicalBox></ofd:Area><ofd:Content><ofd:Layer ID="2"><ofd:TextObject ID="3" Boundary="10 10 100 15" Font="1" Size="5"><ofd:TextCode X="0" Y="5">Invoice 发票 0123</ofd:TextCode></ofd:TextObject>${options.external ? '<ofd:ImageObject ID="4" ResourceID="http://invalid.example/image.png" Boundary="0 0 5 5"/>' : ""}</ofd:Layer></ofd:Content></ofd:Page>`
    ),
  }
  if (options.pages) {
    const pages = Array.from(
      { length: options.pages },
      (_, index) =>
        `<ofd:Page ID="${index + 1}" BaseLoc="Page${index + 1}.xml"/>`
    ).join("")
    files["Doc/Document.xml"] = strToU8(
      new TextDecoder()
        .decode(files["Doc/Document.xml"])
        .replace('<ofd:Page ID="1" BaseLoc="Page.xml"/>', pages)
    )
    for (let number = 1; number <= options.pages; number++) {
      files[`Doc/Page${number}.xml`] = strToU8(
        new TextDecoder()
          .decode(files["Doc/Page.xml"])
          .replace("Invoice 发票 0123", `Long document page ${number}`)
          .replace('ID="2"', `ID="${10000 + number}"`)
          .replace('ID="3"', `ID="${20000 + number}"`)
      )
    }
  }
  if (options.missing) delete files["Doc/Page.xml"]
  for (let i = 0; i < (options.entries ?? 0); i++)
    files[`Unused/${i}`] = new Uint8Array()
  return file(zipSync(files))
}
function file(bytes: Uint8Array) {
  const file = new File([new Uint8Array(bytes).buffer], "sample.ofd")
  Object.defineProperty(file, "arrayBuffer", {
    configurable: true,
    value: async () => new Uint8Array(bytes).buffer,
  })
  return file
}

test("opens real OFD XML, preserves text, physical page size and rotation", async () => {
  const doc = await openDocument(fixture(), new AbortController().signal)
  expect(doc.numPages).toBe(1)
  expect(doc.metadata.Title).toBe("Owned sample")
  const page = await doc.getPage(1)
  expect((await page.getTextContent()).items[0]?.text).toBe("Invoice 发票 0123")
  const view = page.getViewport({ rotation: 90 })
  expect(view.width).toBeCloseTo((210 * 96) / 25.4)
  expect(view.height).toBeCloseTo((297 * 96) / 25.4)
  doc.destroy()
  await expect(doc.getPage(1)).rejects.toThrow("destroyed")
})

test("exposes signed and multi-document packages instead of presenting them as complete", async () => {
  const doc = await openDocument(
    fixture({ signed: true, multi: true }),
    new AbortController().signal
  )
  expect(diagnosticMessages(doc.diagnostics, m)).toEqual([
    m.signatureNotice,
    m.multiDocumentNotice,
  ])
  doc.destroy()
})

test("does not retain the engine's 64 MB file-size and 10,000 ZIP-entry caps", async () => {
  const input = fixture({ entries: 10001 })
  Object.defineProperty(input, "size", { value: 64 * 1024 * 1024 + 1 })
  const doc = await openDocument(input, new AbortController().signal)
  expect(doc.numPages).toBe(1)
  doc.destroy()
})

test("rejects invalid, empty and damaged files and reports missing page resources", async () => {
  await expect(
    openDocument(file(strToU8("invalid")), new AbortController().signal)
  ).rejects.toThrow(/zip|ZIP|archive|data/i)
  await expect(
    openDocument(fixture({ empty: true }), new AbortController().signal)
  ).rejects.toThrow("no pages")
  const doc = await openDocument(
    fixture({ missing: true }),
    new AbortController().signal
  )
  await expect(doc.getPage(1)).rejects.toThrow("resource not found")
  doc.destroy()
})

test("honors cancellation before starting and during archive opening", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(
    openDocument(fixture(), controller.signal)
  ).rejects.toMatchObject({ name: "AbortError" })
  const another = new AbortController()
  const input = fixture()
  Object.defineProperty(input, "arrayBuffer", {
    configurable: true,
    value: async () => {
      another.abort()
      return new ArrayBuffer(0)
    },
  })
  await expect(openDocument(input, another.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})

test("resolves document resources only from the local archive", async () => {
  const fetch = vi.spyOn(globalThis, "fetch")
  const doc = await openDocument(
    fixture({ external: true }),
    new AbortController().signal
  )
  const page = await doc.getPage(1)
  await expect(
    page.contents[0]!.resources.image("http://invalid.example/image.png")
  ).rejects.toThrow("Missing image")
  expect(fetch).not.toHaveBeenCalled()
  doc.destroy()
  fetch.mockRestore()
})

test("groups known omissions into localized actionable notices", () => {
  expect(
    diagnosticMessages(
      [
        { code: "FONT_DECODE", message: "private" },
        { code: "FONT_SUBSTITUTION", message: "private" },
        { code: "IMAGE_DECODE", message: "private" },
        { code: "MISSING_RESOURCE", message: "private" },
        { code: "MISSING_DEFAULT_PAGE_AREA", message: "private" },
      ],
      m
    )
  ).toEqual([m.fontNotice, m.imageNotice, m.partialNotice])
})

test("opens and resolves the last page of a real 1,001-page archive", async () => {
  const doc = await openDocument(
    fixture({ pages: 1001 }),
    new AbortController().signal
  )
  expect(doc.numPages).toBe(1001)
  const last = await doc.getPage(1001)
  expect((await last.getTextContent()).items[0]?.text).toBe(
    "Long document page 1001"
  )
  doc.destroy()
})
