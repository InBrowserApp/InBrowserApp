import { useState } from "react"
import { Layers2 } from "@workspace/ui/icons"
import type { Messages, Series } from "./types"
import { SliceViewer } from "./slice-viewer"

export function Workspace({
  series,
  messages,
  number,
}: {
  series: Series[]
  messages: Messages
  number: Intl.NumberFormat
}) {
  const [index, setIndex] = useState(0)
  const multiple = series.length > 1
  const labels = series.map(
    ({ description }, i) =>
      description ||
      messages.unnamedSeries.replace("{number}", number.format(i + 1))
  )
  const optionNames = series.map(({ modality }, i) => {
    const label = labels[i]!
    const parts = modality ? [label, modality] : [label]
    if (labels.indexOf(label) !== labels.lastIndexOf(label)) {
      parts.push(number.format(i + 1))
    }
    return parts.join(" · ")
  })

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-t-xl border border-b-0 bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <Layers2
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
          {messages.series}
        </span>
        {multiple ? (
          <select
            aria-label={messages.series}
            dir="auto"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
            className="max-w-full min-w-0 rounded-md border bg-background px-2 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-ring"
          >
            {optionNames.map((name, i) => (
              <option key={i} value={i}>
                {name}
              </option>
            ))}
          </select>
        ) : (
          <bdi className="min-w-0 text-sm wrap-anywhere text-muted-foreground">
            {optionNames[0]}
          </bdi>
        )}
      </div>
      <SliceViewer
        key={index}
        series={series[index]!}
        messages={messages}
        number={number}
      />
    </div>
  )
}
