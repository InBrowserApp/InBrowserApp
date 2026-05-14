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
  DEFAULT_TEXT,
  STORAGE_KEYS,
} from "./client/constants"
import type { SipHash128HashTextOrFilePageMessages } from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { HashOutputList } from "./components/hash-output-list"
import { InputCard, formatFileSize } from "./components/input-card"
import {
  hashSipHash128,
  parseSipHashKey,
  type SipHashDigest,
} from "./core/siphash"

type SipHashDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: SipHashDigest }
  | { status: "error"; message: string }

type SipHash128HashTextOrFileClientProps = Readonly<{
  messages: SipHash128HashTextOrFilePageMessages
}>

function SipHash128HashTextOrFileClient({
  messages,
}: SipHash128HashTextOrFileClientProps) {
  const keyInputId = useId()
  const keyDescriptionId = useId()
  const plainTextId = useId()

  const [keyInput, setKeyInput] = useState(DEFAULT_KEY_INPUT)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<SipHashDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)
  const keyState = useMemo(() => parseSipHashKey(keyInput), [keyInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedKey = window.localStorage.getItem(STORAGE_KEYS.key)
    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedKey !== null) {
      setKeyInput(storedKey)
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

    window.localStorage.setItem(STORAGE_KEYS.text, plainText)
  }, [plainText])

  useEffect(() => {
    let cancelled = false

    const source = selectedFile
      ? selectedFile
      : deferredPlainText.length > 0
        ? new Blob([deferredPlainText])
        : null

    if (!source || keyState.status === "empty") {
      setDigestState({ status: "idle" })
      return
    }

    if (keyState.status === "invalid") {
      setDigestState({ status: "error", message: messages.keyInvalidLabel })
      return
    }

    setDigestState({ status: "loading" })

    void hashSipHash128(source, keyState.key)
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
  }, [deferredPlainText, keyState, messages, selectedFile])

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
        onKeyInputChange={setKeyInput}
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
                aria-hidden="true"
                className="size-4 animate-spin text-muted-foreground"
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
  state: SipHashDigestState
  messages: SipHash128HashTextOrFilePageMessages
}>) {
  if (state.status === "idle") {
    return (
      <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {messages.emptyStateDescription}
      </div>
    )
  }

  return (
    <section className="grid gap-4">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <TriangleAlert aria-hidden="true" />
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

export default SipHash128HashTextOrFileClient
