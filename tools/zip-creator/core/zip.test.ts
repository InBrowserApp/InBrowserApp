// @vitest-environment node
import { BlobReader, Uint8ArrayWriter, ZipReader } from "@zip.js/zip.js"
import { describe, expect, it } from "vitest"

import { createZip } from "./zip"

import type { Progress } from "../types"

describe("real ZIP output", () => {
  it.each([0, 1, 6])(
    "round trips exact bytes, Unicode, empty files, folders and modification dates at level %s",
    async (level) => {
      const bytes = Uint8Array.from({ length: 256 }, (_, i) => i)
      const modified = new Date("2024-06-01T12:00:00Z")
      const blob = await createZip(
        [
          { path: "旅行", file: null },
          { path: "旅行/empty", file: null },
          {
            path: "旅行/数据.bin",
            file: new File([bytes], "data.bin", {
              lastModified: modified.getTime(),
            }),
          },
          { path: "empty.txt", file: new File([], "empty.txt") },
        ],
        level,
        new AbortController().signal,
        () => {}
      )
      expect(blob.type).toBe("application/zip")
      const reader = new ZipReader(new BlobReader(blob))
      const entries = await reader.getEntries()
      expect(entries.map((entry) => entry.filename)).toEqual([
        "旅行/",
        "旅行/empty/",
        "旅行/数据.bin",
        "empty.txt",
      ])
      const binary = entries[2]!
      expect(binary.directory).toBe(false)
      if (!binary.directory)
        expect(await binary.getData(new Uint8ArrayWriter())).toEqual(bytes)
      expect(binary.lastModDate.toISOString()).toBe(modified.toISOString())
      expect(entries[3]!.uncompressedSize).toBe(0)
      await reader.close()
    }
  )

  it("reports bounded monotonic progress and compresses repetitive data", async () => {
    const progress: Progress[] = []
    const blob = await createZip(
      [
        {
          path: "repeated.txt",
          file: new File(["abc".repeat(100_000)], "repeated.txt"),
        },
      ],
      6,
      new AbortController().signal,
      (value) => progress.push(value)
    )
    expect(blob.size).toBeLessThan(300_000)
    expect(progress.length).toBeGreaterThan(1)
    expect(
      progress.every(
        (value, i) =>
          value.percent >= (progress[i - 1]?.percent ?? 0) &&
          value.percent < 100
      )
    ).toBe(true)
  })

  it("refuses an already cancelled operation", async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(
      createZip([], 6, controller.signal, () => {})
    ).rejects.toMatchObject({ name: "AbortError" })
  })

  it("cancels during writing without producing a partial download", async () => {
    const controller = new AbortController()
    await expect(
      createZip(
        [{ path: "data", file: new File(["x".repeat(100_000)], "data") }],
        6,
        controller.signal,
        () => controller.abort()
      )
    ).rejects.toBeDefined()
  })
})
