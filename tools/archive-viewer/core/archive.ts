import { detectArchiveFormat, readArchiveSniffBytes } from "./detect"
import { openGzipArchive } from "./gzip"
import { openTarArchive } from "./tar"
import { openZipArchive } from "./zip"

import type { ArchiveHandle } from "./types"

async function openArchive(file: File): Promise<ArchiveHandle> {
  const sniffBytes = await readArchiveSniffBytes(file)
  const format = detectArchiveFormat(file.name, sniffBytes)

  if (format === "zip") return openZipArchive(file)
  if (format === "tar") return openTarArchive(await file.arrayBuffer(), "tar")
  return openGzipArchive(file, format)
}

export { openArchive }
