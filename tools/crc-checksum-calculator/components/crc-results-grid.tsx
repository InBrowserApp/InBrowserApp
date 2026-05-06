import { Badge } from "@workspace/ui/components/ui/badge"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { cn } from "@workspace/ui/lib/utils"

import type { CrcChecksumCalculatorPageMessages } from "../client/types"
import type { CrcResult } from "../core/crc"

type CrcResultsGridProps = Readonly<{
  messages: CrcChecksumCalculatorPageMessages
  results: readonly CrcResult[]
  loading?: boolean
}>

function CrcResultsGrid({
  messages,
  results,
  loading = false,
}: CrcResultsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {results.map((result) => (
        <section
          key={result.id}
          className={cn(
            "grid gap-3 rounded-xl border bg-muted/20 p-4",
            loading && "opacity-75"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="grid gap-1">
              <h3 className="text-sm font-medium">{result.name}</h3>
              <Badge variant="secondary">
                {result.width} {messages.bitWidthLabel}
              </Badge>
            </div>
            <ToolCopyButton
              value={result.hex}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              disabled={loading}
            />
          </div>

          <div className="grid gap-1">
            <p className="text-xs text-muted-foreground">
              {messages.checksumValueLabel}
            </p>
            <code className="block text-xs leading-6 break-all sm:text-sm">
              {result.hex}
            </code>
          </div>
        </section>
      ))}
    </div>
  )
}

export { CrcResultsGrid }
