import { filesize } from 'filesize'
import type { ArchiveEntryKind } from '../types'

export function kindLabel(kind: ArchiveEntryKind): string {
  const map: Record<ArchiveEntryKind, string> = {
    file: 'file',
    directory: 'directory',
    symlink: 'symlink',
    other: 'other',
  }

  return map[kind]
}

export function formatBytes(value: number): string {
  return filesize(value) as string
}

export function formatDate(value: Date | null): string {
  if (!value) return '-'
  return value.toLocaleString()
}
