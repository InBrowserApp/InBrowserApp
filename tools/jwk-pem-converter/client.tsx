import {
  startTransition,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  jwkToPem,
  pemToJwk,
  type JwkPemError,
  type PemOutputType,
  type WarningEntry,
} from "./core/jwk-pem"
import {
  DEFAULT_JWK_INPUT,
  DEFAULT_PEM_INPUT,
  DEFAULT_MODE,
  STORAGE_KEYS,
} from "./client/constants"
import {
  formatErrorMessage,
  formatWarningMessages,
  getJwkParseState,
  normalizeJwkPemError,
} from "./client/helpers"
import { useDownloadUrl } from "./client/use-download-url"
import type { ConversionMode, JwkPemConverterMessages } from "./client/types"
import { JwkPanel } from "./components/jwk-panel"
import { MessageAlert } from "./components/message-alert"
import { ModeToggle } from "./components/mode-toggle"
import { OutputCard } from "./components/output-card"
import { PemPanel } from "./components/pem-panel"

function JwkPemConverterClient({
  messages,
}: {
  messages: JwkPemConverterMessages
}) {
  const jwkFileInputRef = useRef<HTMLInputElement | null>(null)
  const pemFileInputRef = useRef<HTMLInputElement | null>(null)
  const [mode, setMode] = useState<ConversionMode>(DEFAULT_MODE)
  const [jwkInput, setJwkInput] = useState(DEFAULT_JWK_INPUT)
  const [pemInput, setPemInput] = useState(DEFAULT_PEM_INPUT)
  const [selectedJwkIndex, setSelectedJwkIndex] = useState(0)
  const [outputType, setOutputType] = useState<PemOutputType>("private")
  const [prettyJson, setPrettyJson] = useState(true)
  const [jwkError, setJwkError] = useState<JwkPemError | null>(null)
  const [jwkOutput, setJwkOutput] = useState("")
  const [pemError, setPemError] = useState<JwkPemError | null>(null)
  const [pemOutput, setPemOutput] = useState("")
  const [pemWarnings, setPemWarnings] = useState<readonly WarningEntry[]>([])
  const deferredJwkInput = useDeferredValue(jwkInput)
  const deferredPemInput = useDeferredValue(pemInput)
  const jwkParseState = getJwkParseState(deferredJwkInput)
  const jwkDownloadUrl = useDownloadUrl(jwkOutput, "application/x-pem-file")
  const pemDownloadUrl = useDownloadUrl(pemOutput, "application/json")

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedMode = window.localStorage.getItem(STORAGE_KEYS.mode)
    const storedJwkInput = window.localStorage.getItem(STORAGE_KEYS.jwkInput)
    const storedPemInput = window.localStorage.getItem(STORAGE_KEYS.pemInput)
    const storedOutputType = window.localStorage.getItem(
      STORAGE_KEYS.outputType
    )
    const storedPrettyJson = window.localStorage.getItem(
      STORAGE_KEYS.prettyJson
    )

    if (storedMode === "jwk" || storedMode === "pem") setMode(storedMode)
    if (storedJwkInput !== null) setJwkInput(storedJwkInput)
    if (storedPemInput !== null) setPemInput(storedPemInput)
    if (storedOutputType === "public" || storedOutputType === "private") {
      setOutputType(storedOutputType)
    }
    if (storedPrettyJson === "true" || storedPrettyJson === "false") {
      setPrettyJson(storedPrettyJson === "true")
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.mode, mode)
  }, [mode])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.jwkInput, jwkInput)
  }, [jwkInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.pemInput, pemInput)
  }, [pemInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.outputType, outputType)
  }, [outputType])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.prettyJson, String(prettyJson))
  }, [prettyJson])

  useEffect(() => {
    if (jwkParseState.state !== "parsed") {
      setSelectedJwkIndex(0)
      return
    }

    if (selectedJwkIndex >= jwkParseState.keys.length) {
      setSelectedJwkIndex(0)
    }
  }, [jwkParseState, selectedJwkIndex])

  useEffect(() => {
    let cancelled = false

    async function run() {
      const nextParseState = getJwkParseState(deferredJwkInput)
      if (nextParseState.state !== "parsed") {
        setJwkError(
          nextParseState.state === "error" ? nextParseState.error : null
        )
        setJwkOutput("")
        return
      }

      const selectedKey =
        nextParseState.keys[selectedJwkIndex] ?? nextParseState.keys[0] ?? null

      if (!selectedKey) {
        setJwkError(null)
        setJwkOutput("")
        return
      }

      try {
        const pem = await jwkToPem(selectedKey, outputType)

        if (cancelled) return

        setJwkError(null)
        setJwkOutput(pem)
      } catch (error) {
        if (cancelled) return

        setJwkError(normalizeJwkPemError(error, "errorInvalidJwk"))
        setJwkOutput("")
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [deferredJwkInput, outputType, selectedJwkIndex])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (deferredPemInput.trim() === "") {
        setPemError(null)
        setPemWarnings([])
        setPemOutput("")
        return
      }

      try {
        const result = await pemToJwk(deferredPemInput)
        const output = JSON.stringify(
          result.jwk,
          null,
          prettyJson ? 2 : undefined
        )

        if (cancelled) return

        setPemError(null)
        setPemWarnings(result.warnings)
        setPemOutput(output)
      } catch (error) {
        if (cancelled) return

        setPemError(normalizeJwkPemError(error, "errorInvalidPem"))
        setPemWarnings([])
        setPemOutput("")
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [deferredPemInput, prettyJson])

  const activeError = mode === "jwk" ? jwkError : pemError
  const errorMessage = formatErrorMessage(messages, activeError)
  const warningMessages =
    mode === "pem" ? formatWarningMessages(messages, pemWarnings) : []
  const outputValue = mode === "jwk" ? jwkOutput : pemOutput
  const downloadName =
    mode === "jwk"
      ? outputType === "public"
        ? "public-key.pem"
        : "private-key.pem"
      : pemOutput.includes('"keys"')
        ? "jwks.json"
        : "key.jwk.json"
  const downloadUrl = mode === "jwk" ? jwkDownloadUrl : pemDownloadUrl

  return (
    <div className="grid gap-6">
      <ModeToggle mode={mode} messages={messages} setMode={setMode} />

      {mode === "jwk" ? (
        <JwkPanel
          error={jwkParseState.state === "error" || jwkError !== null}
          fileInputRef={jwkFileInputRef}
          input={jwkInput}
          messages={messages}
          outputType={outputType}
          parseState={jwkParseState}
          selectedJwkIndex={selectedJwkIndex}
          setInput={(value) => {
            startTransition(() => {
              setJwkInput(value)
            })
          }}
          setOutputType={setOutputType}
          setSelectedJwkIndex={setSelectedJwkIndex}
          onFileChange={(event) => {
            void handleFileChange(event, setJwkInput)
          }}
        />
      ) : (
        <PemPanel
          error={pemError !== null}
          fileInputRef={pemFileInputRef}
          input={pemInput}
          messages={messages}
          prettyJson={prettyJson}
          setInput={(value) => {
            startTransition(() => {
              setPemInput(value)
            })
          }}
          setPrettyJson={setPrettyJson}
          onFileChange={(event) => {
            void handleFileChange(event, setPemInput)
          }}
        />
      )}

      <MessageAlert
        title={messages.conversionErrorTitle}
        messages={errorMessage ? [errorMessage] : []}
        variant="destructive"
      />
      <MessageAlert title={messages.warningsTitle} messages={warningMessages} />

      <OutputCard
        copiedLabel={messages.copiedLabel}
        copyLabel={messages.copyResultLabel}
        downloadLabel={messages.downloadButton}
        downloadName={downloadName}
        downloadUrl={downloadUrl}
        title={messages.outputTitle}
        value={outputValue}
      />
    </div>
  )
}

async function handleFileChange(
  event: ChangeEvent<HTMLInputElement>,
  setter: (value: string) => void
) {
  const file = event.target.files?.[0]
  event.target.value = ""

  if (!file) {
    return
  }

  const nextText = await file.text()

  startTransition(() => {
    setter(nextText)
  })
}

export default JwkPemConverterClient
