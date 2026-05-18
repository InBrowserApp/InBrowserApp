import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  QPDF_DECRYPT_FAILED,
  removePdfOwnerPassword,
} from "./remove-owner-password"

const {
  callMainMock,
  createQpdfModuleMock,
  mkdirMock,
  mountMock,
  readFileMock,
} = vi.hoisted(() => ({
  callMainMock: vi.fn(),
  createQpdfModuleMock: vi.fn(),
  mkdirMock: vi.fn(),
  mountMock: vi.fn(),
  readFileMock: vi.fn(),
}))

vi.mock("@jspawn/qpdf-wasm/qpdf.js", () => ({
  default: createQpdfModuleMock,
}))

vi.mock("@jspawn/qpdf-wasm/qpdf.wasm?url", () => ({
  default: "mock-qpdf.wasm",
}))

describe("removePdfOwnerPassword", () => {
  beforeEach(() => {
    callMainMock.mockReset()
    createQpdfModuleMock.mockReset()
    mkdirMock.mockReset()
    mountMock.mockReset()
    readFileMock.mockReset()

    callMainMock.mockResolvedValue(0)
    readFileMock.mockReturnValue(new Uint8Array([37, 80, 68, 70]))
    createQpdfModuleMock.mockResolvedValue({
      FS: {
        mkdir: mkdirMock,
        mount: mountMock,
        readFile: readFileMock,
      },
      WORKERFS: Symbol("WORKERFS"),
      callMain: callMainMock,
    })
  })

  test("runs qpdf decrypt and returns a PDF blob", async () => {
    const blob = new Blob(["encrypted"], { type: "application/pdf" })

    const result = await removePdfOwnerPassword(blob)

    expect(createQpdfModuleMock).toHaveBeenCalledWith({
      locateFile: expect.any(Function),
    })
    expect(createQpdfModuleMock.mock.calls[0]?.[0].locateFile()).toBe(
      "mock-qpdf.wasm"
    )
    expect(mkdirMock).toHaveBeenCalledWith("/working")
    expect(mountMock).toHaveBeenCalledWith(
      expect.anything(),
      {
        blobs: [{ data: blob, name: "input.pdf" }],
      },
      "/working"
    )
    expect(callMainMock).toHaveBeenCalledWith([
      "--decrypt",
      "/working/input.pdf",
      "/output.pdf",
    ])
    expect(readFileMock).toHaveBeenCalledWith("/output.pdf", {
      encoding: "binary",
    })
    expect(result.type).toBe("application/pdf")
    expect(new Uint8Array(await result.arrayBuffer())).toEqual(
      new Uint8Array([37, 80, 68, 70])
    )
  })

  test("throws a stable error code when qpdf fails", async () => {
    callMainMock.mockResolvedValue(2)

    await expect(removePdfOwnerPassword(new Blob(["bad"]))).rejects.toThrow(
      QPDF_DECRYPT_FAILED
    )
  })
})
