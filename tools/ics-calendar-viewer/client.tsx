import { useMemo, useState } from "react"
import { readCalendar, type CalendarEvent } from "@workspace/icalendar"
import { calendarExample } from "@workspace/icalendar/example"
import {
  ToolOpenTextFile,
  useTextFileImport,
} from "@workspace/ui/components/tool/tool-open-text-file"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { CalendarDays, ChevronDown, Search } from "@workspace/ui/icons"

import { dateFormatters, EventRow } from "./event-row"
import type catalog from "./messages/en.json"

export type Messages = typeof catalog

type AgendaEntry = {
  event: CalendarEvent
  key: string
  searchText: string
}

export default function Client({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  const importer = useTextFileImport()
  const [source, setSource] = useState("")
  const [sourceName, setSourceName] = useState("")
  const [entries, setEntries] = useState<AgendaEntry[] | null>(null)
  const [error, setError] = useState("")
  const [query, setQuery] = useState("")
  const dates = useMemo(() => dateFormatters(language), [language])
  const number = useMemo(() => new Intl.NumberFormat(language), [language])
  const search = query.trim().toLocaleLowerCase(language)
  const visible = entries?.filter(({ searchText }) =>
    searchText.includes(search)
  )

  function load(value: string, filename = "") {
    importer.cancel()
    setSource(value)
    setSourceName(filename)
    setQuery("")
    try {
      const events = readCalendar(value).sort((a, b) =>
        (a.start?.value ?? "").localeCompare(b.start?.value ?? "")
      )
      setEntries(
        events.map((event, index) => ({
          event,
          key: JSON.stringify([event.uid, event.recurrenceId?.value, index]),
          searchText: [event.title, event.location, event.description]
            .join("\n")
            .toLocaleLowerCase(language),
        }))
      )
      setError("")
    } catch {
      setEntries(null)
      setError(m.invalid)
    }
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <ToolOpenTextFile
            accept=".ics,.ical,text/calendar"
            label={m.openFile}
            onFile={(file) =>
              void importer.read(
                file,
                (value) => load(value, file.name),
                () => setError(m.readError)
              )
            }
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => load(calendarExample)}
          >
            {m.sample}
          </Button>
          {sourceName && (
            <span
              dir="auto"
              className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
            >
              {sourceName}
            </span>
          )}
        </div>
        <details className="group">
          <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
            {m.paste}
            <ChevronDown
              className="size-4 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="mt-3 grid gap-2">
            <Textarea
              aria-label={m.input}
              placeholder={m.placeholder}
              dir="ltr"
              className="min-h-28 font-mono"
              value={source}
              onChange={(event) => {
                importer.cancel()
                setSource(event.currentTarget.value)
                setSourceName("")
                setEntries(null)
                setError("")
              }}
            />
            <Button
              type="button"
              className="w-fit"
              disabled={!source.trim()}
              onClick={() => load(source, sourceName)}
            >
              {m.view}
            </Button>
          </div>
        </details>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-3">
        {error && (
          <p
            role="alert"
            className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        {!entries && !error && (
          <div className="grid min-h-40 place-content-center justify-items-center gap-3 rounded-lg border border-dashed p-5 text-center text-sm text-muted-foreground">
            <CalendarDays className="size-7" aria-hidden="true" />
            {m.empty}
          </div>
        )}
        {entries?.length === 0 && (
          <p role="status" className="rounded-md border p-4 text-sm">
            {m.noEvents}
          </p>
        )}
        {visible && entries?.length ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative w-full sm:max-w-72">
                <Search
                  className="pointer-events-none absolute start-3 top-2.5 size-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  aria-label={m.search}
                  placeholder={m.search}
                  className="ps-9"
                  value={query}
                  onChange={(event) => setQuery(event.currentTarget.value)}
                />
              </div>
              <p role="status" className="text-sm text-muted-foreground">
                {m.count.replace("{count}", number.format(visible.length))}
              </p>
            </div>
            {visible.length === 0 ? (
              <p className="rounded-md border p-4 text-sm">{m.noMatches}</p>
            ) : (
              <ul className="divide-y overflow-hidden rounded-lg border">
                {visible.map(({ event, key }) => (
                  <li key={key}>
                    <EventRow event={event} dates={dates} messages={m} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
