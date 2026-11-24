import {
  archiveFormats,
  type ExtendedArchiveFormat,
  type FormatInfo,
} from "../core/formats"
import { guessMimeType } from "../core/mime"
import {
  extractExtension,
  normalizeArchivePath,
  splitPathSegments,
} from "../core/path"
import { ArchiveError, type ArchiveEntryKind } from "../core/types"

import type { ArchiveListing } from "./protocol"
import type createLibarchive from "../vendor/libarchive.d.mts"

type LibarchiveModule = Awaited<ReturnType<typeof createLibarchive>>

// libarchive/archive.h format and filter IDs.
const TAR = 0x30000
const RAW = 0x90000
const formatIds = {
  "7z": 0xe0000,
  rar: 0xd0000,
  cpio: 0x10000,
  ar: 0x70000,
  cab: 0xc0000,
  iso: 0x40000,
  lha: 0xb0000,
}
const filterIds = {
  bz2: 2,
  compress: 3,
  lzma: 5,
  xz: 6,
  lzip: 9,
  lz4: 13,
  zstd: 14,
}
// Extraction accumulates Blob parts in browser memory. Match the WASM heap cap.
const MAX_ENTRY_SIZE = 512 * 1024 * 1024

type ArchiveInput = {
  name: string
  size: number
  read(offset: number, length: number): Uint8Array
}

class LibarchiveReader {
  private rawName: string
  private filterId: number
  private formatId: number
  private allowRaw: boolean

  constructor(
    private module: LibarchiveModule,
    private input: ArchiveInput,
    format: ExtendedArchiveFormat
  ) {
    if (format in filterIds) {
      this.filterId = filterIds[format as keyof typeof filterIds]
      this.formatId = TAR
    } else {
      this.filterId = 0
      this.formatId = formatIds[format as keyof typeof formatIds]
    }
    const { suffixes, tarSuffixes }: FormatInfo = archiveFormats[format]
    const name = input.name.trim()
    const normalizedName = name.toLowerCase()
    this.allowRaw =
      this.filterId !== 0 &&
      !tarSuffixes?.some((suffix) => normalizedName.endsWith(suffix))
    const suffix = suffixes.find((suffix) => normalizedName.endsWith(suffix))
    this.rawName =
      (suffix ? name.slice(0, -suffix.length) : name) || "archive.bin"
  }

  list(): ArchiveListing {
    const listing = this.listEntries()
    // A zero-filled first block can make libarchive bid TAR for a raw file.
    // Honor empty TAR explicitly named by the user and preserve raw bytes otherwise.
    if (this.allowRaw && listing.tarWrapped && listing.entries.length === 0) {
      this.formatId = RAW
      return this.listEntries()
    }
    return listing
  }

  private listEntries(): ArchiveListing {
    return this.withReader(() => {
      const entries: ArchiveListing["entries"] = []
      let hasEntry = this.next()
      const tarWrapped =
        this.filterId !== 0 && this.module._viewer_format() === TAR
      const raw = this.allowRaw && !tarWrapped
      if (raw && !hasEntry) {
        entries.push(this.makeEntry(this.rawName, "file", 0, null, true))
      }
      while (hasEntry) {
        const kind = this.getKind()
        const path = raw
          ? this.rawName
          : normalizeArchivePath(
              this.module.UTF8ToString(this.module._viewer_path())
            )
        const modifiedAt = this.module._viewer_mtime()
        const size = raw
          ? this.readChunks()
          : kind === "file"
            ? this.module._viewer_size()
            : 0
        entries.push(
          this.makeEntry(
            path,
            kind,
            size,
            Number.isFinite(modifiedAt) ? new Date(modifiedAt) : null,
            raw
          )
        )
        hasEntry = this.next()
      }
      return { entries, tarWrapped }
    })
  }

  extract(index: number, path: string): Blob {
    return this.withReader(() => {
      let current = 0
      while (this.next()) {
        if (current++ !== index) continue
        if (this.module._viewer_encrypted()) {
          throw new ArchiveError("archive-read-failed", "Entry is encrypted.")
        }
        this.checkSize(this.module._viewer_size())
        const parts: ArrayBuffer[] = []
        this.readChunks(parts)
        return new Blob(parts, { type: guessMimeType(path) })
      }
      if (
        index === 0 &&
        this.allowRaw &&
        this.module._viewer_format() !== TAR
      ) {
        return new Blob([], { type: guessMimeType(path) })
      }
      throw new ArchiveError(
        "entry-not-found",
        `Archive entry not found: ${path}`
      )
    })
  }

  private makeEntry(
    path: string,
    kind: ArchiveEntryKind,
    size: number,
    modifiedAt: Date | null,
    raw: boolean
  ): ArchiveListing["entries"][number] {
    const segments = splitPathSegments(path).filter((part) => part !== ".")
    // The viewer never creates archive paths on a filesystem. Skip parent
    // segments so they cannot masquerade as navigation controls.
    const normalized = segments.includes("..") ? "" : segments.join("/")
    const displayPath =
      normalized && kind === "directory" ? `${normalized}/` : normalized
    return {
      path: displayPath,
      kind,
      size,
      modifiedAt,
      compressedSize: raw ? this.input.size : null,
      extension: extractExtension(displayPath),
    }
  }

  private getKind(): ArchiveEntryKind {
    switch (this.module._viewer_kind()) {
      case 0o100000:
        return "file"
      case 0o040000:
        return "directory"
      case 0o120000:
        return "symlink"
      default:
        return "other"
    }
  }

  private withReader<T>(run: () => T): T {
    this.module.readArchiveBytes = (offset, pointer, length) => {
      const bytes = this.input.read(offset, length)
      if (bytes.length !== length) return 0
      this.module.HEAPU8.set(bytes, pointer)
      return 1
    }

    try {
      this.checkStatus(
        this.module._viewer_open(
          this.input.size,
          this.formatId,
          this.filterId,
          Number(this.allowRaw)
        )
      )
      return run()
    } finally {
      this.module._viewer_close()
    }
  }

  private next(): boolean {
    const result = this.module._viewer_next()
    this.checkStatus(result)
    return result !== 1 // ARCHIVE_EOF
  }

  private checkStatus(status: number) {
    if (status < 0) {
      const reason = this.module.UTF8ToString(this.module._viewer_error())
      throw new ArchiveError(
        "archive-read-failed",
        reason || "Could not read archive."
      )
    }
  }

  private checkSize(size: number) {
    if (size > MAX_ENTRY_SIZE) {
      throw new ArchiveError("entry-too-large", "Entry exceeds 512 MiB.")
    }
  }

  private readChunks(parts?: ArrayBuffer[]): number {
    const pointer = this.module._viewer_buffer()
    let size = 0
    for (
      let length = this.module._viewer_read();
      length !== 0;
      length = this.module._viewer_read()
    ) {
      this.checkStatus(length)
      size += length
      this.checkSize(size)
      // Read from HEAPU8 only when extracting. Listing counts bytes without a copy.
      if (parts)
        parts.push(this.module.HEAPU8.slice(pointer, pointer + length).buffer)
    }
    return size
  }
}

export { LibarchiveReader }
