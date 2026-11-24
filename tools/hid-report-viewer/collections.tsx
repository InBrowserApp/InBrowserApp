import { ChevronDown } from "@workspace/ui/icons"

import { hex } from "./core/report"

import type { HidCollection } from "./hid"
import type english from "./messages/en.json"

type Messages = typeof english

export function Collections({
  collections,
  messages,
}: {
  collections: HidCollection[]
  messages: Messages
}) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <h2 className="text-sm font-semibold">{messages.collections}</h2>
      {collections.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {messages.noCollections}
        </p>
      )}
      {collections.map((collection, index) => (
        <CollectionRow
          key={index}
          collection={collection}
          messages={messages}
          open={index === 0}
        />
      ))}
    </div>
  )
}

function CollectionRow({
  collection,
  messages,
  open = false,
}: {
  collection: HidCollection
  messages: Messages
  open?: boolean
}) {
  const reports = [
    { label: messages.input, ids: collection.inputReports },
    { label: messages.output, ids: collection.outputReports },
    { label: messages.feature, ids: collection.featureReports },
  ]

  return (
    <details
      open={open}
      className="min-w-0 rounded-lg border [&[open]>summary>svg]:rotate-180"
    >
      <summary className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-ring">
        <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-1">
          <span>
            {messages.usagePage}{" "}
            <code dir="ltr">0x{hex(collection.usagePage, 4)}</code>
          </span>
          <span>
            {messages.usage} <code dir="ltr">0x{hex(collection.usage, 4)}</code>
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-muted-foreground"
        />
      </summary>
      <div className="space-y-2 border-t px-3 py-2">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
          {reports.map(({ label, ids }) => (
            <ReportIds
              key={label}
              label={label}
              ids={ids.map(({ reportId }) => reportId)}
            />
          ))}
        </dl>
        {collection.children.map((child, index) => (
          <CollectionRow key={index} collection={child} messages={messages} />
        ))}
      </div>
    </details>
  )
}

function ReportIds({ label, ids }: { label: string; ids: number[] }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd dir="ltr" className="font-mono wrap-anywhere">
        {ids.length ? ids.join(", ") : "–"}
      </dd>
    </>
  )
}
