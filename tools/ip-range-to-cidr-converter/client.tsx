import { useEffect, useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ScrollArea, ScrollBar } from "@workspace/ui/components/ui/scroll-area"
import { Network, TriangleAlert } from "@workspace/ui/icons"

import { convertIpRangeToCidrs } from "./core/ip-range-to-cidr"

import type { IpRangeToCidrsResult } from "./core/ip-range-to-cidr"

export type IpRangeToCidrMessages = Readonly<{
  inputTitle: string
  inputDescription: string
  startLabel: string
  startPlaceholder: string
  endLabel: string
  endPlaceholder: string
  resultTitle: string
  resultDescription: string
  copyLabel: string
  copiedLabel: string
  rangeLabel: string
  familyLabel: string
  blockCountLabel: string
  ipv4: string
  ipv6: string
  emptyTitle: string
  emptyDescription: string
  incompleteTitle: string
  incompleteDescription: string
  invalidTitle: string
  invalidDescription: string
  mixedFamilyTitle: string
  mixedFamilyDescription: string
  reversedRangeTitle: string
  reversedRangeDescription: string
}>

type IpRangeToCidrClientProps = Readonly<{
  messages: IpRangeToCidrMessages & {
    meta: {
      name: string
      description: string
    }
  }
}>

const START_STORAGE_KEY = "tools:ip-range-to-cidr-converter:start"
const END_STORAGE_KEY = "tools:ip-range-to-cidr-converter:end"
const LEGACY_START_STORAGE_KEY = "tools:ip-range-to-cidr:start"
const LEGACY_END_STORAGE_KEY = "tools:ip-range-to-cidr:end"

function getStatusCopy(
  result: IpRangeToCidrsResult,
  messages: IpRangeToCidrMessages
) {
  switch (result.status) {
    case "empty":
      return {
        title: messages.emptyTitle,
        description: messages.emptyDescription,
      }
    case "incomplete":
      return {
        title: messages.incompleteTitle,
        description: messages.incompleteDescription,
      }
    case "invalid":
      return {
        title: messages.invalidTitle,
        description: messages.invalidDescription,
      }
    case "mixed-family":
      return {
        title: messages.mixedFamilyTitle,
        description: messages.mixedFamilyDescription,
      }
    case "reversed":
      return {
        title: messages.reversedRangeTitle,
        description: messages.reversedRangeDescription,
      }
    case "success":
      return null
  }
}

function IpRangeToCidrClient({ messages }: IpRangeToCidrClientProps) {
  const startId = useId()
  const endId = useId()
  const [startValue, setStartValue] = useState("")
  const [endValue, setEndValue] = useState("")

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedStart =
      window.localStorage.getItem(START_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_START_STORAGE_KEY)
    const storedEnd =
      window.localStorage.getItem(END_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_END_STORAGE_KEY)

    if (storedStart !== null) {
      setStartValue(storedStart)
    }

    if (storedEnd !== null) {
      setEndValue(storedEnd)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(START_STORAGE_KEY, startValue)
  }, [startValue])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(END_STORAGE_KEY, endValue)
  }, [endValue])

  const result = useMemo(
    () => convertIpRangeToCidrs(startValue, endValue),
    [startValue, endValue]
  )
  const statusCopy = getStatusCopy(result, messages)
  const showAlert =
    result.status === "invalid" ||
    result.status === "mixed-family" ||
    result.status === "reversed"
  const familyLabel =
    result.status === "success"
      ? result.family === 4
        ? messages.ipv4
        : messages.ipv6
      : null
  const copyValue = result.status === "success" ? result.cidrs.join("\n") : ""

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={showAlert || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={startId}>{messages.startLabel}</FieldLabel>
                <Input
                  id={startId}
                  name="start-ip"
                  autoComplete="off"
                  spellCheck={false}
                  value={startValue}
                  aria-invalid={showAlert}
                  placeholder={messages.startPlaceholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setStartValue(event.target.value)
                  }}
                />
              </FieldContent>
            </Field>

            <Field data-invalid={showAlert || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={endId}>{messages.endLabel}</FieldLabel>
                <Input
                  id={endId}
                  name="end-ip"
                  autoComplete="off"
                  spellCheck={false}
                  value={endValue}
                  aria-invalid={showAlert}
                  placeholder={messages.endPlaceholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setEndValue(event.target.value)
                  }}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          {showAlert && statusCopy ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{statusCopy.title}</AlertTitle>
                <AlertDescription>{statusCopy.description}</AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden pb-0">
        <CardHeader className="border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <CardTitle>{messages.resultTitle}</CardTitle>
              <CardDescription>{messages.resultDescription}</CardDescription>
            </div>
            <ToolCopyButton
              value={copyValue}
              copyLabel={messages.copyLabel}
              copiedLabel={messages.copiedLabel}
              disabled={result.status !== "success"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {result.status === "success" ? (
            <>
              <div className="grid gap-4 border-b px-6 py-4 md:grid-cols-3">
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {messages.rangeLabel}
                  </p>
                  <p className="mt-2 font-mono text-sm break-all">
                    {result.start} {"→"} {result.end}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {messages.familyLabel}
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline">{familyLabel}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {messages.blockCountLabel}
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {result.cidrs.length}
                  </p>
                </div>
              </div>

              <ScrollArea className="h-[32rem] w-full">
                <ol className="flex min-w-0 flex-col">
                  {result.cidrs.map((cidr, index) => (
                    <li
                      key={cidr}
                      className="flex items-start gap-4 border-b px-6 py-3 last:border-b-0"
                    >
                      <span className="w-8 shrink-0 text-sm text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="min-w-0 font-mono text-sm break-all">
                        {cidr}
                      </span>
                    </li>
                  ))}
                </ol>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </>
          ) : (
            <div className="px-6 py-10">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Network className="size-4" />
                  </EmptyMedia>
                  <EmptyTitle>{statusCopy?.title}</EmptyTitle>
                  <EmptyDescription>{statusCopy?.description}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default IpRangeToCidrClient
