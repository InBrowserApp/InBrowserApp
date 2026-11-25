// @vitest-environment node
import { Buffer } from "node:buffer"
import { deflateSync } from "node:zlib"
import { expect, test, vi } from "vitest"
import { openPst, pstSource } from "./pst"

test("reads across file page boundaries, reuses cached pages and stops at EOF", () => {
  const first = Buffer.alloc(1024 * 1024, 1)
  const second = Buffer.from([2, 3, 4, 5])
  const bytes = Buffer.concat([first, second])
  const file = new Blob([Uint8Array.from(bytes)])
  let position = 0
  const readPage = vi.fn((page: Blob) => {
    const result = Uint8Array.from(
      bytes.subarray(position, position + page.size)
    )
    position += page.size
    return result.buffer
  })
  const source = pstSource(file, readPage)
  const target = Buffer.alloc(6)
  expect(source.read(target, 6, first.length - 2)).toBe(6)
  expect([...target]).toEqual([1, 1, 2, 3, 4, 5])
  expect(source.read(target, 6, first.length + 3)).toBe(1)
  expect(target[0]).toBe(5)
  expect(readPage).toHaveBeenCalledTimes(2)
  expect(source.read(target, 6, bytes.length)).toBe(0)
  expect(() => source.read(target, 6, -1)).toThrow("invalid")
})

test("decodes compressed blocks and rejects invalid file headers", async () => {
  const source = pstSource(
    new globalThis.Blob([new Uint8Array(520)]),
    (page) => new ArrayBuffer(page.size)
  )
  expect(source.unzip(deflateSync("compressed PST block")).toString()).toBe(
    "compressed PST block"
  )
  await expect(openPst(source)).rejects.toThrow(/Invalid file header/)
})
