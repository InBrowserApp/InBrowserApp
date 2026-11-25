import { ArchiveError } from "@workspace/archive/types"
import { openWorkerArchive } from "@workspace/archive/worker"
import {
  failureCode,
  indexArchivePages,
  readPageImage,
} from "@workspace/comic/pages"
import { BlobReader, BlobWriter, ZipWriter } from "@zip.js/zip.js"
import { RepackError } from "./types"
import type { Progress, Result } from "./types"

function errorCode(reason: unknown) {
  return reason instanceof ArchiveError && reason.code === "entry-too-large"
    ? "resourceLimit"
    : failureCode(reason)
}

export async function repack(
  file: File,
  signal: AbortSignal,
  onProgress: (progress: Progress) => void
): Promise<Result> {
  const archive = await openWorkerArchive(file, "rar", signal, {
    preservePaths: true,
    sequentialReads: true,
  }).catch((reason: unknown) => {
    signal.throwIfAborted()
    throw new RepackError(errorCode(reason))
  })
  try {
    const entries = archive.entries.filter(
      ({ path }) =>
        !/^(?:\/|[a-z]:)/i.test(path) && !path.split("/").includes("..")
    )
    const pages = indexArchivePages(entries)
    if (!pages.length) throw new RepackError("empty")
    const metadata = entries.filter(
      ({ path, kind }) =>
        kind === "file" && /(?:^|\/)comicinfo\.xml$/i.test(path)
    )
    const zip = new ZipWriter(new BlobWriter("application/vnd.comicbook+zip"), {
      level: 0,
      bufferedWrite: false,
      useWebWorkers: false,
    })
    let cover: Blob | null = null
    const total = pages.length
    async function copy({
      path,
      modifiedAt,
    }: (typeof archive.entries)[number]) {
      signal.throwIfAborted()
      try {
        const blob = await archive.readEntry(path)
        await zip.add(path, new BlobReader(blob), {
          lastModDate: modifiedAt ?? undefined,
          signal,
        })
        return blob
      } catch (reason) {
        signal.throwIfAborted()
        throw new RepackError(errorCode(reason), path)
      }
    }
    try {
      for (const [index, { entry }] of pages.entries()) {
        onProgress({ page: index + 1, total })
        const blob = await copy(entry)
        if (index === 0) cover = await readPageImage(blob).catch(() => null)
      }
      for (const entry of metadata) await copy(entry)
      onProgress("saving")
    } catch (error) {
      await zip.close().catch(() => {})
      throw error
    }
    const cbz = await zip.close()
    signal.throwIfAborted()
    return {
      cbz,
      total,
      first: pages[0]!.entry.path,
      last: pages[total - 1]!.entry.path,
      metadata: Boolean(metadata.length),
      cover,
    }
  } finally {
    await archive.dispose()
  }
}
