import { useMessage } from 'naive-ui'
import type { MessageApi } from 'naive-ui'
import type { ExportArchiveProgress } from './archive-browser-apis'

export function getMessageApi(): MessageApi | null {
  try {
    return useMessage()
  } catch {
    return null
  }
}

export function computeExportProgressPercent(progress: ExportArchiveProgress): number {
  if (progress.totalFiles <= 0) {
    return 100
  }

  return Math.round((progress.completedFiles / progress.totalFiles) * 100)
}

export function isSupportedArchiveFile(file: File, supportedSuffixes: string[]): boolean {
  const name = file.name.toLowerCase()
  return supportedSuffixes.some((suffix) => name.endsWith(suffix))
}
