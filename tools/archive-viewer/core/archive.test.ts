import { gzipSync } from "node:zlib"
import { describe, expect, test, vi } from "vitest"

import {
  detectArchiveFormat,
  isGzipSignature,
  isLikelyTar,
  isZipSignature,
  readArchiveSniffBytes,
} from "./detect"
import { openArchive } from "./archive"
import { parseGzipHeader, readGzipModifiedAt, ungzip } from "./gzip"
import {
  getTarEntryKind,
  indexTarEntries,
  isZeroBlock,
  joinTarPath,
  parsePaxPath,
  readTarNumber,
  stripTrailingNulls,
  toDate,
  openTarArchive,
} from "./tar"
import { ArchiveError } from "./types"
import { buildZipIndex } from "./zip"
import {
  concatChunks,
  createTar,
  createTarHeader,
  toArrayBuffer,
  writeString,
} from "../test-utils"

describe("archive format detection", () => {
  test("detects formats from names and signatures", () => {
    const tarBytes = createTar([{ path: "docs/readme.txt", content: "hello" }])

    expect(detectArchiveFormat("bundle.tar.gz", new Uint8Array())).toBe("tgz")
    expect(detectArchiveFormat("bundle.tgz", new Uint8Array())).toBe("tgz")
    expect(detectArchiveFormat("bundle.tar", new Uint8Array())).toBe("tar")
    expect(detectArchiveFormat("bundle.zip", new Uint8Array())).toBe("zip")
    expect(detectArchiveFormat("bundle.gz", new Uint8Array())).toBe("gz")
    expect(
      detectArchiveFormat("x", new Uint8Array([0x50, 0x4b, 0x03, 0x04]))
    ).toBe("zip")
    expect(detectArchiveFormat("x", new Uint8Array([0x1f, 0x8b]))).toBe("gz")
    expect(detectArchiveFormat("x", tarBytes)).toBe("tar")
    expect(isZipSignature(new Uint8Array([0x50, 0x4b, 0x05, 0x06]))).toBe(true)
    expect(isZipSignature(new Uint8Array([0x50, 0x4b, 0x07, 0x08]))).toBe(true)
    expect(isZipSignature(new Uint8Array([0x50, 0x4b, 0x01, 0x02]))).toBe(false)
    expect(isGzipSignature(new Uint8Array([0x1f, 0x8b]))).toBe(true)
    expect(isGzipSignature(new Uint8Array([0x1f]))).toBe(false)
    expect(isLikelyTar(tarBytes)).toBe(true)
    expect(isLikelyTar(new Uint8Array(264))).toBe(false)
  })

  test("reads only the archive sniff header", async () => {
    const bytes = new Uint8Array(600).fill(1)
    const sniffBytes = await readArchiveSniffBytes(
      new File([toArrayBuffer(bytes)], "sample.bin")
    )

    expect(sniffBytes).toHaveLength(512)
  })

  test("rejects unsupported formats", () => {
    expect(() =>
      detectArchiveFormat("notes.txt", new Uint8Array([1, 2]))
    ).toThrow(ArchiveError)
  })
})

