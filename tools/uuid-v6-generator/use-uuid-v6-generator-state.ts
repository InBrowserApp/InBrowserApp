import { useEffect, useState } from "react"

import { formatDateTimeLocalInput } from "./core/local-date"
import { normalizeUuidV6Count } from "./core/uuid-v6"
import {
  DEFAULT_COUNT,
  DEFAULT_CUSTOM_CLOCK_SEQUENCE,
  DEFAULT_CUSTOM_NODE,
  STORAGE_KEYS,
  isTimestampMode,
  isUuidV6ClockSequenceMode,
  isUuidV6NodeMode,
} from "./storage"

import type { UuidV6ClockSequenceMode, UuidV6NodeMode } from "./core/uuid-v6"
import type { TimestampMode } from "./storage"

function getCurrentUnixMilliseconds() {
  return Date.now()
}

function useUuidV6GeneratorState() {
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [count, setCountState] = useState(DEFAULT_COUNT)
  const [timestampMode, setTimestampMode] = useState<TimestampMode>("now")
  const [nodeMode, setNodeMode] = useState<UuidV6NodeMode>("random")
  const [clockSequenceMode, setClockSequenceMode] =
    useState<UuidV6ClockSequenceMode>("random")
  const [customDateTimeInput, setCustomDateTimeInput] = useState(() =>
    formatDateTimeLocalInput(getCurrentUnixMilliseconds())
  )
  const [customUnixMillisecondsInput, setCustomUnixMillisecondsInput] =
    useState(() => String(getCurrentUnixMilliseconds()))
  const [customNodeInput, setCustomNodeInput] = useState(DEFAULT_CUSTOM_NODE)
  const [customClockSequenceInput, setCustomClockSequenceInput] = useState(
    DEFAULT_CUSTOM_CLOCK_SEQUENCE
  )

  useEffect(() => {
    const storedCount = window.localStorage.getItem(STORAGE_KEYS.count)
    const storedTimestampMode = window.localStorage.getItem(
      STORAGE_KEYS.timestampMode
    )
    const storedCustomDateTime = window.localStorage.getItem(
      STORAGE_KEYS.customDateTime
    )
    const storedCustomUnixMilliseconds = window.localStorage.getItem(
      STORAGE_KEYS.customUnixMilliseconds
    )
    const storedNodeMode = window.localStorage.getItem(STORAGE_KEYS.nodeMode)
    const storedCustomNode = window.localStorage.getItem(
      STORAGE_KEYS.customNode
    )
    const storedClockSequenceMode = window.localStorage.getItem(
      STORAGE_KEYS.clockSequenceMode
    )
    const storedCustomClockSequence = window.localStorage.getItem(
      STORAGE_KEYS.customClockSequence
    )

    if (storedCount !== null) {
      const parsedCount = Number(storedCount)

      if (Number.isFinite(parsedCount)) {
        setCountState(normalizeUuidV6Count(parsedCount))
      }
    }

    if (storedTimestampMode && isTimestampMode(storedTimestampMode)) {
      setTimestampMode(storedTimestampMode)
    }

    if (storedCustomDateTime !== null) {
      setCustomDateTimeInput(storedCustomDateTime)
    }

    if (storedCustomUnixMilliseconds !== null) {
      setCustomUnixMillisecondsInput(storedCustomUnixMilliseconds)
    }

    if (storedNodeMode && isUuidV6NodeMode(storedNodeMode)) {
      setNodeMode(storedNodeMode)
    }

    if (storedCustomNode !== null) {
      setCustomNodeInput(storedCustomNode)
    }

    if (
      storedClockSequenceMode &&
      isUuidV6ClockSequenceMode(storedClockSequenceMode)
    ) {
      setClockSequenceMode(storedClockSequenceMode)
    }

    if (storedCustomClockSequence !== null) {
      setCustomClockSequenceInput(storedCustomClockSequence)
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.count, String(count))
    window.localStorage.setItem(STORAGE_KEYS.timestampMode, timestampMode)
    window.localStorage.setItem(
      STORAGE_KEYS.customDateTime,
      customDateTimeInput
    )
    window.localStorage.setItem(
      STORAGE_KEYS.customUnixMilliseconds,
      customUnixMillisecondsInput
    )
    window.localStorage.setItem(STORAGE_KEYS.nodeMode, nodeMode)
    window.localStorage.setItem(STORAGE_KEYS.customNode, customNodeInput)
    window.localStorage.setItem(
      STORAGE_KEYS.clockSequenceMode,
      clockSequenceMode
    )
    window.localStorage.setItem(
      STORAGE_KEYS.customClockSequence,
      customClockSequenceInput
    )
  }, [
    clockSequenceMode,
    count,
    customClockSequenceInput,
    customDateTimeInput,
    customNodeInput,
    customUnixMillisecondsInput,
    hasLoadedStorage,
    nodeMode,
    timestampMode,
  ])

  return {
    clockSequenceMode,
    count,
    customClockSequenceInput,
    customDateTimeInput,
    customNodeInput,
    customUnixMillisecondsInput,
    nodeMode,
    setClockSequenceMode,
    setCount(value: string) {
      setCountState(normalizeUuidV6Count(Number(value)))
    },
    setCountState,
    setCustomClockSequenceInput,
    setCustomDateTimeInput,
    setCustomNodeInput,
    setCustomUnixMillisecondsInput,
    setNodeMode,
    setTimestampMode,
    timestampMode,
  }
}

export { getCurrentUnixMilliseconds, useUuidV6GeneratorState }
