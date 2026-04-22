"use client"

import { useId, useRef, type ChangeEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldDescription, FieldLabel } from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import {
  ArrowLeftRight,
  FileText,
  RefreshCcw,
  Trash2,
} from "@workspace/ui/icons"

import { FILE_ACCEPT } from "../constants"
import { getTextStats, formatTemplate } from "../utils"

import type { TextDiffMessages } from "../types"

type DiffInputCardProps = Readonly<{
  messages: TextDiffMessages
  originalText: string
  modifiedText: string
  onOriginalTextChange: (value: string) => void
  onModifiedTextChange: (value: string) => void
  onSwap: () => void
  onLoadSample: () => void
  onClear: () => void
}>

function DiffInputCard({
  messages,
  originalText,
  modifiedText,
  onOriginalTextChange,
  onModifiedTextChange,
  onSwap,
  onLoadSample,
  onClear,
}: DiffInputCardProps) {
  const originalId = useId()
  const modifiedId = useId()
  const originalInputRef = useRef<HTMLInputElement | null>(null)
  const modifiedInputRef = useRef<HTMLInputElement | null>(null)
  const originalStats = getTextStats(originalText)
  const modifiedStats = getTextStats(modifiedText)

  async function handleFileImport(
    event: ChangeEvent<HTMLInputElement>,
    onTextChange: (value: string) => void
  ) {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) {
      return
    }

    onTextChange(await file.text())
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.inputTitle}</CardTitle>
        <CardDescription>{messages.inputDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-2">
        <section className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <FieldLabel htmlFor={originalId}>
                {messages.originalLabel}
              </FieldLabel>
              <FieldDescription>
                {formatTemplate(messages.textStatsLabel, originalStats)}
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                originalInputRef.current?.click()
              }}
            >
              <FileText data-icon="inline-start" />
              {messages.importOriginalLabel}
            </Button>
            <input
              ref={originalInputRef}
              type="file"
              accept={FILE_ACCEPT}
              aria-label={messages.importOriginalLabel}
              className="sr-only"
              onChange={(event) => {
                void handleFileImport(event, onOriginalTextChange)
              }}
            />
          </div>
          <Textarea
            id={originalId}
            aria-label={messages.originalLabel}
            spellCheck={false}
            value={originalText}
            onChange={(event) => {
              onOriginalTextChange(event.target.value)
            }}
            placeholder={messages.originalPlaceholder}
            className="min-h-72 flex-1 resize-y font-mono text-sm leading-6"
          />
        </section>

        <section className="flex min-h-0 flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <FieldLabel htmlFor={modifiedId}>
                {messages.modifiedLabel}
              </FieldLabel>
              <FieldDescription>
                {formatTemplate(messages.textStatsLabel, modifiedStats)}
              </FieldDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                modifiedInputRef.current?.click()
              }}
            >
              <FileText data-icon="inline-start" />
              {messages.importModifiedLabel}
            </Button>
            <input
              ref={modifiedInputRef}
              type="file"
              accept={FILE_ACCEPT}
              aria-label={messages.importModifiedLabel}
              className="sr-only"
              onChange={(event) => {
                void handleFileImport(event, onModifiedTextChange)
              }}
            />
          </div>
          <Textarea
            id={modifiedId}
            aria-label={messages.modifiedLabel}
            spellCheck={false}
            value={modifiedText}
            onChange={(event) => {
              onModifiedTextChange(event.target.value)
            }}
            placeholder={messages.modifiedPlaceholder}
            className="min-h-72 flex-1 resize-y font-mono text-sm leading-6"
          />
        </section>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-start gap-3 border-t">
        <Button type="button" variant="outline" size="sm" onClick={onSwap}>
          <ArrowLeftRight data-icon="inline-start" />
          {messages.swapTextsLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onLoadSample}>
          <RefreshCcw data-icon="inline-start" />
          {messages.loadSampleLabel}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 data-icon="inline-start" />
          {messages.clearTextsLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}

export { DiffInputCard }
