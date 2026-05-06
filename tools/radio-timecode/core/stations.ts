import type { StationId } from "./encoders"

type Station = Readonly<{
  id: StationId
  label: string
  shortLabel: string
  carrierHz: number
  baseHz: number
  timeZone: string
  lowRatio: number
  description: string
}>

const stations: readonly Station[] = [
  {
    id: "jjy-40",
    label: "JJY 40 kHz (Japan)",
    shortLabel: "JJY 40",
    carrierHz: 40_000,
    baseHz: 13_333,
    timeZone: "Asia/Tokyo",
    lowRatio: 0.1,
    description: "JJY Fukushima time signal, 40 kHz carrier, JST time code.",
  },
  {
    id: "jjy-60",
    label: "JJY 60 kHz (Japan)",
    shortLabel: "JJY 60",
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: "Asia/Tokyo",
    lowRatio: 0.1,
    description: "JJY Kyushu time signal, 60 kHz carrier, JST time code.",
  },
  {
    id: "bpc",
    label: "BPC 68.5 kHz (China)",
    shortLabel: "BPC",
    carrierHz: 68_500,
    baseHz: 17_125,
    timeZone: "Asia/Shanghai",
    lowRatio: 0.1,
    description: "BPC time signal, 68.5 kHz carrier, CST time code.",
  },
  {
    id: "dcf77",
    label: "DCF77 77.5 kHz (Germany)",
    shortLabel: "DCF77",
    carrierHz: 77_500,
    baseHz: 15_500,
    timeZone: "Europe/Berlin",
    lowRatio: 0.1,
    description: "DCF77 time signal, 77.5 kHz carrier, CET/CEST time code.",
  },
  {
    id: "msf",
    label: "MSF 60 kHz (UK)",
    shortLabel: "MSF",
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: "Europe/London",
    lowRatio: 0,
    description: "MSF time signal, 60 kHz carrier, UK civil time code.",
  },
  {
    id: "wwvb",
    label: "WWVB 60 kHz (USA)",
    shortLabel: "WWVB",
    carrierHz: 60_000,
    baseHz: 15_000,
    timeZone: "UTC",
    lowRatio: 0.1,
    description: "WWVB time signal, 60 kHz carrier, UTC time code.",
  },
]

const DEFAULT_STATION = stations[1]!

function getStationById(id: StationId) {
  return stations.find((station) => station.id === id)
}

function resolveStation(id: string | null | undefined) {
  return stations.find((station) => station.id === id) ?? DEFAULT_STATION
}

export { getStationById, resolveStation, stations }
export type { Station }
