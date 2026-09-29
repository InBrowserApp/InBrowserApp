import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { CSSProperties } from "react"

import type { ColorContrastMessages } from "./types"

type PreviewCardProps = Readonly<{
  messages: ColorContrastMessages
  previewStyle: CSSProperties
}>

export function PreviewCard({ messages, previewStyle }: PreviewCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>
          {messages.normalTextLabel} / {messages.largeTextLabel}
        </CardDescription>
      </CardHeader>
      <ToolPanelCardContent>
        <div
          className="grid gap-5 rounded-xl border p-5 shadow-xs"
          style={previewStyle}
        >
          <div className="grid gap-2">
            <div className="text-xs font-medium opacity-75">
              {messages.normalTextLabel}
            </div>
            <p className="text-base leading-7">{messages.sampleText}</p>
          </div>

          <div className="grid gap-2">
            <div className="text-xs font-medium opacity-75">
              {messages.largeTextLabel}
            </div>
            <p className="text-2xl leading-tight font-semibold">
              {messages.sampleText}
            </p>
          </div>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
