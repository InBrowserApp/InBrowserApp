import { getBlockRange, type Assignment } from "@workspace/mac-address"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import type English from "./messages/en.json"

function BlockDetails({
  record,
  language,
  messages,
}: Readonly<{
  record: Assignment
  language: string
  messages: typeof English
}>) {
  const range = getBlockRange(record)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-3">
          <span dir="ltr" translate="no" className="font-mono">
            {range.prefix}
          </span>
          <Badge variant="outline" dir="ltr" translate="no">
            {record.registry}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {record.registry === "CID" ? (
          <p className="text-sm text-muted-foreground">{messages.cidHint}</p>
        ) : (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-sm text-muted-foreground">
                {messages.range}
              </dt>
              <dd
                dir="ltr"
                translate="no"
                className="mt-1 font-mono text-sm wrap-anywhere"
              >
                {range.start} – {range.end}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">
                {messages.capacity}
              </dt>
              <dd className="mt-1 font-mono text-sm tabular-nums">
                {new Intl.NumberFormat(language).format(range.size)}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}

export default BlockDetails
