import type { StationId } from './encoders'

export type Station = {
  id: StationId
  label: string
  carrierHz: number
  baseHz: number
  timeZone: string
  lowRatio: number
  description: string
}

export const stations: Station[] = [
  {
    id: 'jjy-40',
    label: 'JJY 40 kHz (Japan)',
    carrierHz: 40_000,
    baseHz: 13_333,
    timeZone: 'Asia/Tokyo',
    lowRatio: 0.1,
    description: 'JJY (Fukushima) time signal, 40 kHz carrier, JST time code.',
  },
  {
    id: 'jjy-60',
    label: 'JJY 60 kHz (Japan)',
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: 'Asia/Tokyo',
    lowRatio: 0.1,
    description: 'JJY (Kyushu) time signal, 60 kHz carrier, JST time code.',
  },
  {
    id: 'bpc',
    label: 'BPC 68.5 kHz (China)',
    carrierHz: 68_500,
    baseHz: 17_125,
    timeZone: 'Asia/Shanghai',
    lowRatio: 0.1,
    description: 'BPC time signal, 68.5 kHz carrier, CST time code (20-second frames).',
  },
  {
    id: 'dcf77',
    label: 'DCF77 77.5 kHz (Germany)',
    carrierHz: 77_500,
    baseHz: 15_500,
    timeZone: 'Europe/Berlin',
    lowRatio: 0.1,
    description: 'DCF77 time signal, 77.5 kHz carrier, CET/CEST time code.',
  },
  {
    id: 'msf',
    label: 'MSF 60 kHz (UK)',
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: 'Europe/London',
    lowRatio: 0,
    description: 'MSF time signal, 60 kHz carrier, UK civil time code.',
  },
  {
    id: 'wwvb',
    label: 'WWVB 60 kHz (USA)',
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: 'UTC',
    lowRatio: 0.1,
    description: 'WWVB time signal, 60 kHz carrier, UTC time code with US DST flags.',
  },
]

export function getStationById(id: StationId) {
  return stations.find((station) => station.id === id)
}
