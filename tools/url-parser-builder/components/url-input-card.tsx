import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Label } from "@workspace/ui/components/ui/label"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { RefreshCcw, Sparkles, TriangleAlert } from "@workspace/ui/icons"
import { useId } from "react"

import type { UrlParserBuilderMessages } from "../types"

type UrlInputCardProps = Readonly<{
  messages: UrlParserBuilderMessages
  value: string
  isValid: boolean
  showParseError: boolean
  onChange: (nextValue: string) => void
  onLoadSample: () => void
  onReset: () => void
}>

function UrlInputCard({
  messages,
  value,
  isValid,
  showParseError,
  onChange,
  onLoadSample,
  onReset,
}: UrlInputCardProps) {
  const inputId = useId()

  return (
    <Card className="border-border/70 bg-background/90 shadow-sm">
      <CardHeader className="gap-4 border-b bg-linear-to-r from-muted/50 to-background">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle>{messages.inputTitle}</CardTitle>
              <Badge variant={isValid ? "secondary" : "destructive"}>
                {isValid ? messages.validBadge : messages.invalidBadge}
              </Badge>
            </div>
            <CardDescription className="max-w-3xl">
              {messages.inputDescription}
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLoadSample}
            >
              <Sparkles data-icon="inline-start" />
              {messages.loadSampleLabel}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onReset}>
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={inputId}>{messages.urlLabel}</Label>
          <Textarea
            id={inputId}
            value={value}
            spellCheck={false}
            rows={4}
            aria-invalid={!isValid}
            placeholder={messages.urlPlaceholder}
            className="min-h-28 resize-y font-mono text-sm"
            onChange={(event) => {
              onChange(event.target.value)
            }}
          />
        </div>

        {showParseError ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.parseErrorTitle}</AlertTitle>
            <AlertDescription>
              {messages.parseErrorDescription}
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { UrlInputCard }
