import { describe, expect, it } from 'vitest'
import { normalizeVolumeEntry } from './volume'

describe('docker run volume normalization', () => {
  it('returns simple volume entries unchanged', () => {
    const volumeNames = new Set<string>()

    expect(normalizeVolumeEntry('/data', volumeNames)).toBe('/data')
    expect(volumeNames.size).toBe(0)
  })

  it('keeps container path plus mode', () => {
    const volumeNames = new Set<string>()

    expect(normalizeVolumeEntry('/data:ro', volumeNames)).toBe('/data:ro')
  })

  it('detects named volumes and windows paths', () => {
    const volumeNames = new Set<string>()

    expect(normalizeVolumeEntry('cache:/var/cache', volumeNames)).toBe('cache:/var/cache')
    expect(volumeNames.has('cache')).toBe(true)

    expect(normalizeVolumeEntry('C:\\data:/app:ro', volumeNames)).toBe('C:\\data:/app:ro')
  })
})
