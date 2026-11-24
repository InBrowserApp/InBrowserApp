import { useEffect, useId, useRef, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { LoaderCircle, Search } from "@workspace/ui/icons"

import {
  checkDnslink,
  dnslinkName,
  parseTarget,
  targetKey,
  type ResolverResult,
} from "./core/dnslink"
import type EnglishMessages from "./messages/en.json"

export default function DnsLink({
  messages,
}: {
  messages: typeof EnglishMessages
}) {
  const id = useId()
  const active = useRef<AbortController | null>(null)
  const [domain, setDomain] = useState("")
  const [target, setTarget] = useState("")
  const [showDomainError, setShowDomainError] = useState(false)
  const [showTargetError, setShowTargetError] = useState(false)
  const [results, setResults] = useState<ResolverResult[]>([])
  const [checking, setChecking] = useState(false)

  const name = dnslinkName(domain)
  const path = parseTarget(target)
  const invalidDomain = showDomainError && !name
  const invalidTarget = showTargetError && Boolean(target.trim()) && !path
  const expected = path ? targetKey(path) : null

  useEffect(() => () => active.current?.abort(), [])

  function changeDomain(value: string) {
    active.current?.abort()
    setChecking(false)
    setResults([])
    setDomain(value)
    setShowDomainError(false)
  }

  async function check(nextName: string | null) {
    setShowDomainError(!nextName)
    setShowTargetError(true)
    if (!nextName) return
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setChecking(true)
    setResults([])
    const results = await checkDnslink(
      nextName,
      AbortSignal.any([controller.signal, AbortSignal.timeout(12000)])
    )
    if (!controller.signal.aborted) {
      setResults(results)
      setChecking(false)
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="grid min-w-0 gap-4 lg:grid-cols-2">
        <ToolPanelCard>
          <ToolPanelCardContent>
            <form
              className="grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                void check(name)
              }}
            >
              <Field data-invalid={invalidDomain}>
                <FieldLabel htmlFor={`${id}-domain`}>
                  {messages.domain}
                </FieldLabel>
                <Input
                  id={`${id}-domain`}
                  dir="ltr"
                  value={domain}
                  placeholder="www.example.com"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => changeDomain(event.target.value)}
                  aria-invalid={invalidDomain}
                  aria-describedby={
                    invalidDomain ? `${id}-domain-error` : undefined
                  }
                />
                {invalidDomain && (
                  <FieldError id={`${id}-domain-error`}>
                    {messages.invalidDomain}
                  </FieldError>
                )}
              </Field>
              <Field data-invalid={invalidTarget}>
                <FieldLabel htmlFor={`${id}-target`}>
                  {messages.target}
                </FieldLabel>
                <Input
                  id={`${id}-target`}
                  dir="ltr"
                  value={target}
                  placeholder="bafy… / ipns://example.com"
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => setTarget(event.target.value)}
                  onBlur={() => setShowTargetError(true)}
                  aria-invalid={invalidTarget}
                  aria-describedby={
                    invalidTarget ? `${id}-target-error` : undefined
                  }
                />
                {invalidTarget && (
                  <FieldError id={`${id}-target-error`}>
                    {messages.invalidTarget}
                  </FieldError>
                )}
              </Field>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" disabled={checking}>
                  {checking ? (
                    <LoaderCircle
                      className="animate-spin"
                      data-icon="inline-start"
                      aria-hidden="true"
                    />
                  ) : (
                    <Search data-icon="inline-start" aria-hidden="true" />
                  )}
                  {checking ? messages.checking : messages.check}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    changeDomain("docs.ipfs.tech")
                    setTarget("")
                    void check("_dnslink.docs.ipfs.tech")
                  }}
                >
                  {messages.example}
                </Button>
              </div>
            </form>
          </ToolPanelCardContent>
        </ToolPanelCard>
        <ToolPanelCard>
          <CardHeader>
            <CardTitle>{messages.record}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent className="gap-3">
            <RecordValue
              label={messages.name}
              value={name}
              messages={messages}
            />
            <RecordValue
              label={messages.value}
              value={path ? `dnslink=${path}` : null}
              messages={messages}
            />
          </ToolPanelCardContent>
        </ToolPanelCard>
      </div>
      {results.length > 0 && (
        <ToolPanelCard>
          <CardHeader>
            <CardTitle>{messages.published}</CardTitle>
          </CardHeader>
          <ToolPanelCardContent className="grid gap-3 md:grid-cols-2">
            {results.map(({ resolver, records, unavailable }) => (
              <section
                key={resolver}
                className="grid content-start gap-2 rounded-lg border p-3"
              >
                <h2 className="text-sm font-medium">{resolver}</h2>
                {unavailable && (
                  <p className="text-sm text-muted-foreground">
                    {messages.unavailable}
                  </p>
                )}
                {!unavailable && records.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {messages.missing}
                  </p>
                )}
                {records.map(({ target, normalized, ttl }, index) => (
                  <div className="grid gap-1" key={`${target}-${index}`}>
                    <code
                      dir="ltr"
                      className="rounded-md bg-muted p-2 text-xs wrap-anywhere"
                    >
                      {target}
                    </code>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        {messages.ttl} · {ttl.toLocaleString()}
                      </span>
                      {!normalized ? (
                        <span>{messages.malformed}</span>
                      ) : (
                        expected && (
                          <span className="font-medium text-foreground">
                            {targetKey(normalized) === expected
                              ? messages.match
                              : messages.different}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </ToolPanelCardContent>
        </ToolPanelCard>
      )}
    </div>
  )
}

function RecordValue({
  label,
  value,
  messages,
}: {
  label: string
  value: string | null
  messages: typeof EnglishMessages
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        {value && (
          <ToolCopyButton
            value={value}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            ariaLabel={`${messages.copy}: ${label}`}
          />
        )}
      </div>
      <code dir="ltr" className="rounded-md bg-muted p-2 text-xs wrap-anywhere">
        {value ?? "—"}
      </code>
    </div>
  )
}
