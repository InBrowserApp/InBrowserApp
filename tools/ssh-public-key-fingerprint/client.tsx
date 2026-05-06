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

import { DEFAULT_INPUT, STORAGE_KEYS } from "./client/constants"
import type {
  FingerprintParseState,
  SshPublicKeyFingerprintPageMessages,
} from "./client/types"
import { FingerprintResults } from "./components/fingerprint-results"
import { parseSshPublicKeys } from "./core/parse"

type SshPublicKeyFingerprintClientProps = Readonly<{
  messages: SshPublicKeyFingerprintPageMessages
}>

function SshPublicKeyFingerprintClient({
  messages,
}: SshPublicKeyFingerprintClientProps) {
  const inputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [parseState, setParseState] = useState<FingerprintParseState>({
    status: "loading",
  })
  const deferredInput = useDeferredValue(input)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedInput = window.localStorage.getItem(STORAGE_KEYS.input)

    if (storedInput !== null) {
      setInput(storedInput)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.input, input)
  }, [input])

  useEffect(() => {
    let cancelled = false
    const trimmedInput = deferredInput.trim()

    if (!trimmedInput) {
      setParseState({ status: "idle" })
      return
    }

    setParseState({ status: "loading" })

    void parseSshPublicKeys(deferredInput)
      .then((entries) => {
        if (cancelled) {
          return
        }

        setParseState(
          entries.length > 0
            ? { status: "ready", entries }
            : { status: "error", message: messages.errorNoKeys }
        )
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setParseState({
            status: "error",
            message:
              error instanceof Error && error.message.includes("Web Crypto")
                ? messages.errorWebCryptoUnavailable
                : messages.errorNoKeys,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [deferredInput, messages.errorNoKeys, messages.errorWebCryptoUnavailable])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) {
      return
    }

    try {
      setInput(await file.text())
    } catch {
      setParseState({ status: "error", message: messages.errorReadFile })
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          <Field className="flex flex-1 flex-col">
            <FieldLabel htmlFor={inputId}>{messages.inputLabel}</FieldLabel>
            <Textarea
              id={inputId}
              aria-label={messages.inputLabel}
              dir="ltr"
              spellCheck={false}
              translate="no"
              value={input}
              placeholder={messages.inputPlaceholder}
              onChange={(event) => {
                setInput(event.target.value)
              }}
              className="[field-sizing:fixed] min-h-80 flex-1 resize-y text-left font-mono text-sm"
            />
            <FieldDescription>{messages.inputHint}</FieldDescription>
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
            accept=".pub,.txt,.key,authorized_keys"
            className="sr-only"
            aria-label={messages.importFromFileLabel}
            onChange={(event) => {
              void handleFileChange(event)
            }}
          />
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.resultsTitle}</CardTitle>
          <CardDescription>{messages.resultsDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          <FingerprintResults messages={messages} state={parseState} />
        </ToolPanelCardContent>
      </ToolPanelCard>
    </div>
  )
}

export default SshPublicKeyFingerprintClient
