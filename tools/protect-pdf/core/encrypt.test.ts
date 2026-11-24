import { afterEach, expect, test, vi } from "vitest"

import { encryptPdf } from "./encrypt"

const createModule = vi.hoisted(() => vi.fn())
vi.mock("@jspawn/qpdf-wasm/qpdf.js", () => ({ default: createModule }))
vi.mock("@jspawn/qpdf-wasm/qpdf.wasm?url", () => ({
  default: "fake-qpdf.wasm",
}))

afterEach(() => vi.restoreAllMocks())

function mockQpdf(exitCode: number) {
  const qpdf = {
    WORKERFS: Symbol("WORKERFS"),
    FS: {
      mkdir: vi.fn(),
      mount: vi.fn(),
      readFile: vi.fn(() => new Uint8Array([37, 80, 68, 70])),
    },
    callMain: vi.fn(async (_args: string[]) => exitCode),
  }
  createModule.mockReset().mockResolvedValue(qpdf)
  return qpdf
}

test("passes option-like Unicode passwords as UTF-8 hex to AES-256 encryption", async () => {
  const qpdf = mockQpdf(0)
  const source = new Blob(["source PDF"])
  const encrypted = await encryptPdf(source, "@密碼")

  expect(qpdf.FS.mount).toHaveBeenCalledWith(
    qpdf.WORKERFS,
    { blobs: [{ data: source, name: "input.pdf" }] },
    "/working"
  )
  expect(createModule.mock.calls[0]?.[0].locateFile()).toBe("fake-qpdf.wasm")
  expect(qpdf.callMain).toHaveBeenCalledWith([
    "--password-mode=hex-bytes",
    "--encrypt",
    "40e5af86e7a2bc",
    expect.stringMatching(/^[0-9a-f]{128}$/),
    "256",
    "--",
    "/working/input.pdf",
    "/protected.pdf",
  ])
  expect(encrypted.type).toBe("application/pdf")
  expect(await encrypted.text()).toBe("%PDF")
})

test("keeps the owner password printable when randomness starts with zero", async () => {
  const qpdf = mockQpdf(0)
  const randomBytes = new Uint8Array(32).fill(0xff)
  randomBytes[0] = 0
  vi.spyOn(crypto, "getRandomValues").mockReturnValue(randomBytes)

  await encryptPdf(new Blob(), "opening password")

  // qpdf decodes this CLI argument as the ASCII password 00ffff…
  expect(qpdf.callMain.mock.calls[0]?.[0][3]).toBe(`3030${"6666".repeat(31)}`)
})

test.each(["", "\0abc", "密".repeat(43)])(
  "rejects unusable passwords before invoking qpdf",
  async (password) => {
    mockQpdf(0)
    await expect(encryptPdf(new Blob(), password)).rejects.toThrow(
      "Invalid PDF opening password"
    )
    expect(createModule).not.toHaveBeenCalled()
  }
)

test("does not publish an output after a qpdf error", async () => {
  const qpdf = mockQpdf(2)
  await expect(encryptPdf(new Blob(), "passphrase")).rejects.toThrow(
    "PDF encryption failed"
  )
  expect(qpdf.FS.readFile).not.toHaveBeenCalled()
})
