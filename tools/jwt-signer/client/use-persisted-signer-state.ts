import { useEffect } from "react"

import { getCurrentUnixSeconds } from "../payload-claims"
import {
  DEFAULT_HEADER,
  DEFAULT_PAYLOAD,
  STORAGE_KEYS,
  createCurrentIatPayload,
  isStoredAlgorithm,
  isStoredKeyFormat,
} from "./state-helpers"

import type { JwtAlgorithm, JwtKeyFormat } from "../core/jwt-signer"

type UsePersistedSignerStateOptions = Readonly<{
  payloadText: string
  headerText: string
  algorithm: JwtAlgorithm
  keyFormat: JwtKeyFormat
  useCurrentIat: boolean
  setPayloadText: (value: string) => void
  setHeaderText: (value: string) => void
  setAlgorithm: (value: JwtAlgorithm) => void
  setKeyFormat: (value: JwtKeyFormat) => void
  setUseCurrentIat: (value: boolean) => void
}>

function usePersistedSignerState({
  payloadText,
  headerText,
  algorithm,
  keyFormat,
  useCurrentIat,
  setPayloadText,
  setHeaderText,
  setAlgorithm,
  setKeyFormat,
  setUseCurrentIat,
}: UsePersistedSignerStateOptions) {
  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedPayload = window.localStorage.getItem(STORAGE_KEYS.payload)
    const storedHeader = window.localStorage.getItem(STORAGE_KEYS.header)
    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedKeyFormat = window.localStorage.getItem(STORAGE_KEYS.keyFormat)
    const storedUseCurrentIat = window.localStorage.getItem(
      STORAGE_KEYS.useCurrentIat
    )

    setPayloadText(
      storedPayload ??
        createCurrentIatPayload(DEFAULT_PAYLOAD, getCurrentUnixSeconds())
    )
    setHeaderText(storedHeader ?? DEFAULT_HEADER)
    if (isStoredAlgorithm(storedAlgorithm)) setAlgorithm(storedAlgorithm)
    if (isStoredKeyFormat(storedKeyFormat)) setKeyFormat(storedKeyFormat)
    if (storedUseCurrentIat !== null) {
      setUseCurrentIat(storedUseCurrentIat === "true")
    }
  }, [
    setAlgorithm,
    setHeaderText,
    setKeyFormat,
    setPayloadText,
    setUseCurrentIat,
  ])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.payload, payloadText)
  }, [payloadText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.header, headerText)
  }, [headerText])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.algorithm, algorithm)
    window.localStorage.setItem(STORAGE_KEYS.keyFormat, keyFormat)
    window.localStorage.setItem(
      STORAGE_KEYS.useCurrentIat,
      String(useCurrentIat)
    )
  }, [algorithm, keyFormat, useCurrentIat])
}

export { usePersistedSignerState }
