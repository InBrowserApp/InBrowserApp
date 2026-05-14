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

import { ResultCard } from "./components/result-card"
import {
  BUILTIN_DOH_SERVERS,
  lookupIpInfoTarget,
  parseLookupInput,
} from "./core/ip-info-lookup"

import type { FormEvent } from "react"
import type { IpInfoLookupMessages, LookupState } from "./types"

type IpInfoLookupClientProps = Readonly<{
  messages: IpInfoLookupMessages
}>

const TARGET_STORAGE_KEY = "tools:ip-info-lookup:target"
const RESOLVER_STORAGE_KEY = "tools:ip-info-lookup:resolver"
const DEFAULT_TARGET = "example.com"
const DEFAULT_RESOLVER: string = BUILTIN_DOH_SERVERS[0]!.url

function IpInfoLookupClient({ messages }: IpInfoLookupClientProps) {
  const targetId = useId()
  const resolverId = useId()
  const [targetInput, setTargetInput] = useState(DEFAULT_TARGET)
  const [resolverUrl, setResolverUrl] = useState(DEFAULT_RESOLVER)
  const [lookupState, setLookupState] = useState<LookupState>({
    status: "idle",
  })

  useEffect(() => {
    const storedTarget = window.localStorage.getItem(TARGET_STORAGE_KEY)
    const storedResolver = window.localStorage.getItem(RESOLVER_STORAGE_KEY)

    if (storedTarget !== null) {
      setTargetInput(storedTarget)
    }

    if (isKnownResolver(storedResolver)) {
      setResolverUrl(storedResolver)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(TARGET_STORAGE_KEY, targetInput)
  }, [targetInput])

  useEffect(() => {
    window.localStorage.setItem(RESOLVER_STORAGE_KEY, resolverUrl)
  }, [resolverUrl])

  const inputState = useMemo(() => parseLookupInput(targetInput), [targetInput])
  const isInvalid = inputState.status === "invalid"
  const isLoading = lookupState.status === "loading"
  const shouldShowResolver =
    inputState.status !== "valid" || inputState.target.kind === "domain"

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
        result: await lookupIpInfoTarget(targetInput, resolverUrl),
      })
    } catch {
      setLookupState({ status: "error" })
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]">
      <Card className="min-w-0 gap-0 border-border/70 py-0 shadow-sm xl:sticky xl:top-6 xl:self-start">
        <CardHeader className="border-b py-4">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <form className="flex flex-col gap-5" onSubmit={handleLookup}>
            <FieldGroup>
              <Field data-invalid={isInvalid || undefined}>
                <FieldContent>
                  <FieldLabel htmlFor={targetId}>
                    {messages.targetLabel}
                  </FieldLabel>
                  <Input
                    id={targetId}
                    name="target"
                    dir="ltr"
                    autoComplete="off"
                    spellCheck={false}
                    value={targetInput}
                    placeholder={messages.targetPlaceholder}
                    aria-invalid={isInvalid}
                    className="h-11 text-left font-mono text-base [unicode-bidi:isolate]"
                    onChange={(event) => {
                      setTargetInput(event.target.value)
                    }}
                  />
                  {isInvalid ? (
                    <FieldError>{messages.invalidTargetDescription}</FieldError>
                  ) : (
                    <FieldDescription>
                      {messages.targetDescription}
                    </FieldDescription>
                  )}
                </FieldContent>
              </Field>

              {shouldShowResolver ? (
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
                          <SelectLabel>
                            {messages.resolverGroupLabel}
                          </SelectLabel>
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
              ) : null}
            </FieldGroup>

            <Button
              type="submit"
              className="w-full"
              disabled={inputState.status !== "valid" || isLoading}
            >
              {isLoading ? (
                <Spinner aria-hidden="true" data-icon="inline-start" />
              ) : (
                <Search data-icon="inline-start" />
              )}
              {isLoading ? messages.loadingButton : messages.lookupButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResultCard
        inputState={inputState}
        lookupState={lookupState}
        messages={messages}
      />
    </div>
  )
}

function isKnownResolver(value: string | null): value is string {
  return BUILTIN_DOH_SERVERS.some((server) => server.url === value)
}

export default IpInfoLookupClient
