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

import {
  contractAddress,
  readTokenUri,
  tokenNumber,
  type TokenUri,
} from "./core/ethereum"
import { readTokenMetadata, type MetadataProblem } from "./core/metadata"
import type EnglishMessages from "./messages/en.json"
import ViewerResult, { type Result } from "./result"

type Stage = "readingContract" | "readingMetadata"
type Problem = "rpcFailed" | "missingUri" | MetadataProblem
type Inputs = { address: string; tokenId: string }
type Errors = Partial<Record<keyof Inputs, "invalidAddress" | "invalidTokenId">>

const example: Inputs = {
  address: "0xbd3531da5cf5857e7cfaa92426877b022e612cf8",
  tokenId: "1",
}
const fields = ["address", "tokenId"] as const

export default function NftMetadataViewer({
  messages,
}: {
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const [inputs, setInputs] = useState<Inputs>({ address: "", tokenId: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [problem, setProblem] = useState<Problem | null>(null)
  const [stage, setStage] = useState<Stage | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setStage(null)
  }

  function edit(next: Inputs) {
    cancel()
    setInputs(next)
    setErrors({})
    setProblem(null)
    setResult(null)
  }

  async function lookup(values: Inputs) {
    edit(values)
    const address = contractAddress(values.address)
    const number = tokenNumber(values.tokenId)
    setErrors({
      address: address ? undefined : "invalidAddress",
      tokenId: number === null ? "invalidTokenId" : undefined,
    })
    if (!address || number === null) return

    const controller = new AbortController()
    const { signal } = controller
    active.current = controller
    setStage("readingContract")
    let reference: TokenUri | null = null
    try {
      reference = await readTokenUri(address, number, signal)
      signal.throwIfAborted()
      if (!reference) {
        setProblem("missingUri")
        return
      }
      setStage("readingMetadata")
      setResult({ reference })
      const response = await readTokenMetadata(reference, number, signal)
      signal.throwIfAborted()
      setResult({ reference, ...response })
    } catch {
      if (!signal.aborted)
        setProblem(reference ? "metadataFailed" : "rpcFailed")
    } finally {
      if (active.current === controller) cancel()
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent className="gap-3">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              void lookup(inputs)
            }}
          >
            <dl className="flex flex-wrap gap-2 text-sm">
              <dt className="text-muted-foreground">{messages.network}</dt>
              <dd className="font-medium">Ethereum</dd>
            </dl>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              {fields.map((field) => {
                const fieldId = `${id}-${field}`
                const error = errors[field]
                return (
                  <Field
                    key={field}
                    data-invalid={Boolean(error)}
                    className="min-w-0"
                  >
                    <FieldLabel htmlFor={fieldId}>{messages[field]}</FieldLabel>
                    <Input
                      id={fieldId}
                      dir="ltr"
                      spellCheck={false}
                      autoComplete="off"
                      autoCapitalize="off"
                      className="font-mono"
                      placeholder={field === "address" ? "0x…" : "1"}
                      value={inputs[field]}
                      onChange={(event) =>
                        edit({ ...inputs, [field]: event.target.value })
                      }
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${fieldId}-error` : undefined}
                    />
                    {error && (
                      <FieldError id={`${fieldId}-error`}>
                        {messages[error]}
                      </FieldError>
                    )}
                  </Field>
                )
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={stage !== null}>
                <Search data-icon="inline-start" aria-hidden="true" />
                {messages.lookup}
              </Button>
              {stage ? (
                <Button type="button" variant="ghost" onClick={cancel}>
                  {messages.cancel}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => void lookup(example)}
                >
                  {messages.example}
                </Button>
              )}
            </div>
          </form>
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground empty:hidden"
          >
            {stage ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 shrink-0 animate-spin"
                />
                {messages[stage]}
              </>
            ) : (
              result?.metadata && (
                <span className="sr-only">{messages.result}</span>
              )
            )}
          </p>
          {problem && (
            <p role="alert" className="text-sm text-destructive">
              {messages[problem]}
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      {result && <ViewerResult result={result} messages={messages} />}
    </div>
  )
}
