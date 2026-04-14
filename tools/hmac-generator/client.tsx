import {
  useDeferredValue,
  useEffect,
  useId,
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
  DEFAULT_ALGORITHM,
  DEFAULT_SECRET_KEY,
  DEFAULT_TEXT,
  HMAC_ALGORITHM_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import type { HmacGeneratorPageMessages } from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { HmacOutputList } from "./components/hmac-output-list"
import { InputCard, formatFileSize } from "./components/input-card"
import { generateHmac, type HmacAlgorithm, type HmacDigest } from "./core/hmac"

type HmacDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: HmacDigest }
  | { status: "error"; message: string }

type HmacGeneratorClientProps = Readonly<{
  messages: HmacGeneratorPageMessages
}>

function HmacGeneratorClient({ messages }: HmacGeneratorClientProps) {
  const plainTextId = useId()
  const secretKeyId = useId()

  const [secretKey, setSecretKey] = useState(DEFAULT_SECRET_KEY)
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>(DEFAULT_ALGORITHM)
  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<HmacDigestState>({
    status: "loading",
  })

  const deferredSecretKey = useDeferredValue(secretKey)
  const deferredPlainText = useDeferredValue(plainText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSecretKey = window.localStorage.getItem(STORAGE_KEYS.secretKey)
    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedSecretKey !== null) {
      setSecretKey(storedSecretKey)
    }

    if (storedAlgorithm !== null) {
      const nextAlgorithm = HMAC_ALGORITHM_OPTIONS.find(
        (option) => option.value === storedAlgorithm
      )?.value

      if (nextAlgorithm) {
        setAlgorithm(nextAlgorithm)
      }
    }

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.secretKey, secretKey)
  }, [secretKey])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.algorithm, algorithm)
  }, [algorithm])

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

    if (!deferredSecretKey || !source) {
      setDigestState({ status: "idle" })
      return
    }

    setDigestState({ status: "loading" })

    void generateHmac(source, deferredSecretKey, algorithm)
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
                  ? "Failed to generate HMAC output for the file."
                  : "Failed to generate HMAC output for the text input.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [algorithm, deferredPlainText, deferredSecretKey, selectedFile])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
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
        secretKeyId={secretKeyId}
        secretKey={secretKey}
        algorithm={algorithm}
        messages={messages}
        onSecretKeyChange={setSecretKey}
        onAlgorithmChange={setAlgorithm}
      />

      <InputCard
        plainTextId={plainTextId}
        plainText={plainText}
        selectedFile={selectedFile}
        messages={messages}
        onPlainTextChange={setPlainText}
        onFileChange={(event) => {
          void handleFileChange(event)
        }}
        onSwitchToText={() => {
          setSelectedFile(null)
        }}
      />

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.hmacOutputLabel}</CardTitle>
            <CardDescription>
              {selectedFile
                ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
                : messages.hmacOutputDescription}
            </CardDescription>
          </div>
          {digestState.status === "loading" ? (
            <CardAction>
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
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
  state: HmacDigestState
  messages: HmacGeneratorPageMessages
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
          <TriangleAlert />
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      {state.status === "loading" || state.status === "ready" ? (
        <HmacOutputList
          messages={messages}
          digest={state.status === "ready" ? state.digest : null}
          loading={state.status === "loading"}
        />
      ) : null}
    </section>
  )
}

export default HmacGeneratorClient
