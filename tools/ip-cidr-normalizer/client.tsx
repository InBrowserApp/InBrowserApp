import { useId, useMemo, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { TriangleAlert } from "@workspace/ui/icons"

import { normalizeIpCidr } from "./core/ip-cidr"

export type IpCidrNormalizerMessages = Readonly<{
  inputTitle: string
  inputDescription: string
  resultTitle: string
  resultDescription: string
  label: string
  placeholder: string
  invalidInput: string
  invalidInputDescription: string
  copyLabel: string
  copiedLabel: string
}>

type IpCidrNormalizerClientProps = Readonly<{
  messages: IpCidrNormalizerMessages & {
    meta: {
      name: string
      description: string
    }
  }
}>

function IpCidrNormalizerClient({ messages }: IpCidrNormalizerClientProps) {
  const inputId = useId()
  const [value, setValue] = useState("")
  const result = useMemo(() => normalizeIpCidr(value), [value])

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.inputTitle}</CardTitle>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={result.status === "invalid" || undefined}>
              <FieldContent>
                <FieldLabel htmlFor={inputId}>{messages.label}</FieldLabel>
                <Input
                  id={inputId}
                  name="ip-cidr"
                  autoComplete="off"
                  spellCheck={false}
                  value={value}
                  aria-invalid={result.status === "invalid"}
                  placeholder={messages.placeholder}
                  className="h-11 font-mono text-base"
                  onChange={(event) => {
                    setValue(event.target.value)
                  }}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          {result.status === "invalid" ? (
            <div aria-live="polite">
              <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>{messages.invalidInput}</AlertTitle>
                <AlertDescription>
                  {messages.invalidInputDescription}
                </AlertDescription>
              </Alert>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">
                  {messages.resultTitle}
                </p>
                <p className="mt-2 font-mono text-lg font-medium break-all">
                  {result.status === "success" ? result.normalized : "—"}
                </p>
              </div>

              <ToolCopyButton
                value={result.status === "success" ? result.normalized : ""}
                copyLabel={messages.copyLabel}
                copiedLabel={messages.copiedLabel}
                disabled={result.status !== "success"}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default IpCidrNormalizerClient
