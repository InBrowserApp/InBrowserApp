import { useEffect, useId, useRef, useState } from "react"

import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { LoaderCircle, Search } from "@workspace/ui/icons"

import { lookupDeal, parseDealId, type Deal } from "./core/deal"
import type EnglishMessages from "./messages/en.json"
import DealDetails, { DealExplorerLink } from "./deal-details"

type Problem = "invalidId" | "failed" | "missing" | "historyFailed"
const example = "133464300"

export default function FilecoinDealLookup({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const inputId = useId()
  const active = useRef<AbortController | null>(null)
  const [input, setInput] = useState("")
  const [busy, setBusy] = useState(false)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [deal, setDeal] = useState<Deal | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  function stop() {
    active.current?.abort()
    active.current = null
    setBusy(false)
  }

  function edit(value: string) {
    stop()
    setInput(value)
    setProblem(null)
    setDeal(null)
  }

  async function run(value: string) {
    edit(value)
    const id = parseDealId(value)
    if (id === null) {
      setProblem("invalidId")
      return
    }
    const controller = new AbortController()
    active.current = controller
    setBusy(true)
    try {
      const result = await lookupDeal(
        id,
        AbortSignal.any([controller.signal, AbortSignal.timeout(15000)])
      )
      if (controller.signal.aborted) return
      if ("deal" in result) setDeal(result.deal)
      else setProblem(result.problem)
    } catch {
      if (!controller.signal.aborted) setProblem("failed")
    } finally {
      if (active.current === controller) stop()
    }
  }

  const invalid = problem === "invalidId"
  const failedDealId = problem && !invalid ? parseDealId(input) : null
  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              void run(input)
            }}
          >
            <Field data-invalid={invalid} className="max-w-lg">
              <FieldLabel htmlFor={inputId}>{messages.dealId}</FieldLabel>
              <Input
                id={inputId}
                dir="ltr"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                placeholder={example}
                className="font-mono"
                value={input}
                aria-invalid={invalid}
                aria-describedby={invalid ? `${inputId}-error` : undefined}
                onChange={(event) => edit(event.target.value)}
              />
              {invalid && (
                <FieldError id={`${inputId}-error`}>
                  {messages.invalidId}
                </FieldError>
              )}
            </Field>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                <Search data-icon="inline-start" aria-hidden="true" />
                {messages.lookup}
              </Button>
              {busy ? (
                <Button type="button" variant="ghost" onClick={stop}>
                  {messages.cancel}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void run(example)}
                >
                  {messages.sample}
                </Button>
              )}
            </div>
          </form>
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground empty:hidden"
          >
            {busy ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 shrink-0 animate-spin"
                />
                {messages.lookingUp}
              </>
            ) : (
              deal && (
                <span className="sr-only">
                  {messages.details} {messages[deal.status]}
                </span>
              )
            )}
          </p>
          {problem && failedDealId !== null && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p role="alert" className="text-sm text-muted-foreground">
                {messages[problem]}
              </p>
              <DealExplorerLink id={failedDealId} label={messages.explorer} />
            </div>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {deal && (
        <DealDetails deal={deal} language={language} messages={messages} />
      )}
    </div>
  )
}
