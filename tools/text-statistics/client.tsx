import { useDeferredValue, useEffect, useId, useState } from "react"

import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { calculateTextStats, formatTime } from "./core/text-stats"

type TextStatisticsMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  placeholder: string
  characters: string
  charactersNoSpaces: string
  words: string
  lines: string
  paragraphs: string
  sentences: string
  readingTime: string
  speakingTime: string
}>

type TextStatisticsClientProps = Readonly<{
  messages: TextStatisticsMessages
}>

const STORAGE_KEY = "tools:text-statistics:text"

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

  const statItems = [
    { label: messages.characters, value: String(stats.characters) },
    {
      label: messages.charactersNoSpaces,
      value: String(stats.charactersNoSpaces),
    },
    { label: messages.words, value: String(stats.words) },
    { label: messages.lines, value: String(stats.lines) },
    { label: messages.paragraphs, value: String(stats.paragraphs) },
    { label: messages.sentences, value: String(stats.sentences) },
    {
      label: messages.readingTime,
      value: formatTime(stats.readingTimeMinutes),
    },
    {
      label: messages.speakingTime,
      value: formatTime(stats.speakingTimeMinutes),
    },
  ] as const

  return (
    <div className="grid gap-6">
      <Card>
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
            rows={12}
            className="min-h-80 resize-y text-sm"
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex flex-col gap-2 pt-6">
              <p className="text-sm font-medium text-muted-foreground">
                {item.label}
              </p>
              <p className="font-heading text-3xl leading-none tracking-[var(--tracking-display)]">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TextStatisticsClient
