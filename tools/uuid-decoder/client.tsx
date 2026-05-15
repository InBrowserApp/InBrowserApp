import { useEffect, useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Binary, Clock3, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import {
  CanonicalCopyFooter,
  DecodeSuccessPanel,
} from "./components/result-sections"
import { createTimeUuid, decodeUuid } from "./core/uuid"

type UuidDecoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  uuidLabel: string
  uuidPlaceholder: string
  inputDescription: string
  decodeResult: string
  emptyTitle: string
  emptyDescription: string
  validTitle: string
  invalidTitle: string
  invalidDescription: string
  normalizedUuid: string
  version: string
  variant: string
  format: string
  canonical: string
  hex: string
  base64: string
  decimal: string
  octal: string
  binary: string
  timeDetails: string
  unixMilliseconds: string
  utcTime: string
  clockSequence: string
  nodeIdentifier: string
  nodeSourceMac: string
  nodeSourceRandom: string
  algorithm: string
  copyLabel: string
  copiedLabel: string
  resetLabel: string
  useCurrentTimeLabel: string
  versionLabels: Record<string, string>
  variantLabels: Record<string, string>
  algorithmLabels: Record<string, string>
}>

type UuidDecoderClientProps = Readonly<{
  messages: UuidDecoderMessages
  createCurrentTimeUuid?: () => string
}>

const DEFAULT_UUID = "550e8400-e29b-41d4-a716-446655440000"
const STORAGE_KEY = "tools:uuid-decoder:uuid"

function getCurrentTimeUuid() {
  const randomBytes = new Uint8Array(8)
  globalThis.crypto.getRandomValues(randomBytes)
  return createTimeUuid(new Date(), randomBytes)
}

function UuidDecoderClient({
  messages,
  createCurrentTimeUuid = getCurrentTimeUuid,
}: UuidDecoderClientProps) {
  const inputId = useId()
  const [uuid, setUuid] = useState(DEFAULT_UUID)
  const result = useMemo(() => decodeUuid(uuid), [uuid])
  const hasInput = uuid.trim().length > 0

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue !== null) {
      setUuid(storedValue)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, uuid)
  }, [uuid])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card className="xl:sticky xl:top-6 xl:self-start">
        <CardHeader className="border-b">
          <CardTitle>{messages.uuidLabel}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field data-invalid={hasInput && !result.ok}>
            <FieldContent>
              <FieldLabel htmlFor={inputId}>{messages.uuidLabel}</FieldLabel>
              <Input
                id={inputId}
                name="uuid"
                autoComplete="off"
                spellCheck={false}
                value={uuid}
                aria-invalid={hasInput && !result.ok}
                placeholder={messages.uuidPlaceholder}
                className="h-11 font-mono text-sm"
                onChange={(event) => {
                  setUuid(event.target.value)
                }}
              />
              <FieldDescription>{messages.inputDescription}</FieldDescription>
            </FieldContent>
          </Field>

          {hasInput && !result.ok ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidTitle}</AlertTitle>
                <AlertDescription>
                  {messages.invalidDescription}
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-3 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setUuid(DEFAULT_UUID)
            }}
          >
            <RefreshCcw data-icon="inline-start" />
            {messages.resetLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setUuid(createCurrentTimeUuid())
            }}
          >
            <Clock3 data-icon="inline-start" />
            {messages.useCurrentTimeLabel}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.decodeResult}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {!hasInput ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Binary />
                </EmptyMedia>
                <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
                <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : result.ok ? (
            <DecodeSuccessPanel result={result} messages={messages} />
          ) : null}
        </CardContent>
        {result.ok ? (
          <CardFooter className="justify-end border-t">
            <CanonicalCopyFooter result={result} messages={messages} />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

export default UuidDecoderClient
