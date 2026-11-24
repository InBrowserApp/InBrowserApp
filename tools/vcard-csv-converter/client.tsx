import { CsvRowError } from "@workspace/record-csv"
import { writeVcards } from "@workspace/vcard"
import { RecordConverter } from "@workspace/ui/components/tool/record-converter"
import { csvToVcard, vcardToCsv } from "./convert"
import type catalog from "./messages/en.json"

export type Messages = typeof catalog

const vcard = writeVcards([
  {
    firstName: "Taylor",
    lastName: "Morgan",
    email: "taylor@example.com",
    phone: "+1 415 555 0102",
  },
  {
    firstName: "Alex",
    lastName: "Chen",
    email: "alex@example.com",
    company: "Community Studio",
  },
])
const csv =
  "First Name,Last Name,Email,Phone\r\nTaylor,Morgan,taylor@example.com,+1 415 555 0102\r\nAlex,Chen,alex@example.com,\r\n"

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
          accept: ".vcf,.vcard,text/vcard",
          example: vcard,
          extension: "csv",
          mimeType: "text/csv;charset=utf-8",
          convert: vcardToCsv,
        },
        {
          label: m.reverse,
          download: m.downloadReverse,
          accept: ".csv,.tsv,text/csv",
          example: csv,
          extension: "vcf",
          mimeType: "text/vcard;charset=utf-8",
          convert: csvToVcard,
        },
      ]}
    />
  )
}
