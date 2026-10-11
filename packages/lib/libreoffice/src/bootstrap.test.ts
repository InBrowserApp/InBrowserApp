import { readFileSync } from "node:fs"
import { runInNewContext } from "node:vm"
import { expect, test, vi } from "vitest"

const source = readFileSync("packages/lib/libreoffice/src/bootstrap.js", "utf8")
async function run(
  format?: string,
  rectangles = "0, 0, 4000, 6000; 0, 0, 0, 0; 0, 7000, 8000, 4000"
) {
  const heap = new Uint8Array(new SharedArrayBuffer(8192))
  const encoder = new TextEncoder()
  heap.set(encoder.encode(rectangles + "\0"), 4096)
  let offset = 16
  const self = {
    Worker: class {},
    postMessage: vi.fn(),
    onmessage: undefined as unknown as (event: {
      data: unknown
    }) => Promise<void>,
    Module: {} as Record<string, any>,
  }
  const strings = (pointer: number) => {
    const end = heap.indexOf(0, pointer)
    return new TextDecoder().decode(new Uint8Array(heap.subarray(pointer, end)))
  }
  const save = vi.fn(
    (_document: number, path: number, type: number, options: number) => {
      expect(strings(path)).toBe("file:///tmp/output.pdf")
      expect(strings(type)).toBe("pdf")
      return JSON.parse(strings(options))
    }
  )
  const parts = vi.fn(() => 3)
  const free = vi.fn()
  runInNewContext(source, {
    self,
    Uint8Array,
    TextEncoder,
    TextDecoder,
    Blob,
    URL: { createObjectURL: () => "blob:thread", revokeObjectURL: vi.fn() },
    setTimeout: (callback: () => void) => callback(),
    importScripts: () => {
      Object.assign(self.Module, {
        HEAPU8: heap,
        _malloc: (size: number) => {
          const pointer = offset
          offset += size
          return pointer
        },
        _free: free,
        ENV: {},
        FS: {
          writeFile: vi.fn(),
          readFile: () => new Uint8Array([37, 80, 68, 70]),
        },
        _libreofficekit_hook: () => 1,
        _lok_documentLoadWithOptions: (
          _office: number,
          path: number,
          options: number
        ) => {
          expect(strings(path)).toBe(
            format === "writer"
              ? "file:///tmp/input.odt"
              : "file:///tmp/input.ppt"
          )
          expect(strings(options)).toContain("EnableMacrosExecution=false")
          return 2
        },
        _lok_documentGetDocumentType: () => (format === "writer" ? 0 : 2),
        _lok_documentSaveAs: (...args: Parameters<typeof save>) => {
          save(...args)
          return 1
        },
        _lok_documentGetPartPageRectangles: () => 4096,
        _lok_documentGetParts: parts,
      })
      self.Module.onRuntimeInitialized()
    },
  })
  await self.onmessage({
    data: {
      format,
      input: new ArrayBuffer(1),
      guard: "",
      assets: {
        engine: "/engine.js",
        fonts: [new ArrayBuffer(1), new ArrayBuffer(1), new ArrayBuffer(1)],
      },
    },
  })
  return {
    post: self.postMessage,
    parts,
    free,
    options: save.mock.results[0]?.value,
  }
}

test("keeps Writer automatic blank pages and uses twips rather than slide parts", async () => {
  const result = await run("writer")
  expect(result.post).toHaveBeenLastCalledWith(
    expect.objectContaining({
      type: "result",
      pages: 3,
      dimensions: [
        { width: 200, height: 300 },
        null,
        { width: 400, height: 200 },
      ],
    }),
    [expect.any(ArrayBuffer)]
  )
  expect(result.parts).not.toHaveBeenCalled()
  expect(result.free).toHaveBeenCalledWith(4096)
  expect(result.options.IsSkipEmptyPages).toEqual({
    type: "boolean",
    value: "false",
  })
  expect(result.options.ExportFormFields).toEqual({
    type: "boolean",
    value: "false",
  })
})
test.each(["0, 0, 0, 10", "0, 0, -1, 5", "0, 0, NaN, 10", "0, 0, 10"])(
  "rejects invalid native page extent %s",
  async (rectangles) => {
    const result = await run("writer", rectangles)
    expect(result.post).toHaveBeenLastCalledWith({
      type: "error",
      code: "invalid",
    })
    expect(result.free).toHaveBeenCalledWith(4096)
  }
)
test("retains legacy presentation export behavior", async () => {
  const result = await run()
  expect(result.post).toHaveBeenLastCalledWith(
    expect.objectContaining({ type: "result", pages: 3 }),
    [expect.any(ArrayBuffer)]
  )
  expect(result.post.mock.calls.at(-1)![0]).not.toHaveProperty("dimensions")
  expect(result.parts).toHaveBeenCalledOnce()
  expect(result.options.ExportHiddenSlides).toEqual({
    type: "boolean",
    value: "true",
  })
  expect(result.options).not.toHaveProperty("IsSkipEmptyPages")
})
