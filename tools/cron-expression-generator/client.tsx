import { startTransition, useEffect, useMemo, useState } from "react"

import { ToolPanelCard } from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { RefreshCcw } from "@workspace/ui/icons"

import { CronFieldCard } from "./components/cron-field-card"
import { CronOutputCard } from "./components/cron-output-card"
import { CronPresetsCard } from "./components/cron-presets-card"
import { NextRunsCard } from "./components/next-runs-card"
import {
  CRON_FIELD_NAMES,
  buildCronExpression,
  createDefaultCronFormState,
  generateNextRunTimes,
  normalizeCronFieldState,
  parseCronExpression,
  type CronFieldName,
  type CronFieldState,
  type CronFormState,
} from "./core/cron"

import type { CronExpressionGeneratorMessages } from "./types"

type CronExpressionGeneratorClientProps = Readonly<{
  language: string
  messages: CronExpressionGeneratorMessages
}>

const STORAGE_KEY = "tools:cron-expression-generator:expression"
const REFERENCE_REFRESH_INTERVAL_MS = 60_000

function CronExpressionGeneratorClient({
  language,
  messages,
}: CronExpressionGeneratorClientProps) {
  const [formState, setFormState] = useState<CronFormState>(() =>
    createDefaultCronFormState()
  )
  const [referenceMs, setReferenceMs] = useState(() => Date.now())
  const expression = buildCronExpression(formState)
  const runTimes = useMemo(
    () => generateNextRunTimes(formState, new Date(referenceMs), 5),
    [formState, referenceMs]
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedExpression = window.localStorage.getItem(STORAGE_KEY)

    if (storedExpression) {
      setFormState(parseCronExpression(storedExpression))
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, expression)
  }, [expression])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setReferenceMs(Date.now())
    }, REFERENCE_REFRESH_INTERVAL_MS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  function updateField(fieldName: CronFieldName, state: CronFieldState) {
    setReferenceMs(Date.now())
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: normalizeCronFieldState(fieldName, state),
    }))
  }

  function applyExpression(nextExpression: string) {
    startTransition(() => {
      setReferenceMs(Date.now())
      setFormState(parseCronExpression(nextExpression))
    })
  }

  function reset() {
    applyExpression("* * * * *")
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]">
        <div className="grid min-w-0 gap-6">
          <ToolPanelCard>
            <CronOutputCard
              expression={expression}
              messages={messages}
              state={formState}
            />
          </ToolPanelCard>

          <ToolPanelCard>
            <CronPresetsCard messages={messages} onSelect={applyExpression} />
          </ToolPanelCard>

          <section className="grid gap-4" aria-labelledby="cron-fields-title">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2
                  id="cron-fields-title"
                  className="font-heading text-xl font-medium tracking-tight"
                >
                  {messages.fields.title}
                </h2>
                <p className="max-w-3xl text-sm text-muted-foreground">
                  {messages.fields.description}
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={reset}>
                <RefreshCcw data-icon="inline-start" />
                {messages.actions.reset}
              </Button>
            </div>

            <div className="grid gap-4">
              {CRON_FIELD_NAMES.map((fieldName) => (
                <ToolPanelCard key={fieldName} size="sm">
                  <CronFieldCard
                    fieldName={fieldName}
                    messages={messages}
                    state={formState[fieldName]}
                    onChange={(state) => {
                      updateField(fieldName, state)
                    }}
                  />
                </ToolPanelCard>
              ))}
            </div>
          </section>
        </div>

        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <ToolPanelCard>
            <NextRunsCard
              language={language}
              messages={messages}
              referenceMs={referenceMs}
              runTimes={runTimes}
            />
          </ToolPanelCard>
        </div>
      </div>
    </div>
  )
}

export default CronExpressionGeneratorClient
