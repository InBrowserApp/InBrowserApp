import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
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
    <div className="flex flex-col gap-6">
      <ToolPanelCard>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center gap-3">
            <CardTitle>{messages.inputTitle}</CardTitle>
            <Badge variant="secondary">{messages.inputEyebrow}</Badge>
          </div>
          <CardDescription>{messages.inputDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent>
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
            className="min-h-80 flex-1 resize-y text-sm"
          />
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="flex flex-wrap justify-start gap-3 border-t">
          <Button
            type="button"
            variant="ghost"
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
        </ToolPanelCardFooter>
      </ToolPanelCard>

      <ToolPanelCard>
        <CardHeader className="border-b">
          <CardTitle>{messages.snapshotTitle}</CardTitle>
          <CardDescription>{messages.snapshotDescription}</CardDescription>
        </CardHeader>
        <ToolPanelCardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {overviewMetrics.map((item) => (
            <MetricCard
              key={item.label}
              label={item.label}
              value={item.value}
              tone="default"
            />
          ))}
        </ToolPanelCardContent>
      </ToolPanelCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.styleTitle}</CardTitle>
            <CardDescription>{messages.styleDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {styleMetrics.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>{messages.structureTitle}</CardTitle>
            <CardDescription>{messages.structureDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {structureMetrics.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.repeatedTermsTitle}</CardTitle>
          <CardDescription>{messages.repeatedTermsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.topTerms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.topTerms.map((term) => (
                <Badge
                  key={term.term}
                  variant="secondary"
                  className="gap-2 rounded-full px-3 py-1"
                >
                  <span className="font-medium">{term.term}</span>
                  <span className="text-muted-foreground">×{term.count}</span>
                </Badge>
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
  )
}

export default TextStatisticsClient
