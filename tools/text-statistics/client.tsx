import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FileText } from "@workspace/ui/icons"

import { SAMPLE_TEXT } from "./constants"
import { MetricCard } from "./components/metric-card"
import { calculateTextStats, formatTime } from "./core/text-stats"

import type { TextStatisticsMessages } from "./types"

type TextStatisticsClientProps = Readonly<{
  messages: TextStatisticsMessages
}>

const STORAGE_KEY = "tools:text-statistics:text"

const integerFormatter = new Intl.NumberFormat()
const decimalFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
})
const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 0,
})

function TextStatisticsClient({ messages }: TextStatisticsClientProps) {
  const textareaId = useId()
  const [text, setText] = useState("")
  const deferredText = useDeferredValue(text)
  const stats = calculateTextStats(deferredText)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedText = window.localStorage.getItem(STORAGE_KEY)

    if (storedText !== null) {
      setText(storedText)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, text)
  }, [text])

  const overviewMetrics = [
    { label: messages.words, value: integerFormatter.format(stats.words) },
    {
      label: messages.uniqueWords,
      value: integerFormatter.format(stats.uniqueWords),
    },
    {
      label: messages.characters,
      value: integerFormatter.format(stats.characters),
    },
    {
      label: messages.sentences,
      value: integerFormatter.format(stats.sentences),
    },
    {
      label: messages.paragraphs,
      value: integerFormatter.format(stats.paragraphs),
    },
    { label: messages.lines, value: integerFormatter.format(stats.lines) },
    {
      label: messages.readingTime,
      value: formatTime(stats.readingTimeMinutes),
    },
    {
      label: messages.speakingTime,
      value: formatTime(stats.speakingTimeMinutes),
    },
  ] as const

  const styleMetrics = [
    {
      label: messages.charactersNoSpaces,
      value: integerFormatter.format(stats.charactersNoSpaces),
    },
    {
      label: messages.averageWordLength,
      value: decimalFormatter.format(stats.averageWordLength),
    },
    {
      label: messages.lexicalDiversity,
      value: percentFormatter.format(stats.lexicalDiversity),
    },
  ] as const

  const structureMetrics = [
    {
      label: messages.averageSentenceWords,
      value: decimalFormatter.format(stats.averageSentenceWords),
    },
    {
      label: messages.longestSentenceWords,
      value: integerFormatter.format(stats.longestSentenceWords),
    },
    {
      label: messages.longestParagraphWords,
      value: integerFormatter.format(stats.longestParagraphWords),
    },
  ] as const

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]">
      <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-amber-50/80 via-background to-orange-50/60 shadow-sm shadow-black/5 dark:from-stone-950 dark:via-background dark:to-stone-900">
        <CardHeader className="gap-4 border-b bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.24),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_36%)]">
          <div className="space-y-2">
            <p className="text-[0.68rem] font-medium tracking-[0.28em] text-muted-foreground uppercase">
              {messages.inputEyebrow}
            </p>
            <CardTitle className="max-w-xl text-2xl text-balance sm:text-3xl">
              {messages.inputTitle}
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm/relaxed text-foreground/70">
              {messages.inputDescription}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <label htmlFor={textareaId} className="sr-only">
            {messages.placeholder}
          </label>
          <Textarea
            id={textareaId}
            aria-label={messages.placeholder}
            value={text}
            onChange={(event) => {
              setText(event.target.value)
            }}
            placeholder={messages.placeholder}
            rows={14}
            className="min-h-[24rem] resize-y border-foreground/10 bg-background/80 text-sm shadow-inner shadow-black/5 dark:bg-background/60"
          />
        </CardContent>
        <CardFooter className="justify-between gap-3 border-t bg-background/50">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              startTransition(() => {
                setText(SAMPLE_TEXT)
              })
            }}
          >
            {messages.loadSample}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              startTransition(() => {
                setText("")
              })
            }}
          >
            {messages.clearText}
          </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6">
        <Card className="overflow-hidden border-foreground/10 bg-gradient-to-br from-background via-background to-muted/50">
          <CardHeader className="gap-2 border-b">
            <CardTitle>{messages.snapshotTitle}</CardTitle>
            <CardDescription>{messages.snapshotDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 sm:grid-cols-2">
            {overviewMetrics.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                tone="warm"
              />
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 2xl:grid-cols-2">
          <Card className="border-foreground/10">
            <CardHeader className="gap-2 border-b">
              <CardTitle>{messages.styleTitle}</CardTitle>
              <CardDescription>{messages.styleDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {styleMetrics.map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  tone="quiet"
                />
              ))}
            </CardContent>
          </Card>

          <Card className="border-foreground/10">
            <CardHeader className="gap-2 border-b">
              <CardTitle>{messages.structureTitle}</CardTitle>
              <CardDescription>{messages.structureDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6">
              {structureMetrics.map((item) => (
                <MetricCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  tone="default"
                />
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-foreground/10">
          <CardHeader className="gap-2 border-b">
            <CardTitle>{messages.repeatedTermsTitle}</CardTitle>
            <CardDescription>
              {messages.repeatedTermsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {stats.topTerms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {stats.topTerms.map((term) => (
                  <div
                    key={term.term}
                    className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-muted/50 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium">{term.term}</span>
                    <span className="text-muted-foreground">×{term.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <Empty className="border-border/80 bg-muted/20">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText />
                  </EmptyMedia>
                  <EmptyTitle>{messages.repeatedTermsTitle}</EmptyTitle>
                  <EmptyDescription>
                    {messages.repeatedTermsEmpty}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TextStatisticsClient
