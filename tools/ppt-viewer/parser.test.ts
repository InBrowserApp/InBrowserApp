import { readFileSync } from "node:fs"
import { expect, test, vi } from "vitest"
import { parsePresentation, setWasmSource } from "@extend-ai/react-pptx"
import { preparePresentation } from "./model"

test("does not create a worker when its input transfer allocation fails", async () => {
  const worker = vi.fn(function () {})
  vi.stubGlobal("Worker", worker)
  setWasmSource("/parser.wasm")
  const slice = vi
    .spyOn(Uint8Array.prototype, "slice")
    .mockImplementationOnce(() => {
      throw new RangeError("Array buffer allocation failed")
    })
  try {
    await expect(
      parsePresentation(
        new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]),
        { maxInputBytes: Number.MAX_SAFE_INTEGER }
      )
    ).rejects.toMatchObject({ code: "resource-limit" })
    expect(worker).not.toHaveBeenCalled()
  } finally {
    slice.mockRestore()
    vi.unstubAllGlobals()
  }
})

test("the shipped WASM reads the genuine owned binary PPT with public bindings", async () => {
  vi.stubGlobal("Worker", undefined)
  try {
    setWasmSource(
      new Uint8Array(readFileSync("tools/ppt-viewer/vendor/parser.wasm"))
    )
    const bytes = readFileSync("tools/ppt-viewer/fixtures/field-notes.ppt")
    const parsed = await parsePresentation(new Uint8Array(bytes), {
      maxInputBytes: Number.MAX_SAFE_INTEGER,
    })
    expect(parsed.document.format).toBe("ppt")
    expect(parsed.document.slides).toHaveLength(3)
    expect(
      parsed.document.slides.every((slide) =>
        slide.nodes.every(
          (node) => node.type === "shape" || node.type === "image"
        )
      )
    ).toBe(true)
    expect(parsed.document.size).toEqual({
      widthEmu: 9144000,
      heightEmu: 6858000,
    })
    expect(preparePresentation(parsed.document).join("\n")).toContain(
      "LOCAL FIELD NOTES"
    )
    expect(preparePresentation(parsed.document).join("\n")).toContain(
      "Warm ivory"
    )
    expect(
      Object.values(parsed.document.assets).some(
        (asset) => asset.contentType === "image/png"
      )
    ).toBe(true)
    expect(
      parsed.warnings.some((warning) => warning.code === "degraded-rendering")
    ).toBe(true)
    await expect(
      parsePresentation(
        new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
      )
    ).rejects.toMatchObject({ code: "parse-failed" })
  } finally {
    vi.unstubAllGlobals()
  }
})
