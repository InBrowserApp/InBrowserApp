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
    ? "border-slate-700 bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50"
    : "bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-950"
  const overlayClassName = darkBackground
    ? "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]"
    : "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.18),transparent_30%)]"

  return (
    <Card className="overflow-hidden bg-linear-to-br from-card via-card to-muted/15">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardAction>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={messages.previewBackground}
            onClick={() => {
              onDarkBackgroundChange(!darkBackground)
            }}
          >
            {darkBackground ? <Sun /> : <Moon />}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 pt-5">
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
          className={`relative overflow-hidden rounded-[1.75rem] border px-6 py-8 shadow-sm ${surfaceClassName}`}
        >
          <div aria-hidden="true" className={overlayClassName} />

          {activeFont && descriptor ? (
            <div
              className="relative flex min-h-64 flex-col justify-between gap-8"
              style={descriptor}
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant={darkBackground ? "secondary" : "outline"}>
                  {activeFont.displayFamily}
                </Badge>
                <Badge variant={darkBackground ? "secondary" : "outline"}>
                  {activeFont.displayStyle}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="text-[clamp(2.25rem,5vw,4.75rem)] leading-[0.95] tracking-tight">
                  {specimenText}
                </div>
                <div className="text-lg/relaxed opacity-75">
                  Aa Bb Cc 0123456789 &amp; @#?!
                </div>
              </div>
            </div>
          ) : (
            <Empty
              className="relative min-h-64 border-none text-left"
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
