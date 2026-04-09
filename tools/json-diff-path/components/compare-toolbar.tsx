import { Button } from "@workspace/ui/components/ui/button"
import {
  ArrowLeftRight,
  ArrowRight,
  FileJson2,
  RefreshCcw,
  Sparkles,
} from "@workspace/ui/icons"

import type { JsonDiffPathMessages } from "../client/types"

type CompareToolbarProps = Readonly<{
  messages: JsonDiffPathMessages
  pendingLargeCompare: boolean
  onApplyComparison: () => void
  onClearAll: () => void
  onFormatInputs: () => void
  onSwapInputs: () => void
  onUseSample: () => void
}>

function CompareToolbar({
  messages,
  pendingLargeCompare,
  onApplyComparison,
  onClearAll,
  onFormatInputs,
  onSwapInputs,
  onUseSample,
}: CompareToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="sr-only">{messages.toolbarLabel}</span>
      <Button type="button" variant="ghost" size="sm" onClick={onSwapInputs}>
        <ArrowLeftRight data-icon="inline-start" />
        {messages.swapLabel}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onFormatInputs}>
        <Sparkles data-icon="inline-start" />
        {messages.formatJsonLabel}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onUseSample}>
        <FileJson2 data-icon="inline-start" />
        {messages.useSampleLabel}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onClearAll}>
        <RefreshCcw data-icon="inline-start" />
        {messages.clearLabel}
      </Button>
      {pendingLargeCompare ? (
        <Button type="button" size="sm" onClick={onApplyComparison}>
          <ArrowRight data-icon="inline-start" />
          {messages.compareNowLabel}
        </Button>
      ) : null}
    </div>
  )
}

export { CompareToolbar }
