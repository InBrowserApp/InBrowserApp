import { startTransition, useEffect, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Lock, RefreshCcw, TriangleAlert } from "@workspace/ui/icons"

import { generateUuidV4 } from "./core/uuid-v4"

import type { UuidV4Messages } from "./types"

type UuidState = Readonly<{
  uuid: string
  error: string | null
}>

type UuidV4GeneratorClientProps = Readonly<{
  messages: UuidV4Messages
}>

const INITIAL_UUID_STATE: UuidState = {
  uuid: "",
  error: null,
}

function createUuidState(errorMessage: string): UuidState {
  try {
    return {
      uuid: generateUuidV4(),
      error: null,
    }
  } catch {
    return {
      uuid: "",
      error: errorMessage,
    }
  }
}

function UuidV4GeneratorClient({ messages }: UuidV4GeneratorClientProps) {
  const [state, setState] = useState(INITIAL_UUID_STATE)

  useEffect(() => {
    setState(createUuidState(messages.cryptoUnavailableMessage))
  }, [messages.cryptoUnavailableMessage])

  const regenerate = () => {
    startTransition(() => {
      setState(createUuidState(messages.cryptoUnavailableMessage))
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
          {state.error ? (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>{messages.errorTitle}</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <Field>
            <FieldLabel htmlFor="uuid-v4-output">
              {messages.uuidLabel}
            </FieldLabel>
            <output
              id="uuid-v4-output"
              aria-busy={state.uuid.length === 0 && !state.error}
              aria-live="polite"
              className="block min-h-12 rounded-md border bg-background px-3 py-3 font-mono text-sm leading-6 tracking-normal break-all text-foreground tabular-nums [unicode-bidi:isolate]"
              dir="ltr"
              translate="no"
            >
              {state.uuid}
            </output>
          </Field>
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="justify-between gap-3 border-t">
          <ToolCopyButton
            value={state.uuid}
            copyLabel={messages.copyLabel}
            copiedLabel={messages.copiedLabel}
            variant="ghost"
            disabled={state.uuid.length === 0}
          />

          <Button type="button" variant="ghost" size="sm" onClick={regenerate}>
            <RefreshCcw data-icon="inline-start" />
            {messages.regenerateLabel}
          </Button>
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.detailsTitle}</CardTitle>
          <CardDescription>{messages.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">{messages.versionLabel}</dt>
              <dd>
                <Badge variant="secondary">{messages.versionValue}</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">{messages.variantLabel}</dt>
              <dd className="text-end font-medium">{messages.variantValue}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">{messages.entropyLabel}</dt>
              <dd className="text-end font-medium">{messages.entropyValue}</dd>
            </div>
          </dl>

          <Alert>
            <Lock />
            <AlertTitle>{messages.privacyTitle}</AlertTitle>
            <AlertDescription>{messages.privacyDescription}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}

export default UuidV4GeneratorClient
