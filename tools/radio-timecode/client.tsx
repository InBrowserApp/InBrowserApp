import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react"

import { NotesCard } from "./components/notes-card"
import { OutputCard } from "./components/output-card"
import { PreviewCard } from "./components/preview-card"
import { SignalCard } from "./components/signal-card"
import { SignalEngine } from "./audio/signal-engine"
import {
  DEFAULT_OFFSET_MS,
  DEFAULT_STATION_ID,
  DEFAULT_VOLUME,
  PREVIEW_SECONDS,
  STORAGE_KEYS,
  TICK_INTERVAL_MS,
  clampOffset,
  clampVolume,
  createAudioContext,
  formatStationTime,
  getAudioContextConstructor,
  parseStoredNumber,
  parseStoredStation,
} from "./client-helpers"
import { getStationSignal } from "./core/encoders"
import { resolveStation } from "./core/stations"

import type { PreviewSymbol } from "./components/preview-card"
import type { StationId } from "./core/encoders"
import type { RadioTimecodeMessages } from "./types"

type RadioTimecodeClientProps = Readonly<{
  language: string
  messages: RadioTimecodeMessages
}>

const INITIAL_PREVIEW_TIME_MS = Date.UTC(2000, 0, 1, 0, 0, 0)

function RadioTimecodeClient({ language, messages }: RadioTimecodeClientProps) {
  const engineRef = useRef<SignalEngine | null>(null)
  const pendingRestartRef = useRef(false)
  const playbackConfigRef = useRef({
    offsetMs: DEFAULT_OFFSET_MS,
    stationId: DEFAULT_STATION_ID,
  })
  const startSerialRef = useRef(0)

  const [hasHydrated, setHasHydrated] = useState(false)
  const [audioAvailable, setAudioAvailable] = useState(false)
  const [stationId, setStationId] = useState<StationId>(DEFAULT_STATION_ID)
  const [volume, setVolume] = useState(DEFAULT_VOLUME)
  const [offsetMs, setOffsetMs] = useState(DEFAULT_OFFSET_MS)
  const [playing, setPlaying] = useState(false)
  const [starting, setStarting] = useState(false)
  const [startFailed, setStartFailed] = useState(false)
  const [nowMs, setNowMs] = useState(INITIAL_PREVIEW_TIME_MS)

  const station = resolveStation(stationId)
  const signalDate = useMemo(
    () => new Date(nowMs + offsetMs),
    [nowMs, offsetMs]
  )
  const currentSignal = useMemo(
    () => getStationSignal(station.id, signalDate),
    [signalDate, station.id]
  )
  const stationTime = useMemo(
    () => formatStationTime(signalDate, station.timeZone, language),
    [language, signalDate, station.timeZone]
  )
  const previewSymbols = useMemo<readonly PreviewSymbol[]>(
    () =>
      Array.from({ length: PREVIEW_SECONDS }, (_, offset) => ({
        offset,
        symbol: getStationSignal(
          station.id,
          new Date(signalDate.getTime() + offset * 1000)
        ).symbol,
      })),
    [signalDate, station.id]
  )
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(language),
    [language]
  )
  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(language, {
        maximumFractionDigits: 0,
      }),
    [language]
  )

  const stopSignal = useEffectEvent(() => {
    startSerialRef.current += 1
    pendingRestartRef.current = false
    setStarting(false)
    setStartFailed(false)
    engineRef.current?.stop()
    setPlaying(false)
  })

  const startSignal = useEffectEvent(async () => {
    if (!audioAvailable) {
      return
    }

    if (starting) {
      pendingRestartRef.current = true
      return
    }

    if (!engineRef.current) {
      engineRef.current = new SignalEngine(createAudioContext)
    }

    setStarting(true)
    setStartFailed(false)
    pendingRestartRef.current = false

    const serial = (startSerialRef.current += 1)

    try {
      await engineRef.current.start({
        station,
        volume,
        offsetMs,
      })

      if (serial === startSerialRef.current) {
        setPlaying(true)
      }
    } catch {
      if (serial === startSerialRef.current) {
        engineRef.current?.stop()
        setPlaying(false)
        setStartFailed(true)
      }
    } finally {
      if (serial === startSerialRef.current) {
        setStarting(false)
      }

      if (pendingRestartRef.current && serial === startSerialRef.current) {
        pendingRestartRef.current = false
        void startSignal()
      }
    }
  })

  useEffect(() => {
    setAudioAvailable(Boolean(getAudioContextConstructor()))
    setStationId(
      parseStoredStation(window.localStorage.getItem(STORAGE_KEYS.station))
    )
    setVolume(
      clampVolume(
        parseStoredNumber(
          window.localStorage.getItem(STORAGE_KEYS.volume),
          DEFAULT_VOLUME
        )
      )
    )
    setOffsetMs(
      clampOffset(
        parseStoredNumber(
          window.localStorage.getItem(STORAGE_KEYS.offset),
          DEFAULT_OFFSET_MS
        )
      )
    )
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    setNowMs(Date.now())

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now())
    }, TICK_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.station, stationId)
    window.localStorage.setItem(STORAGE_KEYS.volume, String(volume))
    window.localStorage.setItem(STORAGE_KEYS.offset, String(offsetMs))
  }, [hasHydrated, offsetMs, stationId, volume])

  useEffect(() => {
    if (!playing) {
      playbackConfigRef.current = { offsetMs, stationId }
      return
    }

    const previousConfig = playbackConfigRef.current

    if (
      previousConfig.offsetMs === offsetMs &&
      previousConfig.stationId === stationId
    ) {
      return
    }

    playbackConfigRef.current = { offsetMs, stationId }
    void startSignal()
  }, [offsetMs, playing, stationId])

  useEffect(() => {
    if (playing) {
      engineRef.current?.setVolume(volume)
    }
  }, [playing, volume])

  useEffect(() => {
    return () => {
      engineRef.current?.stop()
    }
  }, [])

  function formatHz(value: number) {
    return `${numberFormatter.format(value)} ${messages.hzUnit}`
  }

  function formatPercent(value: number) {
    return `${percentFormatter.format(value * 100)}${messages.percentUnit}`
  }

  return (
    <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="grid min-w-0 content-start gap-6">
        <SignalCard
          messages={messages}
          station={station}
          stationId={station.id}
          audioAvailable={audioAvailable}
          playing={playing}
          starting={starting}
          startFailed={startFailed}
          onStationChange={setStationId}
          onStart={() => {
            void startSignal()
          }}
          onStop={stopSignal}
        />

        <OutputCard
          messages={messages}
          station={station}
          volume={volume}
          offsetMs={offsetMs}
          formatHz={formatHz}
          formatPercent={formatPercent}
          onVolumeChange={(nextVolume) => {
            setVolume(clampVolume(nextVolume))
          }}
          onOffsetChange={(nextOffsetMs) => {
            setOffsetMs(clampOffset(nextOffsetMs))
          }}
        />
      </div>

      <div className="grid min-w-0 content-start gap-6">
        <PreviewCard
          messages={messages}
          station={station}
          stationTime={stationTime}
          currentSymbol={currentSignal.symbol}
          previewSymbols={previewSymbols}
        />

        <NotesCard messages={messages} />
      </div>
    </div>
  )
}

export default RadioTimecodeClient
