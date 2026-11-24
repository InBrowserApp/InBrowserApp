import { CsvRowError } from "@workspace/record-csv"
import { calendarExample } from "@workspace/icalendar/example"
import { RecordConverter } from "@workspace/ui/components/tool/record-converter"
import { csvToIcs, icsToCsv } from "./convert"
import type catalog from "./messages/en.json"

export type Messages = typeof catalog

const csv = [
  "Title,Start,End,Location",
  "Project planning,2026-05-12T09:00:00Z,2026-05-12T09:30:00Z,Studio 3",
  "Design workshop,2026-05-15,2026-05-17,Community studio",
].join("\r\n")

export default function Client({
  messages: m,
  language,
}: {
  messages: Messages
  language: string
}) {
  return (
    <RecordConverter
      messages={m}
      language={language}
      getErrorRow={(error) =>
        error instanceof CsvRowError ? error.row : undefined
      }
      directions={[
        {
          label: m.forward,
          download: m.downloadForward,
          accept: ".ics,.ical,text/calendar",
          example: calendarExample,
          extension: "csv",
          mimeType: "text/csv;charset=utf-8",
          convert: icsToCsv,
        },
        {
          label: m.reverse,
          download: m.downloadReverse,
          accept: ".csv,.tsv,text/csv",
          example: csv,
          extension: "ics",
          mimeType: "text/calendar;charset=utf-8",
          convert: csvToIcs,
        },
      ]}
    />
  )
}
