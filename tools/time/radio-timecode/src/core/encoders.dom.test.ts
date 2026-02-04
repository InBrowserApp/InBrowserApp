import { describe, expect, it } from 'vitest'
import { getStationSignal } from './encoders'

describe('timecode encoders', () => {
  it('encodes JJY markers and minute bits', () => {
    const marker = getStationSignal('jjy-60', new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))
    expect(marker.symbol).toBe('M')
    expect(marker.windows[0]).toEqual({ start: 0.2, end: 1 })

    const minute40 = getStationSignal('jjy-60', new Date(Date.UTC(2024, 0, 1, 0, 40, 1)))
    expect(minute40.symbol).toBe('1')
    expect(minute40.windows[0]).toEqual({ start: 0.5, end: 1 })
  })

  it('encodes DCF77 marker and start bit', () => {
    const marker = getStationSignal('dcf77', new Date(Date.UTC(2024, 0, 1, 0, 0, 59)))
    expect(marker.symbol).toBe('M')
    expect(marker.windows.length).toBe(0)

    const startBit = getStationSignal('dcf77', new Date(Date.UTC(2024, 0, 1, 0, 0, 20)))
    expect(startBit.symbol).toBe('1')
    expect(startBit.windows[0]).toEqual({ start: 0, end: 0.2 })

    const zeroBit = getStationSignal('dcf77', new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))
    expect(zeroBit.symbol).toBe('0')
    expect(zeroBit.windows[0]).toEqual({ start: 0, end: 0.1 })
  })

  it('encodes WWVB markers and zeros', () => {
    const marker = getStationSignal('wwvb', new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))
    expect(marker.symbol).toBe('M')
    expect(marker.windows[0]).toEqual({ start: 0, end: 0.8 })

    const zeroBit = getStationSignal('wwvb', new Date(Date.UTC(2024, 0, 1, 0, 0, 4)))
    expect(zeroBit.symbol).toBe('0')
    expect(zeroBit.windows[0]).toEqual({ start: 0, end: 0.2 })

    const oneBit = getStationSignal('wwvb', new Date(Date.UTC(2024, 0, 1, 0, 1, 8)))
    expect(oneBit.symbol).toBe('1')
    expect(oneBit.windows[0]).toEqual({ start: 0, end: 0.5 })
  })

  it('encodes MSF minute marker and data bits', () => {
    const marker = getStationSignal('msf', new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))
    expect(marker.symbol).toBe('M')
    expect(marker.windows[0]).toEqual({ start: 0, end: 0.5 })

    const data = getStationSignal('msf', new Date(Date.UTC(2024, 0, 1, 0, 0, 51)))
    expect(data.windows[0]).toEqual({ start: 0, end: 0.1 })
    expect(data.symbol.startsWith('A')).toBe(true)
  })

  it('encodes BPC frame markers', () => {
    const frameStart = getStationSignal('bpc', new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))
    expect(frameStart.symbol).toBe('P0')
    expect(frameStart.windows.length).toBe(0)

    const frameMarker = getStationSignal('bpc', new Date(Date.UTC(2024, 0, 1, 0, 0, 1)))
    expect(frameMarker.windows[0]).toEqual({ start: 0, end: 0.1 })

    const frameMarker2 = getStationSignal('bpc', new Date(Date.UTC(2024, 0, 1, 0, 0, 21)))
    expect(frameMarker2.windows[0]).toEqual({ start: 0, end: 0.2 })
  })

  it('returns a placeholder for unknown stations', () => {
    const fallback = getStationSignal('unknown' as never, new Date())
    expect(fallback).toEqual({ windows: [], symbol: '-' })
  })
})
