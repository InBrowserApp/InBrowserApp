// @vitest-environment node
import { gzipSync } from "node:zlib"
import { readFileSync } from "node:fs"
import { afterEach, expect, test, vi } from "vitest"
import { failure, read } from "./read"

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg"><text>Crème 日本語</text></svg>'
afterEach(() => vi.unstubAllGlobals())

test("SVGZ and gzip bytes with SVG suffix produce identical illustrations", async () => {
  const plain = await read(new File([svg], "drawing.svg"))
  for (const name of ["drawing.svgz", "compressed.svg"])
    expect(await read(new File([gzipSync(svg)], name))).toEqual(plain)
  const original = readFileSync(
    new URL("../fixtures/coastal-notes.svg", import.meta.url)
  )
  const zipped = readFileSync(
    new URL("../fixtures/coastal-notes.svgz", import.meta.url)
  )
  expect(await read(new File([original], "coast.svg"))).toEqual(
    await read(new File([zipped], "coast.svgz"))
  )
})

test("detects UTF-16 BOMs and byte order and honors declared text encodings", async () => {
  const little = Buffer.from(svg, "utf16le")
  const big = Buffer.from(little).swap16()
  for (const bytes of [
    little,
    big,
    Buffer.concat([Buffer.from([255, 254]), little]),
    Buffer.concat([Buffer.from([254, 255]), big]),
  ])
    expect((await read(new File([bytes], "drawing.svg"))).svg).toContain(
      "Crème 日本語"
    )
  const latin = Buffer.from(
    '<?xml version="1.0" encoding="windows-1252"?><svg xmlns="http://www.w3.org/2000/svg"><text>Crème</text></svg>',
    "latin1"
  )
  expect((await read(new File([latin], "drawing.svg"))).svg).toContain("Crème")
  await expect(
    read(new File(['<?xml encoding="unknown"?>' + svg], "drawing.svg"))
  ).rejects.toThrow("ENCODING")
  await expect(
    read(new File([new Uint8Array([255])], "drawing.svg"))
  ).rejects.toThrow("ENCODING")
})

test("reports compression, encoding, document type and allocation failures separately", async () => {
  await expect(read(new File([svg], "drawing.svgz"))).rejects.toThrow(
    "COMPRESSION"
  )
  await expect(
    read(new File([new Uint8Array([31, 139, 1])], "drawing.svg"))
  ).rejects.toThrow("COMPRESSION")
  const damaged = gzipSync(svg)
  damaged[damaged.length - 8] = damaged[damaged.length - 8]! ^ 255
  await expect(read(new File([damaged], "drawing.svgz"))).rejects.toThrow(
    "COMPRESSION"
  )
  expect(failure(new Error("DOCTYPE"))).toBe("doctype")
  expect(failure(new Error("ENCODING"))).toBe("encoding")
  expect(failure(new Error("COMPRESSION"))).toBe("compression")
  expect(failure(new RangeError("oversized"))).toBe("resourceLimit")
  expect(failure(new Error("out of memory"))).toBe("resourceLimit")
  expect(failure(new Error("malformed"))).toBe("invalid")
  expect(failure(null)).toBe("invalid")
  vi.stubGlobal(
    "DecompressionStream",
    class {
      constructor() {
        throw new RangeError("memory")
      }
    }
  )
  await expect(read(new File([gzipSync(svg)], "drawing.svgz"))).rejects.toThrow(
    RangeError
  )
})

test("retains native decoder allocation and unexpected failures", async () => {
  const Native = TextDecoder
  vi.stubGlobal(
    "TextDecoder",
    class extends Native {
      override decode(
        input?: AllowSharedBufferSource,
        options?: TextDecodeOptions
      ) {
        if (options?.stream) return super.decode(input, options)
        if (input && input.byteLength > 1024)
          throw new RangeError("allocation failed")
        return super.decode(input, options)
      }
    }
  )
  await expect(
    read(new File([svg + " ".repeat(1100)], "drawing.svg"))
  ).rejects.toThrow("allocation failed")
})
