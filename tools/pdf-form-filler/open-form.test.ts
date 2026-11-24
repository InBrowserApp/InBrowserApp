import { expect, test, vi } from "vitest"
import type { PDFDocumentProxy } from "pdfjs-dist"
import { openForm } from "./open-form"

const mock = vi.hoisted(() => ({
  document: undefined as unknown as PDFDocumentProxy,
  reader: { page: vi.fn() },
  openReader: vi.fn(),
  PasswordException: class extends Error {},
}))

vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.openReader }))
vi.mock("pdfjs-dist", () => ({ PasswordException: mock.PasswordException }))

function open(info: object, fields: [string, object[]][] = []) {
  mock.document = {
    getMetadata: vi.fn().mockResolvedValue({ info }),
    getFieldObjects: vi.fn().mockResolvedValue(new Map(fields)),
  } as unknown as PDFDocumentProxy
  mock.openReader.mockImplementation(async ({ prepareForm }) => {
    await prepareForm(mock.document)
    return mock.reader
  })
  return run()
}

function run() {
  return openForm(
    new File(["%PDF"], "form.pdf"),
    document.createElement("div"),
    new AbortController().signal,
    vi.fn(),
    vi.fn()
  )
}

test("returns the viewer and matching document for visible AcroForm fields", async () => {
  await expect(
    open({}, [["name", [{ type: "text", editable: true, page: 0 }]]])
  ).resolves.toEqual({ reader: mock.reader, pdf: mock.document })
})

test.each([
  { info: { IsXFAPresent: true }, problem: "xfa" },
  { info: { EncryptFilterName: "Standard" }, problem: "protected" },
  { info: {}, problem: "noFields" },
])("reports $problem before mounting the viewer", async ({ info, problem }) => {
  await expect(open(info)).rejects.toMatchObject({ problem })
})

test("rejects hidden, detached, read-only and unsupported fields", async () => {
  await expect(
    open({}, [
      ["hidden", [{ type: "text", editable: true, hidden: true, page: 0 }]],
      ["orphan", [{ type: "text", editable: true, page: -1 }]],
      ["readonly", [{ type: "text", editable: false, page: 0 }]],
      ["signature", [{ type: "signature", editable: true, page: 0 }]],
    ])
  ).rejects.toMatchObject({ problem: "noFields" })
})

test("maps PDF.js password exceptions to the protected-file message", async () => {
  mock.openReader.mockRejectedValueOnce(new mock.PasswordException())
  await expect(run()).rejects.toMatchObject({ problem: "protected" })
})
