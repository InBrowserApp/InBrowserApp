import { useEffect, useId, useRef, useState } from "react"

import { gatewayStore, parseIpfsAddress } from "@workspace/ipfs-files/gateway"
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
import { ArrowLeftRight, LoaderCircle, Search } from "@workspace/ui/icons"

import {
  compareFolders,
  FolderInputError,
  type FolderDiff,
  type Side,
} from "./core/folder-diff"
import type EnglishMessages from "./messages/en.json"
import FolderDiffResults from "./results"

type Addresses = Record<Side, string>
type Errors = Partial<Record<Side, "invalid" | "notFolder" | "unavailable">>

const sides = ["before", "after"] as const
const example = {
  before: "ipfs://bafybeicgmdpvw4duutrmdxl4a7gc52sxyuk7nz5gby77afwdteh3jc5bqa",
  after: "ipfs://bafybeicn7i3soqdgr7dwnrwytgq4zxy7a5jpkizrvhm5mv6bgjd32wm3q4",
}

export default function FolderDiffTool({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const [addresses, setAddresses] = useState<Addresses>({
    before: "",
    after: "",
  })
  const [errors, setErrors] = useState<Errors>({})
  const [progress, setProgress] = useState<string | null>(null)
  const [result, setResult] = useState<FolderDiff | null>(null)
  const busy = progress !== null

  useEffect(() => () => active.current?.abort(), [])

  function cancel() {
    active.current?.abort()
    active.current = null
    setProgress(null)
  }

  function edit(next: Addresses) {
    cancel()
    setAddresses(next)
    setErrors({})
    setResult(null)
  }

  async function compare(inputs: Addresses) {
    cancel()
    setResult(null)
    const before = parseIpfsAddress(inputs.before)
    const after = parseIpfsAddress(inputs.after)
    setErrors({
      before: before ? undefined : "invalid",
      after: after ? undefined : "invalid",
    })
    if (!before || !after) return

    const controller = new AbortController()
    const { signal } = controller
    active.current = controller
    setProgress("")
    try {
      const diff = await compareFolders(before, after, {
        store: gatewayStore(),
        signal,
        onPath: (path) => {
          if (!signal.aborted) setProgress(path)
        },
      })
      signal.throwIfAborted()
      setResult(diff)
    } catch (error) {
      if (!signal.aborted) {
        setErrors(
          error instanceof FolderInputError
            ? { [error.side]: error.messageKey }
            : { before: "unavailable" }
        )
      }
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
              void compare(addresses)
            }}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {sides.map((side) => {
                const inputId = `${id}-${side}`
                const error = errors[side]
                return (
                  <Field
                    key={side}
                    data-invalid={Boolean(error)}
                    className="min-w-0"
                  >
                    <FieldLabel htmlFor={inputId}>{messages[side]}</FieldLabel>
                    <Input
                      id={inputId}
                      dir="ltr"
                      autoComplete="off"
                      spellCheck={false}
                      autoCapitalize="off"
                      placeholder="ipfs://bafy…"
                      className="font-mono"
                      value={addresses[side]}
                      onChange={(event) =>
                        edit({ ...addresses, [side]: event.target.value })
                      }
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? `${inputId}-error` : undefined}
                    />
                    {error && (
                      <FieldError id={`${inputId}-error`}>
                        {messages[error]}
                      </FieldError>
                    )}
                  </Field>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" disabled={busy}>
                <Search data-icon="inline-start" aria-hidden="true" />
                {messages.compare}
              </Button>
              {busy ? (
                <Button type="button" variant="ghost" onClick={cancel}>
                  {messages.cancel}
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!addresses.before && !addresses.after}
                    onClick={() =>
                      edit({ before: addresses.after, after: addresses.before })
                    }
                  >
                    <ArrowLeftRight
                      data-icon="inline-start"
                      aria-hidden="true"
                    />
                    {messages.swap}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAddresses(example)
                      void compare(example)
                    }}
                  >
                    {messages.example}
                  </Button>
                </>
              )}
            </div>
          </form>
          <p
            role="status"
            className="flex items-center gap-2 text-sm text-muted-foreground empty:hidden"
          >
            {busy && (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 shrink-0 animate-spin"
                />
                {messages.comparing}
              </>
            )}
          </p>
          {progress && (
            <p className="text-xs wrap-anywhere text-muted-foreground">
              <bdi>{progress}</bdi>
            </p>
          )}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <p role="status" className="sr-only">
        {result && result.changes.length > 0 ? messages.results : ""}
      </p>
      {result && (
        <FolderDiffResults
          result={result}
          language={language}
          messages={messages}
        />
      )}
    </div>
  )
}
