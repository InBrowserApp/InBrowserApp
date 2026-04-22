"use client"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
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
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Eye, Moon, Sun } from "@workspace/ui/icons"

import { buildFontFaceDescriptor } from "../core/local-font-book"

import type { DisplayFont, LocalFontBookMessages } from "../types"

type FontPreviewPanelProps = Readonly<{
  messages: LocalFontBookMessages
  activeFont: DisplayFont | null
  sampleText: string
  darkBackground: boolean
  onSampleTextChange: (value: string) => void
  onDarkBackgroundChange: (value: boolean) => void
}>

function FontPreviewPanel({
  messages,
  activeFont,
  sampleText,
  darkBackground,
  onSampleTextChange,
  onDarkBackgroundChange,
}: FontPreviewPanelProps) {
  const descriptor = buildFontFaceDescriptor(activeFont)
  const specimenText = sampleText || messages.previewFallback
  const surfaceClassName = darkBackground
    ? "border-slate-800 bg-slate-950 text-slate-50"
    : "border-border bg-muted/30 text-foreground"

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3 border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={messages.previewBackground}
            className="rounded-full"
            onClick={() => {
              onDarkBackgroundChange(!darkBackground)
            }}
          >
            {darkBackground ? <Sun /> : <Moon />}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        <Field>
          <FieldLabel className="sr-only">
            {messages.previewFallback}
          </FieldLabel>
          <Textarea
            value={sampleText}
            onChange={(event) => {
              onSampleTextChange(event.target.value)
            }}
            rows={4}
            aria-label={messages.previewFallback}
            placeholder={messages.previewPlaceholder}
            className="min-h-28 resize-y"
          />
        </Field>

        <div
          data-dark={darkBackground}
          className={`overflow-hidden rounded-2xl border px-5 py-5 sm:px-6 sm:py-6 ${surfaceClassName}`}
        >
          {activeFont && descriptor ? (
            <div
              className="flex min-h-[20rem] flex-col justify-between gap-6"
              style={descriptor}
            >
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={darkBackground ? "secondary" : "outline"}
                  className="rounded-full"
                >
                  {activeFont.displayFamily}
                </Badge>
                <Badge
                  variant={darkBackground ? "secondary" : "outline"}
                  className="rounded-full"
                >
                  {activeFont.displayStyle}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="text-[clamp(2.25rem,5vw,4.75rem)] leading-[0.95] tracking-tight">
                  {specimenText}
                </div>
                <div className="border-t border-current/10 pt-4 text-sm tracking-[0.18em] uppercase opacity-60">
                  Aa Bb Cc 0123456789 &amp; @#?!
                </div>
              </div>
            </div>
          ) : (
            <Empty
              className="min-h-[20rem] border-none text-left"
              data-dark={darkBackground}
            >
              <EmptyHeader className="items-start text-left">
                <EmptyMedia variant="icon">
                  <Eye />
                </EmptyMedia>
                <EmptyTitle>{messages.previewTitle}</EmptyTitle>
                <EmptyDescription>{messages.previewEmpty}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FontPreviewPanel
