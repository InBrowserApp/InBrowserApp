import { useId, useMemo, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { TriangleAlert } from "@workspace/ui/icons"

import { ResultPanel } from "./components/result-panel"
import { mergeAndExcludeCidrs } from "./core/cidr-merge-exclude"

import type {
  CidrInputError,
  CidrMergeExcludeResult,
} from "./core/cidr-merge-exclude"
import type { CidrsMergerExcluderMessages } from "./types"

type CidrsMergerExcluderClientProps = Readonly<{
  messages: CidrsMergerExcluderMessages & {
    meta: {
      name: string
      description: string
    }
  }
}>

function getStatusCopy(
  result: CidrMergeExcludeResult,
  messages: CidrsMergerExcluderMessages
) {
  switch (result.status) {
    case "empty":
      return {
        title: messages.emptyTitle,
        description: messages.emptyDescription,
      }
    case "missing-merge":
      return {
        title: messages.missingMergeTitle,
        description: messages.missingMergeDescription,
      }
    case "invalid":
      return {
        title: messages.invalidTitle,
        description: messages.invalidDescription,
      }
    case "success":
      return null
  }
}

function formatError(
  error: CidrInputError,
  messages: CidrsMergerExcluderMessages
) {
  const group =
    error.group === "merge"
      ? messages.mergeGroupLabel
      : messages.excludeGroupLabel

  return `${group}, ${messages.lineLabel} ${error.line}: ${error.value}`
}

function CidrsMergerExcluderClient({
  messages,
}: CidrsMergerExcluderClientProps) {
  const mergeId = useId()
  const excludeId = useId()
  const [mergeValue, setMergeValue] = useState("")
  const [excludeValue, setExcludeValue] = useState("")
  const result = useMemo(
    () => mergeAndExcludeCidrs(mergeValue, excludeValue),
    [mergeValue, excludeValue]
  )
  const statusCopy = getStatusCopy(result, messages)
  const isInvalid = result.status === "invalid"
  const visibleErrors = isInvalid ? result.errors.slice(0, 3) : []
  const moreErrorCount = isInvalid
    ? Math.max(0, result.errors.length - visibleErrors.length)
    : 0

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={isInvalid || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={mergeId}>{messages.mergeLabel}</FieldLabel>
                <FieldDescription>{messages.mergeDescription}</FieldDescription>
              </FieldContent>
              <Textarea
                id={mergeId}
                name="cidrs-to-merge"
                autoComplete="off"
                spellCheck={false}
                value={mergeValue}
                aria-invalid={isInvalid}
                placeholder={messages.mergePlaceholder}
                className="min-h-44 resize-y font-mono text-base"
                onChange={(event) => {
                  setMergeValue(event.target.value)
                }}
              />
            </Field>

            <Field data-invalid={isInvalid || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={excludeId}>
                  {messages.excludeLabel}
                </FieldLabel>
                <FieldDescription>
                  {messages.excludeDescription}
                </FieldDescription>
              </FieldContent>
              <Textarea
                id={excludeId}
                name="cidrs-to-exclude"
                autoComplete="off"
                spellCheck={false}
                value={excludeValue}
                aria-invalid={isInvalid}
                placeholder={messages.excludePlaceholder}
                className="min-h-32 resize-y font-mono text-base"
                onChange={(event) => {
                  setExcludeValue(event.target.value)
                }}
              />
            </Field>
          </FieldGroup>

          {isInvalid ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidTitle}</AlertTitle>
                <AlertDescription>
                  <span className="block">{messages.invalidDescription}</span>
                  <span className="mt-2 block font-mono text-xs break-all">
                    {visibleErrors
                      .map((error) => formatError(error, messages))
                      .join("\n")}
                    {moreErrorCount > 0
                      ? `\n${messages.moreErrorsLabel}: ${moreErrorCount}`
                      : ""}
                  </span>
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <ResultPanel
        result={result}
        messages={messages}
        statusCopy={statusCopy}
      />
    </div>
  )
}

export default CidrsMergerExcluderClient
export type { CidrsMergerExcluderMessages }
