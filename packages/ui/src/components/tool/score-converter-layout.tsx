import type { ReactNode } from "react"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"

export function ScoreConverterLayout({
  settings,
  children,
}: {
  settings: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <ToolPanelCard className="h-auto lg:col-start-2 lg:row-start-1">
        <ToolPanelCardContent className="gap-3">
          {settings}
        </ToolPanelCardContent>
      </ToolPanelCard>
      <div className="min-w-0 lg:col-start-1 lg:row-start-1">{children}</div>
    </div>
  )
}