describe("openArchive", () => {
  test("opens TAR archives and reads file entries", async () => {
    const tarBytes = createTar([
      { path: "docs", kind: "directory" },
      { path: "docs/readme.txt", content: "hello tar" },
    ])
    const file = new File([toArrayBuffer(tarBytes)], "sample.tar")
    const handle = await openArchive(file)

    expect(handle.format).toBe("tar")
    expect(handle.entries.map((entry) => entry.path)).toEqual([
      "docs/",
      "docs/readme.txt",
    ])
    await expect(handle.readEntry("docs/")).rejects.toThrow("Only files")
    expect(await (await handle.readEntry("docs/readme.txt")).text()).toBe(
      "hello tar"
    )
  })

  test("opens GZ archives as single-file entries", async () => {
    const compressed = gzipSync(Buffer.from("hello gzip"))
    const handle = await openArchive(new File([compressed], "notes.txt.gz"))

    expect(handle.format).toBe("gz")
    expect(handle.entries[0]?.path).toBe("notes.txt")
    expect(await (await handle.readEntry("notes.txt")).text()).toBe(
      "hello gzip"
    )
    await expect(handle.readEntry("missing")).rejects.toThrow(
      "Archive entry not found"
    )
    await handle.dispose()
  })

  test("falls back to a safe name for unnamed GZ entries", async () => {
    const compressed = gzipSync(Buffer.from("hello"))
    const handle = await openArchive(new File([compressed], ".gz"))

    expect(handle.entries[0]?.path).toBe("archive.bin")
  })

  test("uses the GZ filename when the original name is unsafe", async () => {
    const compressed = gzipSync(Buffer.from("hello"))
    const header = compressed.subarray(0, 10)
    header[3] = 0x08
    const withUnsafeName = concatChunks([
      header,
      new TextEncoder().encode(".\0"),
      compressed.subarray(10),
    ])
    const handle = await openArchive(
      new File([toArrayBuffer(withUnsafeName)], "fallback.gz")
    )

    expect(handle.entries[0]?.path).toBe("fallback")
  })

  test("opens TGZ archives", async () => {
    const tarBytes = createTar([{ path: "bin/app.sh", content: "echo ok" }])
    const compressed = gzipSync(Buffer.from(tarBytes))
    const handle = await openArchive(new File([compressed], "bundle.tgz"))

    expect(handle.format).toBe("tgz")
    expect(handle.entries[0]?.path).toBe("bin/app.sh")
    expect(await (await handle.readEntry("bin/app.sh")).text()).toBe("echo ok")
  })

  test("opens ZIP archives", async () => {
    const { BlobWriter, TextReader, ZipWriter } = await import("@zip.js/zip.js")
    const writer = new BlobWriter()
    const zipWriter = new ZipWriter(writer)
    await zipWriter.add("docs/readme.txt", new TextReader("hello zip"))
    await zipWriter.close()

    const handle = await openArchive(
      new File([await writer.getData()], "sample.zip")
    )

    expect(handle.format).toBe("zip")
    expect(handle.entries[0]?.path).toBe("docs/readme.txt")
    expect(await (await handle.readEntry("docs/readme.txt")).text()).toBe(
      "hello zip"
    )
    await expect(handle.readEntry("missing.txt")).rejects.toThrow(
      "Archive entry not found"
    )
    await handle.dispose()
  })

  test("indexes ZIP entries without opening the archive reader", async () => {
    const lastModDate = new Date("2024-01-01T00:00:00.000Z")
    const index = buildZipIndex([
      {
        filename: "",
        getData: vi.fn(),
      },
      {
        filename: "docs/",
        directory: true,
        lastModDate,
        getData: vi.fn(),
      },
      {
        filename: "docs/readme.txt",
        getData: vi.fn(async () => new Blob(["hello"])),
      },
    ])

    expect(index.entries).toEqual([
      {
        path: "docs/",
        kind: "directory",
        size: 0,
        compressedSize: null,
        modifiedAt: lastModDate,
        extension: "",
      },
      {
        path: "docs/readme.txt",
        kind: "file",
        size: 0,
        compressedSize: null,
        modifiedAt: null,
        extension: "txt",
      },
    ])
    expect(index.entryByPath.has("docs/")).toBe(false)
    expect(
      await index.entryByPath.get("docs/readme.txt")?.getData({})
    ).toBeInstanceOf(Blob)
  })
})

