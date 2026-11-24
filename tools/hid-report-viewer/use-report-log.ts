import { useEffect, useRef, useState } from "react"

import { readReport } from "./core/report"

export type Report = ReturnType<typeof readReport> & {
  sequence: number
  reportId: number
  time: Date
}

const limit = 80

export function useReportLog() {
  const [reports, setReports] = useState<Report[]>([])
  const [paused, setPaused] = useState(false)
  const capture = useRef(true)
  const stored = useRef<Report[]>([])
  const lastById = useRef(new Map<number, Uint8Array>())
  const sequence = useRef(0)
  const frame = useRef<number | undefined>(undefined)

  useEffect(
    () => () => {
      if (frame.current !== undefined) cancelAnimationFrame(frame.current)
    },
    []
  )

  function add(reportId: number, data: DataView) {
    if (!capture.current) return
    const report = readReport(data, lastById.current.get(reportId))
    lastById.current.set(reportId, report.bytes)
    stored.current.push({
      ...report,
      reportId,
      time: new Date(),
      sequence: sequence.current++,
    })
    if (stored.current.length > limit) stored.current.shift()
    frame.current ??= requestAnimationFrame(() => {
      frame.current = undefined
      setReports([...stored.current].reverse())
    })
  }

  function clear() {
    stored.current = []
    lastById.current.clear()
    setReports([])
  }

  function toggleCapture() {
    capture.current = !capture.current
    if (capture.current) lastById.current.clear()
    setPaused(!capture.current)
  }

  function startSession() {
    clear()
    capture.current = true
    setPaused(false)
  }

  return { reports, paused, add, clear, toggleCapture, startSession }
}
