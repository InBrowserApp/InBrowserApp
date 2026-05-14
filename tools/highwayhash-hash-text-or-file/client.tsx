import {
  useDeferredValue,
  useEffect,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from "react"

import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LoaderCircle, TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_KEY_INPUT,
  DEFAULT_OUTPUT_SIZE,
  DEFAULT_TEXT,
  STORAGE_KEYS,
} from "./client/constants"
import type {
  HighwayHashDigestState,
  HighwayHashTextOrFilePageMessages,
} from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { HashOutputList } from "./components/hash-output-list"
import { InputCard, formatFileSize } from "./components/input-card"
import {
  hashHighwayHash,
  parseHighwayHashKey,
  parseHighwayHashOutputSize,
  type HighwayHashOutputSize,
} from "./core/highwayhash"

type HighwayHashTextOrFileClientProps = Readonly<{
  messages: HighwayHashTextOrFilePageMessages
}>

function HighwayHashTextOrFileClient({
  messages,
}: HighwayHashTextOrFileClientProps) {
  const keyInputId = useId()
  const keyDescriptionId = useId()
  const plainTextId = useId()

  const [keyInput, setKeyInput] = useState(DEFAULT_KEY_INPUT)
  const [outputSize, setOutputSize] =
    useState<HighwayHashOutputSize>(DEFAULT_OUTPUT_SIZE)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<HighwayHashDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)
  const keyState = useMemo(() => parseHighwayHashKey(keyInput), [keyInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedKey = window.localStorage.getItem(STORAGE_KEYS.key)
    const storedOutputSize = parseHighwayHashOutputSize(
      window.localStorage.getItem(STORAGE_KEYS.outputSize)
    )
    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedKey !== null) {
      setKeyInput(storedKey)
    }

    if (storedOutputSize !== undefined) {
      setOutputSize(storedOutputSize)
    }

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.key, keyInput)
  }, [keyInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.outputSize, String(outputSize))
  }, [outputSize])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false

    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source) {
      setDigestState({ status: "idle" })
      return
    }

    if (keyState.status === "invalid") {
      setDigestState({ status: "error", message: messages.keyInvalidLabel })
      return
    }

    setDigestState({ status: "loading" })

    void hashHighwayHash(source, {
      outputSize,
      key: keyState.key,
    })
      .then((digest) => {
        if (!cancelled) {
          setDigestState({ status: "ready", digest })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDigestState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : selectedFile
                  ? messages.fileHashErrorLabel
                  : messages.textHashErrorLabel,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, keyState, messages, outputSize, selectedFile])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        keyInputId={keyInputId}
        keyDescriptionId={keyDescriptionId}
        keyInput={keyInput}
        keyState={keyState}
        messages={messages}
        outputSize={outputSize}
        onKeyInputChange={setKeyInput}
        onOutputSizeChange={setOutputSize}
      />

      <InputCard
        plainTextId={plainTextId}
        plainText={plainText}
        selectedFile={selectedFile}
        messages={messages}
        onPlainTextChange={setPlainText}
        onFileChange={handleFileChange}
        onSwitchToText={() => {
          setSelectedFile(null)
        }}
      />

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.hashResultLabel}</CardTitle>
            <CardDescription>
              {selectedFile
                ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
                : messages.hashResultDescription}
            </CardDescription>
          </div>
          {digestState.status === "loading" ? (
            <CardAction>
              <LoaderCircle
                className="size-4 animate-spin text-muted-foreground"
                aria-hidden="true"
              />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <DigestSection state={digestState} messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}

function DigestSection({
  state,
  messages,
}: Readonly<{
  state: HighwayHashDigestState
  messages: HighwayHashTextOrFilePageMessages
}>) {
  if (state.status === "idle") {
    return (
      <div
        className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        {messages.emptyStateDescription}
      </div>
    )
  }

  return (
    <section className="grid gap-4" aria-live="polite">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "loading" || state.status === "ready" ? (
        <HashOutputList
          messages={messages}
          digest={state.status === "ready" ? state.digest : null}
          loading={state.status === "loading"}
        />
      ) : null}
    </section>
  )
}

export default HighwayHashTextOrFileClient
