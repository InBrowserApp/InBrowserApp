import { PDFDocument } from "pdf-lib"
import { afterEach, expect, test, vi } from "vitest"
import "./remove-metadata.worker"

const { callMain, configureQpdf, mkdir, mount, readFile } = vi.hoisted(() => ({
  callMain: vi.fn(),
  configureQpdf:
    vi.fn<
      (options: {
        locateFile: () => string
        printErr: (message: string) => void
      }) => void
    >(),
  mkdir: vi.fn(),
  mount: vi.fn(),
  readFile: vi.fn(),
}))

vi.mock("@jspawn/qpdf-wasm/qpdf.js", () => ({
  default: (options: Parameters<typeof configureQpdf>[0]) => {
    configureQpdf(options)
    return { FS: { mkdir, mount, readFile }, WORKERFS: "WorkerFS", callMain }
  },
}))

const processFile = self.onmessage!

afterEach(() => vi.restoreAllMocks())

async function send(file: File) {
  await processFile.call(self, new MessageEvent("message", { data: file }))
}

test("rewrites the active PDF revision before stripping its metadata", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  const pdf = await PDFDocument.create()
  pdf.addPage()
  readFile.mockReturnValue(await pdf.save())
  callMain.mockReturnValueOnce(2).mockReturnValueOnce(0)
  const file = new File(["original"], "input.pdf")
  await send(file)
  expect(configureQpdf.mock.lastCall![0].locateFile()).toContain("qpdf.wasm")
  expect(mount).toHaveBeenCalledWith(
    "WorkerFS",
    { blobs: [{ data: file, name: "input.pdf" }] },
    "/working"
  )
  expect(callMain).toHaveBeenNthCalledWith(1, [
    "--is-encrypted",
    "/working/input.pdf",
  ])
  expect(callMain).toHaveBeenNthCalledWith(2, [
    "--suppress-recovery",
    "--warning-exit-0",
    "/working/input.pdf",
    "/output.pdf",
  ])
  expect(post).toHaveBeenLastCalledWith({
    status: "success",
    pdf: expect.any(Blob),
  })

  callMain.mockReturnValueOnce(0)
  await send(file)
  expect(post).toHaveBeenLastCalledWith({ status: "encryptedPdf" })

  callMain.mockImplementationOnce(() => {
    configureQpdf.mock.lastCall![0].printErr(
      "this.program: /working/input.pdf: invalid password"
    )
    return 2
  })
  await send(file)
  expect(post).toHaveBeenLastCalledWith({ status: "encryptedPdf" })

  callMain.mockReturnValueOnce(2).mockReturnValueOnce(2)
  await send(file)
  expect(post).toHaveBeenLastCalledWith({ status: "invalidPdf" })

  callMain.mockReturnValueOnce(2).mockReturnValueOnce(0)
  readFile.mockReturnValue(new Uint8Array())
  await send(file)
  expect(post).toHaveBeenLastCalledWith({ status: "invalidPdf" })
})
