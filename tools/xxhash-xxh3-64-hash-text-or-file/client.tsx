import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, LoaderCircle } from "@workspace/ui/icons"

import { DEFAULT_TEXT, STORAGE_KEYS } from "./client/constants"
import type { XxHashHashTextOrFilePageMessages } from "./client/types"
import {
  DigestSection,
  type XxHashDigestState,
} from "./components/digest-section"
import { SeedCard } from "./components/seed-card"
import { hashXxHash, parseXxHashSeed } from "./core/xxhash"

type XxHashHashTextOrFileClientProps = Readonly<{
  messages: XxHashHashTextOrFilePageMessages
}>

function XxHashHashTextOrFileClient({
  messages,
}: XxHashHashTextOrFileClientProps) {
  const plainTextId = useId()
  const seedInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [plainText, setPlainText] = useState(DEFAULT_TEXT)
  const [seedInput, setSeedInput] = useState("0")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [digestState, setDigestState] = useState<XxHashDigestState>({
    status: "loading",
  })

  const deferredPlainText = useDeferredValue(plainText)
  const seedState = parseXxHashSeed(seedInput)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEYS.text)

    if (storedText !== null) {
      setPlainText(storedText)
    }
  }, [])

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

    const parsedSeed = parseXxHashSeed(seedInput)

    if (!parsedSeed.isValid) {
      setDigestState({
        status: "error",
        message: messages.seedInvalid,
      })
      return
    }

    setDigestState({ status: "loading" })

    void hashXxHash(source, parsedSeed)
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
                  ? "Failed to hash file."
                  : "Failed to hash text.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredPlainText, messages.seedInvalid, seedInput, selectedFile])

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
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputLabel}</CardTitle>
          <CardDescription>
            {selectedFile
              ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
              : messages.plainTextDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          {selectedFile ? (
            <div className="flex min-h-64 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20 p-6 text-center">
              <FileText className="size-5 text-muted-foreground" />
              <div className="grid gap-1">
                <p className="text-sm font-medium break-all text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          ) : (
            <Field className="flex flex-1 flex-col">
              <FieldLabel htmlFor={plainTextId}>
                {messages.plainTextLabel}
              </FieldLabel>
              <Textarea
                id={plainTextId}
                aria-label={messages.plainTextLabel}
                spellCheck={false}
                value={plainText}
                onChange={(event) => {
                  setPlainText(event.target.value)
                }}
                className="min-h-64 flex-1 resize-y font-mono text-sm"
              />
            </Field>
          )}
        </CardContent>
        <CardFooter className="justify-start gap-3 border-t">
          {selectedFile ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedFile(null)
              }}
            >
              {messages.plainTextLabel}
            </Button>
          ) : null}

          <Button
            type="button"
            variant={selectedFile ? "outline" : "ghost"}
            size="sm"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <FileText data-icon="inline-start" />
            {messages.importFromFileLabel}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            aria-label={messages.importFromFileLabel}
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </CardFooter>
      </Card>

      <SeedCard
        inputId={seedInputId}
        messages={messages}
        seedInput={seedInput}
        invalid={!seedState.isValid}
        onSeedInputChange={setSeedInput}
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

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${formatNumber(size / 1024)} KB`
  }

  return `${formatNumber(size / (1024 * 1024))} MB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export default XxHashHashTextOrFileClient
