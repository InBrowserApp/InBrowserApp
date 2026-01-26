import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  formatFileSize,
  getExtensionForMimeType,
  getSupportedMimeType,
} from './recorder'

describe('screen recorder utils', () => {
  it('picks the first supported mime type', () => {
    const isSupported = (type: string) => type === 'video/mp4'
    expect(getSupportedMimeType(isSupported)).toBe('video/mp4')
  })

  it('returns empty string when no types match', () => {
    const isSupported = (_type: string) => false
    expect(getSupportedMimeType(isSupported)).toBe('')
  })

  it('returns empty string when support check is missing', () => {
    expect(getSupportedMimeType()).toBe('')
  })

  it('maps extensions from mime types', () => {
    expect(getExtensionForMimeType('video/webm;codecs=vp9')).toBe('webm')
    expect(getExtensionForMimeType('video/mp4')).toBe('mp4')
    expect(getExtensionForMimeType('video/x-matroska')).toBe('mkv')
    expect(getExtensionForMimeType('video/unknown')).toBe('webm')
  })

  it('formats durations', () => {
    expect(formatDuration(0)).toBe('00:00')
    expect(formatDuration(59_000)).toBe('00:59')
    expect(formatDuration(60_000)).toBe('01:00')
    expect(formatDuration(3_661_000)).toBe('01:01:01')
  })

  it('formats file sizes', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(12)).toBe('12 B')
    expect(formatFileSize(2048)).toBe('2.0 KB')
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
    expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe('5.0 GB')
  })
})
