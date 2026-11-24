import { openWorkerArchive } from "../workers/open-worker-archive"
import { detectArchiveFormat, readArchiveSniffBytes } from "./detect"
import { openGzipArchive } from "./gzip"
import { openTarArchive } from "./tar"
import { openZipArchive } from "./zip"

import type { ArchiveHandle } from "./types"

async function openArchive(
  file: File,
  signal?: AbortSignal
): Promise<ArchiveHandle> {
  signal?.throwIfAborted()
  const sniffBytes = await readArchiveSniffBytes(file)
  signal?.throwIfAborted()
  const format = detectArchiveFormat(file.name, sniffBytes)

  if (format === "zip") return openZipArchive(file)
  if (format === "tar") return openTarArchive(await file.arrayBuffer(), "tar")
  if (format === "gz" || format === "tgz") return openGzipArchive(file, format)
  return openWorkerArchive(file, format, signal)
}

export { openArchive }
