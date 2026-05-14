import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText, RefreshCcw, Trash2 } from "@workspace/ui/icons"

import {
  ACCEPTED_CERTIFICATE_FORMATS,
  DEFAULT_INPUT,
  STORAGE_KEYS,
} from "./client/constants"
import type {
  CertificateParseState,
  CertificatePublicKeyParserMessages,
} from "./client/types"
import { ParserResults } from "./components/parser-results"
import { parseCertificateInput } from "./core/certificate-parser"

type CertificatePublicKeyParserClientProps = Readonly<{
  messages: CertificatePublicKeyParserMessages
}>

function CertificatePublicKeyParserClient({
  messages,
}: CertificatePublicKeyParserClientProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [input, setInput] = useState<string | File>(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return DEFAULT_INPUT
    }

    return window.localStorage.getItem(STORAGE_KEYS.input) ?? DEFAULT_INPUT
  })
  const [parseState, setParseState] = useState<CertificateParseState>({
    status: "loading",
  })
  const deferredInput = useDeferredValue(input)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || typeof input !== "string") return

    window.localStorage.setItem(STORAGE_KEYS.input, input)
  }, [input])

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (typeof deferredInput === "string" && !deferredInput.trim()) {
        setParseState({ status: "idle" })
        return
      }

      setParseState({ status: "loading" })

      try {
        const result = await parseCertificateInput(
          deferredInput,
          createParserMessages(messages)
        )

        if (cancelled) {
          return
        }

        setParseState(
          result.entries.length > 0
            ? {
                status: "ready",
                entries: result.entries,
                warnings: result.warnings,
              }
            : { status: "idle" }
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        setParseState({
          status: "error",
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [deferredInput, messages])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    try {
      const preview = await file.slice(0, 2048).text()
      const isTextPem = preview.includes("-----BEGIN")
      const isBinaryLike = hasBinaryControlCharacter(preview)
      setInput(isTextPem || !isBinaryLike ? await file.text() : file)
    } catch {
      setParseState({ status: "error", message: messages.readFileError })
    }
  }

  const textInput = typeof input === "string" ? input : ""
  const inputHint =
    typeof input === "string"
      ? messages.inputHint
      : formatMessage(messages.selectedFileHint, { name: input.name })

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6">
      <ToolPanelCard className="min-w-0">
        <CardHeader className="border-b">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          <Field className="flex min-h-0 flex-1 flex-col">
            <FieldLabel htmlFor={inputId}>{messages.inputLabel}</FieldLabel>
            <Textarea
              id={inputId}
              aria-label={messages.inputLabel}
              dir="ltr"
              spellCheck={false}
              translate="no"
              value={textInput}
              placeholder={messages.inputPlaceholder}
              onChange={(event) => {
                setInput(event.target.value)
              }}
              className="[field-sizing:fixed] min-h-96 flex-1 resize-y text-left font-mono text-sm"
            />
            <FieldDescription>{inputHint}</FieldDescription>
          </Field>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="flex flex-wrap justify-end gap-3 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput(DEFAULT_INPUT)
            }}
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.useSampleLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setInput("")
            }}
          >
            <Trash2 data-icon="inline-start" />
            {messages.clearLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
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
            accept={ACCEPTED_CERTIFICATE_FORMATS}
            className="sr-only"
            aria-label={messages.importFromFileLabel}
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard className="min-w-0">
        <CardHeader className="border-b">
          <CardTitle>{messages.resultsTitle}</CardTitle>
          <CardDescription>{messages.resultsDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          <ParserResults messages={messages} state={parseState} />
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}

function createParserMessages(messages: CertificatePublicKeyParserMessages) {
  return {
    invalidInput: messages.invalidInput,
    invalidPem: messages.invalidPem,
    parseFailed: messages.parseFailed,
    notAvailable: messages.notAvailable,
    webCryptoUnavailable: messages.webCryptoUnavailable,
    unsupportedPemBlock: (label: string) =>
      formatMessage(messages.unsupportedPemBlock, { label }),
    certificateLabel: (index: number) =>
      formatMessage(messages.certificateLabel, { index: String(index) }),
    publicKeyLabel: (index: number) =>
      formatMessage(messages.publicKeyLabel, { index: String(index) }),
  }
}

function formatMessage(
  template: string,
  replacements: Readonly<Record<string, string>>
) {
  return Object.entries(replacements).reduce(
    (message, [key, value]) => message.replace(`{${key}}`, value),
    template
  )
}

function hasBinaryControlCharacter(value: string) {
  for (const character of value) {
    const code = character.charCodeAt(0)

    if ((code >= 0 && code <= 8) || (code >= 14 && code <= 31)) {
      return true
    }
  }

  return false
}

export default CertificatePublicKeyParserClient
