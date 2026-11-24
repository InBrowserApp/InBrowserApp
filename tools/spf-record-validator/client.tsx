import { useId, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Check, TriangleAlert } from "@workspace/ui/icons"

import { readSpf } from "./core/spf"
import type english from "./messages/en.json"

export type Messages = typeof english

const EXAMPLE = "v=spf1 ip4:192.0.2.0/24 include:_spf.example.com -all"

export default function Client({
  messages,
  language,
}: {
  messages: Messages
  language: string
}) {
  const id = useId()
  const [value, setValue] = useState("")
  const [result, setResult] = useState<ReturnType<typeof readSpf>>()
  const invalid = !!result?.errors.length

  return (
    <div className="grid min-w-0 gap-5">
      <Card>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setResult(readSpf(value))
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label htmlFor={id} className="text-sm font-medium">
                {messages.value}
              </label>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setValue(EXAMPLE)
                  setResult(readSpf(EXAMPLE))
                }}
              >
                {messages.example}
              </Button>
            </div>
            <Textarea
              id={id}
              dir="ltr"
              rows={4}
              className="font-mono"
              placeholder={EXAMPLE}
              value={value}
              spellCheck={false}
              autoCapitalize="none"
              onChange={(event) => {
                setValue(event.target.value)
                setResult(undefined)
              }}
            />
            <Button
              type="submit"
              className="justify-self-end"
              disabled={!value.trim()}
            >
              {messages.check}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div aria-live="polite" className="sr-only">
        {result && (invalid ? messages.invalid : messages.valid)}
      </div>
      {result && (
        <Card>
          <CardContent className="grid gap-4">
            <h2 className="flex items-center gap-2 font-semibold">
              {invalid ? (
                <TriangleAlert
                  aria-hidden="true"
                  className="size-4 text-destructive"
                />
              ) : (
                <Check aria-hidden="true" className="size-4" />
              )}
              {invalid ? messages.invalid : messages.valid}
            </h2>
            {invalid ? (
              <ul className="grid gap-2 text-sm">
                {result.errors.map(({ code, term }, index) => (
                  <li key={index} className="grid gap-1 rounded-md border p-3">
                    {term && (
                      <code className="font-mono wrap-anywhere" dir="ltr">
                        {term}
                      </code>
                    )}
                    <span>{messages[code]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="grid gap-1 rounded-md bg-muted/50 p-3 text-sm">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <bdi className="text-lg font-semibold tabular-nums">
                    {new Intl.NumberFormat(language).format(result.lookupCount)}
                  </bdi>
                  <span className="font-medium">{messages.lookupCount}</span>
                </div>
                <p className="text-muted-foreground">{messages.lookupHelp}</p>
              </div>
            )}
            {!invalid && result.warnings.length > 0 && (
              <ul className="grid gap-2 text-sm">
                {result.warnings.map((warning) => (
                  <li key={warning} className="flex items-start gap-2">
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    {messages[warning]}
                  </li>
                ))}
              </ul>
            )}
            {result.terms.length > 0 && (
              <section className="grid gap-2">
                <h3 className="text-sm font-medium">{messages.terms}</h3>
                <ol className="divide-y rounded-md border">
                  {result.terms.map(({ raw, kind, qualifier }, index) => (
                    <li
                      key={index}
                      className="grid gap-x-4 gap-y-1 p-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline"
                    >
                      <code className="font-mono wrap-anywhere" dir="ltr">
                        {raw}
                      </code>
                      <span className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
                        <span>{messages[kind]}</span>
                        {qualifier && (
                          <span>
                            {messages.qualifier}{" "}
                            <bdi className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground">
                              {qualifier}
                            </bdi>
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
