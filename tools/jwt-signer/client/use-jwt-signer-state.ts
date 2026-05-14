import { useMemo, useState } from "react"

import { createKeyFormatOptions } from "../components/signing-options-card"
import {
  signJwt,
  type JwtAlgorithm,
  type JwtKeyFormat,
  type SignJwtResult,
} from "../core/jwt-signer"
import {
  deleteNumericDateClaim,
  formatDateTimeLocalInput,
  getCurrentUnixSeconds,
  getNumericDateClaim,
  parseDateTimeLocalInput,
  sameNumericDateValue,
  setNumericDateClaim,
  type NumericDateValue,
} from "../payload-claims"
import {
  DEFAULT_HEADER,
  DEFAULT_PAYLOAD,
  SAMPLE_SECRET,
  createCurrentIatPayload,
  formatSignerError,
  getRelativeExpirationSigningValue,
  resolveRelativeExpiration,
  validateJsonObject,
} from "./state-helpers"
import { useDownloadUrl } from "./use-download-url"
import { usePersistedSignerState } from "./use-persisted-signer-state"
import { useUnixSecondClock } from "./use-unix-second-clock"

import type { JwtSignerMessages } from "./types"

function useJwtSignerState(messages: JwtSignerMessages) {
  const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD)
  const [headerText, setHeaderText] = useState(DEFAULT_HEADER)
  const [algorithm, setAlgorithm] = useState<JwtAlgorithm>("HS256")
  const [keyFormat, setKeyFormat] = useState<JwtKeyFormat>("secret")
  const [key, setKey] = useState(SAMPLE_SECRET)
  const [useCurrentIat, setUseCurrentIat] = useState(true)
  const [relativeExpOffset, setRelativeExpOffset] = useState<number | null>(
    null
  )
  const [result, setResult] = useState<SignJwtResult | null>(null)
  const [error, setError] = useState("")
  const [isSigning, setIsSigning] = useState(false)
  const nowSeconds = useUnixSecondClock(
    useCurrentIat || relativeExpOffset !== null
  )
  const downloadUrl = useDownloadUrl(result)

  usePersistedSignerState({
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
  })

  const payloadError = useMemo(
    () =>
      validateJsonObject(
        payloadText,
        messages.errorInvalidPayloadJson,
        messages.errorPayloadMustBeObject
      ),
    [messages, payloadText]
  )
  const headerError = useMemo(
    () =>
      validateJsonObject(
        headerText || "{}",
        messages.errorInvalidHeaderJson,
        messages.errorHeaderMustBeObject
      ),
    [headerText, messages]
  )
  const canSign =
    !payloadError && !headerError && key.trim().length > 0 && !isSigning
  const iatValue = useMemo(
    () => getNumericDateClaim(payloadText, "iat"),
    [payloadText]
  )
  const expValue = useMemo(
    () => getNumericDateClaim(payloadText, "exp"),
    [payloadText]
  )
  const iatSigningValue: NumericDateValue = useCurrentIat
    ? nowSeconds === null
      ? iatValue
      : { status: "valid", value: nowSeconds }
    : iatValue
  const expSigningValue: NumericDateValue =
    relativeExpOffset === null
      ? expValue
      : getRelativeExpirationSigningValue({
          iatValue,
          nowSeconds,
          offsetSeconds: relativeExpOffset,
          useCurrentIat,
        })
  const expInputValue =
    expValue.status === "valid" ? formatDateTimeLocalInput(expValue.value) : ""

  function handleAlgorithmChange(nextAlgorithm: JwtAlgorithm) {
    setAlgorithm(nextAlgorithm)
    const options = createKeyFormatOptions(messages, nextAlgorithm)
    if (!options.some((option) => option.value === keyFormat)) {
      setKeyFormat(options[0]!.value)
      setKey("")
    }
  }

  function handleLoadSample() {
    setPayloadText(
      createCurrentIatPayload(DEFAULT_PAYLOAD, getCurrentUnixSeconds())
    )
    setHeaderText(DEFAULT_HEADER)
    setAlgorithm("HS256")
    setKeyFormat("secret")
    setKey(SAMPLE_SECRET)
    setUseCurrentIat(true)
    setRelativeExpOffset(null)
    setResult(null)
    setError("")
  }

  function handleReset() {
    setPayloadText("")
    setHeaderText("{}")
    setAlgorithm("HS256")
    setKeyFormat("secret")
    setKey("")
    setUseCurrentIat(true)
    setRelativeExpOffset(null)
    setResult(null)
    setError("")
  }

  function handleUseCurrentIatChange(nextValue: boolean) {
    setUseCurrentIat(nextValue)
  }

  function handlePayloadTextChange(nextPayloadText: string) {
    if (relativeExpOffset !== null) {
      const previousExpValue = getNumericDateClaim(payloadText, "exp")
      const nextExpValue = getNumericDateClaim(nextPayloadText, "exp")

      if (!sameNumericDateValue(previousExpValue, nextExpValue)) {
        setRelativeExpOffset(null)
      }
    }

    setPayloadText(nextPayloadText)
  }

  function handleExpirationInputChange(nextValue: string) {
    if (!nextValue) {
      handleClearExpiration()
      return
    }

    const unixSeconds = parseDateTimeLocalInput(nextValue)

    if (unixSeconds === null) {
      return
    }

    setRelativeExpOffset(null)
    updatePayloadText((currentPayloadText) =>
      setNumericDateClaim(currentPayloadText, "exp", unixSeconds)
    )
  }

  function handleExpirationOffsetClick(offsetSeconds: number) {
    setRelativeExpOffset(offsetSeconds)
    updatePayloadText((currentPayloadText) =>
      setNumericDateClaim(
        currentPayloadText,
        "exp",
        resolveRelativeExpiration({
          iatValue: getNumericDateClaim(currentPayloadText, "iat"),
          nowSeconds: getCurrentUnixSeconds(),
          offsetSeconds,
          useCurrentIat,
        })
      )
    )
  }

  function handleClearExpiration() {
    setRelativeExpOffset(null)
    updatePayloadText((currentPayloadText) =>
      deleteNumericDateClaim(currentPayloadText, "exp")
    )
  }

  async function handleSign() {
    setIsSigning(true)
    setError("")
    setResult(null)

    try {
      const signingNowSeconds = getCurrentUnixSeconds()
      const iatPayloadText = useCurrentIat
        ? createCurrentIatPayload(payloadText, signingNowSeconds)
        : payloadText
      const signingPayloadText =
        relativeExpOffset === null
          ? iatPayloadText
          : (setNumericDateClaim(
              iatPayloadText,
              "exp",
              resolveRelativeExpiration({
                iatValue: getNumericDateClaim(iatPayloadText, "iat"),
                nowSeconds: signingNowSeconds,
                offsetSeconds: relativeExpOffset,
                useCurrentIat,
              })
            ) ?? iatPayloadText)

      if (signingPayloadText !== payloadText) {
        setPayloadText(signingPayloadText)
      }

      const nextResult = await signJwt({
        payloadText: signingPayloadText,
        headerText,
        algorithm,
        key,
        keyFormat,
      })
      setResult(nextResult)
    } catch (caughtError) {
      setError(formatSignerError(messages, caughtError))
    } finally {
      setIsSigning(false)
    }
  }

  function updatePayloadText(
    createNextPayloadText: (currentPayloadText: string) => string | null
  ) {
    setPayloadText((currentPayloadText) => {
      const nextPayloadText = createNextPayloadText(currentPayloadText)
      return nextPayloadText ?? currentPayloadText
    })
  }

  return {
    payloadText,
    headerText,
    algorithm,
    keyFormat,
    key,
    useCurrentIat,
    result,
    error,
    isSigning,
    downloadUrl,
    payloadError,
    headerError,
    canSign,
    iatValue,
    iatSigningValue,
    expValue,
    expSigningValue,
    expInputValue,
    relativeExpOffset,
    setPayloadText: handlePayloadTextChange,
    setHeaderText,
    setKeyFormat,
    setKey,
    handleAlgorithmChange,
    handleLoadSample,
    handleReset,
    handleUseCurrentIatChange,
    handleExpirationInputChange,
    handleExpirationOffsetClick,
    handleClearExpiration,
    handleSign,
  }
}

export { useJwtSignerState }
