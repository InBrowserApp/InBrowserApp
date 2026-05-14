import { useEffect, useId, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Search } from "@workspace/ui/icons"

import {
  BUILTIN_DOH_SERVERS,
  lookupReverseIp,
  parseReverseIpInput,
} from "./core/reverse-ip"
import { ResultCard } from "./components/result-card"

import type { FormEvent } from "react"
import type { LookupState, ReverseIpLookupMessages } from "./types"

type ReverseIpLookupClientProps = Readonly<{
  messages: ReverseIpLookupMessages
}>

const IP_STORAGE_KEY = "tools:reverse-ip-lookup:ip"
const RESOLVER_STORAGE_KEY = "tools:reverse-ip-lookup:resolver"
const DEFAULT_IP = "1.1.1.1"
const DEFAULT_RESOLVER: string = BUILTIN_DOH_SERVERS[0]!.url

function ReverseIpLookupClient({ messages }: ReverseIpLookupClientProps) {
  const ipId = useId()
  const resolverId = useId()
  const [ipInput, setIpInput] = useState(DEFAULT_IP)
  const [resolverUrl, setResolverUrl] = useState(DEFAULT_RESOLVER)
  const [lookupState, setLookupState] = useState<LookupState>({
    status: "idle",
  })

  useEffect(() => {
    const storedIp = window.localStorage.getItem(IP_STORAGE_KEY)
    const storedResolver = window.localStorage.getItem(RESOLVER_STORAGE_KEY)

    if (storedIp !== null) {
      setIpInput(storedIp)
    }

    if (isKnownResolver(storedResolver)) {
      setResolverUrl(storedResolver)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(IP_STORAGE_KEY, ipInput)
  }, [ipInput])

  useEffect(() => {
    window.localStorage.setItem(RESOLVER_STORAGE_KEY, resolverUrl)
  }, [resolverUrl])

  const inputState = useMemo(() => parseReverseIpInput(ipInput), [ipInput])
  const isInvalid = inputState.status === "invalid"

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (inputState.status !== "valid") {
      setLookupState({ status: "idle" })
      return
    }

    setLookupState({ status: "loading" })

    try {
      setLookupState({
        status: "success",
        result: await lookupReverseIp(inputState.target.ip, resolverUrl),
      })
    } catch {
      setLookupState({ status: "error" })
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card className="gap-0 border-border/70 py-0 shadow-sm">
        <CardHeader className="border-b py-4">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <form className="flex flex-col gap-5" onSubmit={handleLookup}>
            <FieldGroup>
              <Field data-invalid={isInvalid || undefined}>
                <FieldContent>
                  <FieldLabel htmlFor={ipId}>{messages.ipLabel}</FieldLabel>
                  <Input
                    id={ipId}
                    name="ip"
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    value={ipInput}
                    placeholder={messages.ipPlaceholder}
                    aria-invalid={isInvalid}
                    className="h-11 text-left font-mono text-base [unicode-bidi:isolate]"
                    onChange={(event) => {
                      setIpInput(event.target.value)
                    }}
                  />
                  {isInvalid ? (
                    <FieldError>{messages.invalidIpDescription}</FieldError>
                  ) : (
                    <FieldDescription>
                      {messages.ipDescription}
                    </FieldDescription>
                  )}
                </FieldContent>
              </Field>

              <Field>
                <FieldContent>
                  <FieldLabel htmlFor={resolverId}>
                    {messages.resolverLabel}
                  </FieldLabel>
                  <Select value={resolverUrl} onValueChange={setResolverUrl}>
                    <SelectTrigger id={resolverId} className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>{messages.resolverGroupLabel}</SelectLabel>
                        {BUILTIN_DOH_SERVERS.map((server) => (
                          <SelectItem key={server.url} value={server.url}>
                            {server.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    {messages.resolverDescription}
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full"
              disabled={
                inputState.status !== "valid" ||
                lookupState.status === "loading"
              }
            >
              {lookupState.status === "loading" ? (
                <Spinner aria-hidden="true" data-icon="inline-start" />
              ) : (
                <Search data-icon="inline-start" />
              )}
              {lookupState.status === "loading"
                ? messages.loadingButton
                : messages.lookupButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResultCard
        inputState={inputState}
        lookupState={lookupState}
        resolverUrl={resolverUrl}
        messages={messages}
      />
    </div>
  )
}

function isKnownResolver(value: string | null): value is string {
  return BUILTIN_DOH_SERVERS.some((server) => server.url === value)
}

export default ReverseIpLookupClient
export type { ReverseIpLookupMessages }
