import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardAction,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Moon } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { CSSProperties } from "react"

import type { CssBoxShadowMessages } from "../client/types"

type PreviewCardProps = Readonly<{
  cssOutput: string
  darkBackground: boolean
  messages: CssBoxShadowMessages
  onDarkBackgroundChange: (value: boolean) => void
  previewStyle: CSSProperties
}>

function PreviewCard({
  cssOutput,
  darkBackground,
  messages,
  onDarkBackgroundChange,
  previewStyle,
}: PreviewCardProps) {
  return (
    <ToolPanelCard size="sm">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardAction>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-2.5 py-1.5 text-sm">
            <Moon aria-hidden="true" className="size-4 text-muted-foreground" />
            <span className="hidden sm:inline">
              {messages.darkBackgroundLabel}
            </span>
            <Switch
              aria-label={messages.darkBackgroundLabel}
              checked={darkBackground}
              data-testid="dark-background-switch"
              onCheckedChange={onDarkBackgroundChange}
              size="sm"
            />
          </div>
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent className="gap-3">
        <div
          className={cn(
            "grid min-h-56 place-items-center overflow-hidden rounded-lg border p-4 transition-colors",
            darkBackground
              ? "border-zinc-800 bg-zinc-950"
              : "border-border/80 bg-muted/25"
          )}
          data-testid="preview-surface"
        >
          <div className="relative w-full max-w-sm">
            <div
              className={cn(
                "relative grid min-h-40 gap-3 rounded-lg border p-5 transition-colors",
                darkBackground
                  ? "border-white/10 bg-zinc-900 text-zinc-100"
                  : "border-border bg-background text-foreground"
              )}
              data-testid="shadow-preview"
              style={previewStyle}
            >
              <span className="text-xs font-medium text-muted-foreground uppercase">
                box-shadow
              </span>
              <div className="grid gap-3">
                <div className="h-3 w-24 rounded-full bg-current/10" />
                <div className="h-3 w-40 rounded-full bg-current/10" />
                <div className="h-14 rounded-2xl border border-current/10 bg-current/5" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-muted-foreground uppercase">
              {messages.outputTitle}
            </div>
            <ToolCopyButton
              copiedLabel={messages.copiedLabel}
              copyLabel={messages.copyLabel}
              value={cssOutput}
              variant="ghost"
            />
          </div>
          <pre
            className="overflow-x-auto rounded-lg border bg-muted/20 p-3 font-mono text-xs leading-6"
            data-testid="shadow-output"
          >
            <code>{cssOutput}</code>
          </pre>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PreviewCard }
