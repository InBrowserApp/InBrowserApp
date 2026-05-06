import { useId } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
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
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { RefreshCcw } from "@workspace/ui/icons"

import { CRON_PRESETS } from "../core/cron"

import type { CronExpressionParserMessages } from "../types"

type CronInputCardProps = Readonly<{
  expression: string
  isValid: boolean
  messages: CronExpressionParserMessages
  statusText: string
  onExpressionChange: (expression: string) => void
  onReset: () => void
}>

function CronInputCard({
  expression,
  isValid,
  messages,
  statusText,
  onExpressionChange,
  onReset,
}: CronInputCardProps) {
  const inputId = useId()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.input.title}</CardTitle>
        <CardDescription>{messages.input.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field data-invalid={!isValid}>
          <FieldLabel htmlFor={inputId}>{messages.input.label}</FieldLabel>
          <Input
            id={inputId}
            value={expression}
            placeholder={messages.input.placeholder}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={!isValid}
            className="font-mono text-sm"
            onChange={(event) => {
              onExpressionChange(event.target.value)
            }}
          />
          <FieldDescription>{statusText}</FieldDescription>
        </Field>

        <div className="flex flex-wrap gap-2">
          <ToolCopyButton
            value={expression}
            copyLabel={messages.input.copy}
            copiedLabel={messages.input.copied}
            disabled={!isValid}
          />
          <Button type="button" variant="outline" size="sm" onClick={onReset}>
            <RefreshCcw data-icon="inline-start" />
            {messages.input.reset}
          </Button>
        </div>

        <div className="flex flex-col gap-3 border-t pt-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium">{messages.presets.title}</h2>
            <p className="text-sm text-muted-foreground">
              {messages.presets.description}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {CRON_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                type="button"
                variant="secondary"
                size="sm"
                className="justify-between font-mono"
                onClick={() => {
                  onExpressionChange(preset.value)
                }}
              >
                <span className="truncate font-sans">
                  {messages.presets.items[preset.id]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {preset.value}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { CronInputCard }
