import { ToolSurface } from "@workspace/ui/components/tool/tool-surface"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import type { HtmlToMarkdownMessages } from "../client"
import type {
  BulletListMarker,
  CodeBlockStyle,
  HeadingStyle,
} from "../core/html-to-markdown"

type FormatOptionsPanelProps = Readonly<{
  messages: HtmlToMarkdownMessages
  headingStyle: HeadingStyle
  bulletListMarker: BulletListMarker
  codeBlockStyle: CodeBlockStyle
  onHeadingStyleChange: (value: HeadingStyle) => void
  onBulletListMarkerChange: (value: BulletListMarker) => void
  onCodeBlockStyleChange: (value: CodeBlockStyle) => void
}>

function FormatOptionsPanel({
  messages,
  headingStyle,
  bulletListMarker,
  codeBlockStyle,
  onHeadingStyleChange,
  onBulletListMarkerChange,
  onCodeBlockStyleChange,
}: FormatOptionsPanelProps) {
  return (
    <ToolSurface className="grid gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-lg leading-tight tracking-[var(--tracking-display)] text-balance">
          {messages.optionsTitle}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {messages.optionsDescription}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <p className="text-sm font-medium">{messages.headingStyleLabel}</p>
          <Select
            value={headingStyle}
            onValueChange={(value) => {
              onHeadingStyleChange(value as HeadingStyle)
            }}
          >
            <SelectTrigger
              aria-label={messages.headingStyleLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="atx">
                {messages.headingStyleAtxLabel}
              </SelectItem>
              <SelectItem value="setext">
                {messages.headingStyleSetextLabel}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-medium">{messages.bulletStyleLabel}</p>
          <Select
            value={bulletListMarker}
            onValueChange={(value) => {
              onBulletListMarkerChange(value as BulletListMarker)
            }}
          >
            <SelectTrigger
              aria-label={messages.bulletStyleLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">{messages.bulletStyleDashLabel}</SelectItem>
              <SelectItem value="*">
                {messages.bulletStyleAsteriskLabel}
              </SelectItem>
              <SelectItem value="+">{messages.bulletStylePlusLabel}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <p className="text-sm font-medium">{messages.codeBlockStyleLabel}</p>
          <Select
            value={codeBlockStyle}
            onValueChange={(value) => {
              onCodeBlockStyleChange(value as CodeBlockStyle)
            }}
          >
            <SelectTrigger
              aria-label={messages.codeBlockStyleLabel}
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fenced">
                {messages.codeBlockStyleFencedLabel}
              </SelectItem>
              <SelectItem value="indented">
                {messages.codeBlockStyleIndentedLabel}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </ToolSurface>
  )
}

export { FormatOptionsPanel }
