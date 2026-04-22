import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Moon } from "@workspace/ui/icons"
import { cn } from "@workspace/ui/lib/utils"

import type { CSSProperties } from "react"

import type { CssBoxShadowMessages } from "../client/types"

type PreviewCardProps = Readonly<{
  darkBackground: boolean
  messages: CssBoxShadowMessages
  onDarkBackgroundChange: (value: boolean) => void
  previewStyle: CSSProperties
}>

function PreviewCard({
  darkBackground,
  messages,
  onDarkBackgroundChange,
  previewStyle,
}: PreviewCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
        <CardAction>
          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 px-3 py-2 text-sm">
            <Moon className="size-4 text-muted-foreground" />
            <span>{messages.darkBackgroundLabel}</span>
            <Switch
              checked={darkBackground}
              data-testid="dark-background-switch"
              onCheckedChange={onDarkBackgroundChange}
              size="sm"
            />
          </div>
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent>
        <div
          className={cn(
            "grid min-h-72 place-items-center overflow-hidden rounded-[1.5rem] border p-6 transition-colors",
            darkBackground
              ? "border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_34%),linear-gradient(135deg,_#020617,_#0f172a_55%,_#1e293b)]"
              : "border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.24),_transparent_35%),linear-gradient(135deg,_#f8fafc,_#eef2ff_55%,_#e2e8f0)]"
          )}
          data-testid="preview-surface"
        >
          <div className="relative w-full max-w-sm">
            <div
              className={cn(
                "absolute inset-x-10 -bottom-6 h-8 rounded-full blur-2xl",
                darkBackground ? "bg-cyan-400/20" : "bg-slate-400/30"
              )}
            />
            <div
              className={cn(
                "relative grid min-h-52 gap-4 rounded-[1.75rem] border p-8 transition-colors",
                darkBackground
                  ? "border-white/10 bg-slate-950/80 text-slate-100"
                  : "border-white/80 bg-white/90 text-slate-950"
              )}
              data-testid="shadow-preview"
              style={previewStyle}
            >
              <span className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                box-shadow
              </span>
              <div className="grid gap-3">
                <div className="h-3 w-24 rounded-full bg-current/10" />
                <div className="h-3 w-40 rounded-full bg-current/10" />
                <div className="h-16 rounded-2xl border border-current/10 bg-current/5" />
              </div>
            </div>
          </div>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PreviewCard }
