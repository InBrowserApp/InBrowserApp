// @vitest-environment node

import { readFile } from "node:fs/promises"
import { zstdCompressSync } from "node:zlib"
import { beforeAll, describe, expect, test, vi } from "vitest"

import { detectArchiveFormat } from "../core/detect"
import { ArchiveError } from "../core/types"
import { createTar } from "../test-utils"
import createLibarchive from "../vendor/libarchive.mjs"
import { LibarchiveReader } from "./libarchive-reader"

import type { ExtendedArchiveFormat } from "../core/formats"

let module: Awaited<ReturnType<typeof createLibarchive>>

beforeAll(async () => {
  vi.stubGlobal("self", { location: { href: import.meta.url } })
  const binary = await readFile(
    `${import.meta.dirname}/../vendor/libarchive.wasm`
  )
  module = await createLibarchive({ wasmBinary: new Uint8Array(binary) })
})

function readerFor(
  data: Uint8Array,
  name: string,
  format?: ExtendedArchiveFormat
) {
  const detected =
    format ?? (detectArchiveFormat(name, data) as ExtendedArchiveFormat)
  return new LibarchiveReader(
    module,
    {
      name,
      size: data.length,
      read: (offset, length) => data.subarray(offset, offset + length),
    },
    detected
  )
}

async function fixture(name: string) {
  return readerFor(
    await readFile(`${import.meta.dirname}/../fixtures/${name}`),
    name
  )
}

