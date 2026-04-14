import { formatStopwatch } from "./format"

type LapRow = Readonly<{
  key: number
  index: number
  lapTime: number
  totalTime: number
}>

type LapCsvLabels = Readonly<{
  lap: string
  total: string
  lapMilliseconds: string
  totalMilliseconds: string
}>

function buildLapRows(laps: readonly number[]) {
  let previousTotal = 0

  return laps.map<LapRow>((lapValue, index) => {
    const totalTime = Math.max(0, Math.floor(lapValue))
    const lapTime = Math.max(0, totalTime - previousTotal)

    previousTotal = totalTime

    return {
      key: index + 1,
      index: index + 1,
      lapTime,
      totalTime,
    }
  })
}

function escapeCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

function buildLapCsv(rows: readonly LapRow[], labels: LapCsvLabels) {
  if (rows.length === 0) {
    return ""
  }

  const header = [
    escapeCsvValue("#"),
    escapeCsvValue(labels.lap),
    escapeCsvValue(labels.total),
    escapeCsvValue(labels.lapMilliseconds),
    escapeCsvValue(labels.totalMilliseconds),
  ].join(",")
  const lines = rows.map((row) =>
    [
      escapeCsvValue(String(row.index)),
      escapeCsvValue(formatStopwatch(row.lapTime)),
      escapeCsvValue(formatStopwatch(row.totalTime)),
      escapeCsvValue(String(row.lapTime)),
      escapeCsvValue(String(row.totalTime)),
    ].join(",")
  )

  return `﻿${[header, ...lines].join("\n")}`
}

export { buildLapCsv, buildLapRows }