describe("archive helpers", () => {
  test("parses tar metadata, long paths, and PAX paths", () => {
    const longPath = "very/long/path/that/should/win/over/header-name.txt"
    const longBytes = new TextEncoder().encode(`${longPath}\0`)
    const content = new TextEncoder().encode("hello")
    const pax = new TextEncoder().encode("28 path=from-pax/entry.txt\n")

    const tarBytes = concatChunks([
      createTarHeader("LONGNAME", longBytes.length, "L"),
      longBytes,
      new Uint8Array(512 - longBytes.length),
      createTarHeader("fallback.txt", content.length, "0"),
      content,
      new Uint8Array(512 - content.length),
      createTarHeader("PAX", pax.length, "x"),
      pax,
      new Uint8Array(512 - pax.length),
      createTarHeader("ignored.txt", 0, "0"),
      new Uint8Array(1024),
    ])

    expect(indexTarEntries(tarBytes).map((entry) => entry.path)).toEqual([
      longPath,
      "from-pax/entry.txt",
    ])
    expect(getTarEntryKind("5", "dir/")).toBe("directory")
    expect(getTarEntryKind("2", "link")).toBe("symlink")
    expect(getTarEntryKind("x", "meta")).toBe("other")
    expect(parsePaxPath("12 size=9\n")).toBeNull()
    expect(parsePaxPath("11 path=\n")).toBeNull()
    expect(parsePaxPath("bad-record\n")).toBeNull()
    expect(parsePaxPath("9 no-eq\n")).toBeNull()
    expect(stripTrailingNulls("x\0\0")).toBe("x")
    expect(stripTrailingNulls("x")).toBe("x")
    expect(joinTarPath("docs", "a.txt")).toBe("docs/a.txt")
    expect(joinTarPath("", "a.txt")).toBe("a.txt")
    expect(joinTarPath("docs", "")).toBe("docs")
    expect(isZeroBlock(new Uint8Array(4))).toBe(true)
    expect(isZeroBlock(new Uint8Array([0, 1]))).toBe(false)
    expect(toDate(1711929600)).toBeInstanceOf(Date)
    expect(toDate(0)).toBeNull()
  })

  test("handles truncated tar and invalid numbers", () => {
    const header = createTarHeader("bad.txt", 12, "0")
    expect(() => indexTarEntries(header)).toThrow("truncated")

    const paxWithoutPath = new TextEncoder().encode("12 size=9\n")
    const fallback = new TextEncoder().encode("fallback")
    expect(
      indexTarEntries(
        concatChunks([
          createTarHeader("PAX", paxWithoutPath.length, "x"),
          paxWithoutPath,
          new Uint8Array(512 - paxWithoutPath.length),
          createTarHeader("fallback.txt", fallback.length, "0"),
          fallback,
          new Uint8Array(512 - fallback.length),
          createTarHeader(".", 0, "0"),
          new Uint8Array(1024),
        ])
      ).map((entry) => entry.path)
    ).toEqual(["fallback.txt"])
    expect(readTarNumber(new Uint8Array(12), 0, 12)).toBe(0)
    writeString(header, 124, 12, "bad")
    expect(readTarNumber(header, 124, 12)).toBe(0)
  })

  test("reports missing TAR entries and supports disposal", async () => {
    const tarBytes = createTar([{ path: "docs/readme.txt", content: "hello" }])
    const handle = await openTarArchive(toArrayBuffer(tarBytes), "tar")

    await expect(handle.readEntry("missing.txt")).rejects.toThrow(
      "Archive entry not found"
    )
    await handle.dispose()
  })

  test("parses gzip header flags and unsupported decompression", async () => {
    const header = concatChunks([
      new Uint8Array([0x1f, 0x8b, 0x08, 0x1e, 0x01, 0, 0, 0, 0, 3]),
      new Uint8Array([0x02, 0]),
      new Uint8Array([1, 2]),
      new TextEncoder().encode("named.txt\0comment\0"),
      new Uint8Array([0, 0]),
    ])
    const parsed = await parseGzipHeader(
      new File([toArrayBuffer(header)], "x.gz")
    )

    expect(parsed.originalName).toBe("named.txt")
    expect(parsed.modifiedAt).toBeInstanceOf(Date)
    expect(readGzipModifiedAt(new Uint8Array(10))).toBeNull()
    await expect(parseGzipHeader(new File(["bad"], "bad.gz"))).rejects.toThrow(
      "Invalid GZIP"
    )
    expect(
      await parseGzipHeader(
        new File([new Uint8Array([0x1f, 0x8b])], "short.gz")
      )
    ).toEqual({ originalName: null, modifiedAt: null })
    await expect(
      parseGzipHeader({
        size: 10,
        slice: () => new Blob(),
      } as unknown as File)
    ).rejects.toThrow("Invalid GZIP")
    expect(
      await parseGzipHeader(
        new File(
          [new Uint8Array([0x1f, 0x8b, 0x08, 0x04, 0x01, 0, 0, 0, 0, 3])],
          "short-extra.gz"
        )
      )
    ).toEqual({ originalName: null, modifiedAt: new Date(1000) })
    expect(
      await parseGzipHeader(
        new File(
          [new Uint8Array([0x1f, 0x8b, 0x08, 0x04, 0x01, 0, 0, 0, 0, 3, 4, 0])],
          "truncated-extra.gz"
        )
      )
    ).toEqual({ originalName: null, modifiedAt: new Date(1000) })
    expect(
      await parseGzipHeader(
        new File(
          [new Uint8Array([0x1f, 0x8b, 0x08, 0x18, 0x01, 0, 0, 0, 0, 3, 0x61])],
          "truncated-name.gz"
        )
      )
    ).toEqual({ originalName: null, modifiedAt: new Date(1000) })
    expect(readGzipModifiedAt(new Uint8Array(7))).toBeNull()

    const original = globalThis.DecompressionStream
    Object.defineProperty(globalThis, "DecompressionStream", {
      configurable: true,
      value: undefined,
    })
    await expect(
      ungzip(new File([new Uint8Array([0x1f, 0x8b])], "x.gz"))
    ).rejects.toThrow("GZIP decompression")
    Object.defineProperty(globalThis, "DecompressionStream", {
      configurable: true,
      value: original,
    })
  })

  test("parses gzip header without reading the full file", async () => {
    const header = concatChunks([
      new Uint8Array([0x1f, 0x8b, 0x08, 0x08, 0x01, 0, 0, 0, 0, 3]),
      new TextEncoder().encode("huge.txt\0"),
      new Uint8Array(1024 * 1024),
    ])
    const blob = new Blob([toArrayBuffer(header)])
    const fileLike = {
      size: blob.size,
      slice: vi.fn((start?: number, end?: number) => blob.slice(start, end)),
      arrayBuffer: vi.fn(async () => {
        throw new Error("should not read whole file")
      }),
    } as unknown as File

    expect((await parseGzipHeader(fileLike)).originalName).toBe("huge.txt")
    expect(fileLike.arrayBuffer).not.toHaveBeenCalled()
  })
})