describe("bundled libarchive decoder", () => {
  test.each([
    [
      "solid.7z",
      "zfile4",
      "aaaaaaaaaaaa\nbbbbbbbbbbbb\ncccccccccccc\ndddddddddddd\n",
    ],
    [
      "solid-zstd.7z",
      "file4",
      "aaaaaaaaaaaa\nbbbbbbbbbbbb\ncccccccccccc\ndddddddddddd\n",
    ],
    ["unicode.7z", "文档/说明.txt", "hello archive\n"],
    ["rar4.rar", "testdir/test.txt", "test text document\r\n"],
    ["sample.cpio", "file1111222233334444", "abcde"],
    ["sample.ar", "sample.txt", "hello archive\n"],
    ["sample.iso", "hardlink", "hello\n"],
    [
      "sample.cab",
      "dir2/file2",
      "                          file 2 contents\nhello\nhello\nhello\nhello\nhello\nhello\n",
    ],
    [
      "sample.lzh",
      "file1",
      "                          file 1 contents\nhello\nhello\nhello\n",
    ],
  ])("lists %s and extracts %s independently", async (name, path, text) => {
    const reader = await fixture(name)
    const { entries, tarWrapped } = reader.list()
    expect(tarWrapped).toBe(false)
    const index = entries.findIndex((entry) => entry.path === path)
    expect(index).toBeGreaterThanOrEqual(0)
    expect(entries[index]?.kind).toBe("file")
    expect(await reader.extract(index, path).text()).toBe(text)
  })

  test("selectively reads the last file from a solid RAR5", async () => {
    const reader = await fixture("rar5-solid.rar")
    const { entries } = reader.list()
    expect(entries.map(({ path }) => path)).toEqual([
      "test1.bin",
      "test2.bin",
      "test3.bin",
      "test4.bin",
    ])
    const blob = reader.extract(3, "test4.bin")
    expect(blob.size).toBe(4096)
    expect(
      Array.from(new Uint8Array(await blob.slice(0, 16).arrayBuffer()))
    ).toEqual([3, 0, 0, 0, 3, 0, 0, 0, 5, 0, 0, 0, 9, 0, 0, 0])
  })

  test("reuses a solid RAR decoder for forward reads and reopens on rewind", async () => {
    const reader = await fixture("rar5-solid.rar")
    reader.list()
    const open = vi.spyOn(module, "_viewer_open")
    try {
      const first = reader.extract(0, "test1.bin", true)
      const second = reader.extract(1, "test2.bin", true)
      const forwardOpens = open.mock.calls.length
      const rewind = reader.extract(0, "test1.bin")
      expect(forwardOpens).toBe(1)
      expect(open).toHaveBeenCalledTimes(2)
      expect(new Uint8Array(await rewind.arrayBuffer())).toEqual(
        new Uint8Array(await first.arrayBuffer())
      )
      expect(new Uint8Array(await second.arrayBuffer())).not.toEqual(
        new Uint8Array(await first.arrayBuffer())
      )
    } finally {
      open.mockRestore()
    }
  })

  test("preserves distinct whitespace in paths when repacking", async () => {
    const reader = readerFor(
      zstdCompressSync(
        createTar([
          { path: "chapter/page.png", content: "first" },
          { path: "chapter /page.png", content: "second" },
        ])
      ),
      "comic.tar.zst"
    )
    const { entries } = reader.list(true)
    expect(entries.map(({ path }) => path)).toEqual([
      "chapter/page.png",
      "chapter /page.png",
    ])
    expect(await reader.extract(1, entries[1]!.path).text()).toBe("second")
  })

  test("reads Windows-encoded LHA filenames as Unicode", async () => {
    const reader = await fixture("japanese.lzh")
    expect(reader.list().entries.map(({ path }) => path)).toEqual([
      "漢字.txt",
      "表.txt",
    ])
    expect(reader.extract(1, "表.txt").size).toBe(4)
  })

  test("checks the declared uncompressed size before extracting", async () => {
    const reader = await fixture("solid.7z")
    const size = vi
      .spyOn(module, "_viewer_size")
      .mockReturnValueOnce(512 * 1024 * 1024 + 1)
    try {
      expect(() => reader.extract(0, "dir1/file1")).toThrow(
        "Entry exceeds 512 MiB"
      )
    } finally {
      size.mockRestore()
    }
  })

  test("handles a mixed encrypted RAR and preserves readable files after a failed read", async () => {
    const reader = await fixture("rar5-encrypted.rar")
    expect(reader.list().entries.map(({ path }) => path)).toEqual([
      "a.txt",
      "b.txt",
      "c.txt",
      "d.txt",
    ])
    expect(() => reader.extract(1, "b.txt")).toThrow("Entry is encrypted.")
    expect(await reader.extract(2, "c.txt").text()).toBe("This is from c.txt")
  })

  test("distinguishes empty archives, folders, symbolic links, and missing entries", async () => {
    const emptyArchive = await fixture("empty.7z")
    expect(emptyArchive.list().entries).toEqual([])
    expect(() => emptyArchive.extract(0, "missing")).toThrow(
      "Archive entry not found"
    )

    const rar = await fixture("rar4.rar")
    expect(rar.list().entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: "testdir/", kind: "directory" }),
        expect.objectContaining({ path: "testlink", kind: "symlink" }),
      ])
    )
  })

  test.each([
    ["zst", "hello archive\n"],
    ["xz", "hello archive\n"],
    ["bz2", "hello archive\n"],
    ["lz4", "hello archive\n"],
    ["lz", "hello archive\n"],
    ["lzma", "hello archive\n"],
    ["Z", "abc\n"],
  ])("opens a standalone .%s file", async (extension, text) => {
    const reader = await fixture(`sample.txt.${extension}`)
    expect(reader.list()).toEqual({
      entries: [
        expect.objectContaining({ path: "sample.txt", size: text.length }),
      ],
      tarWrapped: false,
    })
    const blob = reader.extract(0, "sample.txt")
    expect(blob.type).toContain("text/plain")
    expect(await blob.text()).toBe(text)
  })

  test.each(["sample.tar.zst", "sample.tlz"])(
    "browses the TAR inside %s",
    async (name) => {
      const reader = await fixture(name)
      const listing = reader.list()
      expect(listing.tarWrapped).toBe(true)
      expect(listing.entries[0]).toMatchObject({ path: "docs/readme.txt" })
      expect(await reader.extract(0, "docs/readme.txt").text()).toBe(
        "hello archive\n"
      )
    }
  )

  test("finds compressed TAR by contents and opens an explicitly named empty TAR", () => {
    const tar = createTar([{ path: "docs/item.txt", content: "data" }])
    expect(readerFor(zstdCompressSync(tar), "bundle.zst").list()).toMatchObject(
      {
        tarWrapped: true,
        entries: [expect.objectContaining({ path: "docs/item.txt" })],
      }
    )
    expect(
      readerFor(zstdCompressSync(new Uint8Array(1024)), "empty.tar.zst").list()
    ).toEqual({
      tarWrapped: true,
      entries: [],
    })
  })

  test("preserves empty and zero-prefixed standalone streams", async () => {
    const empty = await fixture("empty.txt.zst")
    expect(empty.list().entries[0]).toMatchObject({
      path: "empty.txt",
      size: 0,
    })
    expect(empty.extract(0, "empty.txt").size).toBe(0)

    const data = new Uint8Array(513)
    data[512] = 42
    const raw = readerFor(zstdCompressSync(data), "zero.bin.zst")
    expect(raw.list()).toMatchObject({
      entries: [
        expect.objectContaining({ path: "zero.bin", size: data.length }),
      ],
      tarWrapped: false,
    })
    expect(
      new Uint8Array(await raw.extract(0, "zero.bin").arrayBuffer())
    ).toEqual(data)
  })

  test("rejects mismatched compression and allows reusing the module", async () => {
    expect(() =>
      readerFor(new Uint8Array([1, 2, 3]), "broken.zst").list()
    ).toThrow(ArchiveError)
    const reader = await fixture("sample.txt.zst")
    expect(reader.list().entries[0]?.path).toBe("sample.txt")
  })
})
