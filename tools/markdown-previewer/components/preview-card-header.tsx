import { Badge } from "@workspace/ui/components/ui/badge"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Moon, Sun } from "@workspace/ui/icons"

import type { MarkdownPreviewerMessages } from "../types"
import type { PreviewBadge, PreviewTheme } from "../types"

type PreviewCardHeaderProps = Readonly<{
  messages: Pick<
    MarkdownPreviewerMessages,
    | "cleanThemeLabel"
    | "previewDescription"
    | "previewTitle"
    | "sanitizeHtmlLabel"
    | "showOutlineLabel"
    | "slateThemeLabel"
    | "themeLabel"
  >
  badges: readonly PreviewBadge[]
  previewTheme: PreviewTheme
  sanitizeHtml: boolean
  showOutline: boolean
  onPreviewThemeChange: (value: PreviewTheme) => void
  onSanitizeHtmlChange: (value: boolean) => void
  onShowOutlineChange: (value: boolean) => void
}>

function PreviewCardHeader({
  messages,
  badges,
  previewTheme,
  sanitizeHtml,
  showOutline,
  onPreviewThemeChange,
  onSanitizeHtmlChange,
  onShowOutlineChange,
}: PreviewCardHeaderProps) {
  function handlePreviewThemeChange(value: string) {
    if (value === "clean" || value === "slate") {
      onPreviewThemeChange(value)
    }
  }

  return (
    <CardHeader className="gap-4 border-b px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1.5">
          <CardTitle className="text-pretty">{messages.previewTitle}</CardTitle>
          <CardDescription className="max-w-2xl text-pretty">
            {messages.previewDescription}
          </CardDescription>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:items-end">
          <div className="flex flex-wrap gap-2">
            <ToggleGroup
              type="single"
              value={previewTheme}
              variant="outline"
              size="sm"
              aria-label={messages.themeLabel}
              className="w-full max-w-full sm:w-fit"
              onValueChange={handlePreviewThemeChange}
            >
              <ToggleGroupItem value="clean" className="flex-1 justify-center">
                <Sun data-icon="inline-start" />
                {messages.cleanThemeLabel}
              </ToggleGroupItem>

              <ToggleGroupItem value="slate" className="flex-1 justify-center">
                <Moon data-icon="inline-start" />
                {messages.slateThemeLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={sanitizeHtml}
                onCheckedChange={onSanitizeHtmlChange}
                aria-label={messages.sanitizeHtmlLabel}
              />
              <span>{messages.sanitizeHtmlLabel}</span>
            </label>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={showOutline}
                onCheckedChange={onShowOutlineChange}
                aria-label={messages.showOutlineLabel}
              />
              <span>{messages.showOutlineLabel}</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {badges.map((badge) => (
          <Badge
            key={badge.key}
            variant="secondary"
            className="gap-1.5 rounded-md px-2.5 py-1 tabular-nums"
          >
            <span>{badge.label}</span>
            <span className="font-medium text-foreground">{badge.value}</span>
          </Badge>
        ))}
      </div>
    </CardHeader>
  )
}

export { PreviewCardHeader }
