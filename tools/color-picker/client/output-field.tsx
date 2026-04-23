import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"

import type { ColorPickerMessages } from "./types"

type OutputFieldProps = Readonly<{
  label: string
  value: string
  messages: ColorPickerMessages
}>

function OutputField({ label, value, messages }: OutputFieldProps) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <ToolCopyButton
          copiedLabel={messages.copiedValue}
          copyLabel={messages.copyValue}
          value={value}
        />
      </div>
      <div className="font-mono text-sm break-all">{value}</div>
    </div>
  )
}

export { OutputField }
