import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { RobotsTxtGeneratorPageMessages } from "../client/types"

type SiteSettingsCardProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
  sitemapsText: string
  advanced: boolean
  host: string
  onSitemapsTextChange: (nextValue: string) => void
  onAdvancedChange: (nextValue: boolean) => void
  onHostChange: (nextValue: string) => void
}>

function SiteSettingsCard({
  messages,
  sitemapsText,
  advanced,
  host,
  onSitemapsTextChange,
  onAdvancedChange,
  onHostChange,
}: SiteSettingsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.siteSettings}</CardTitle>
        <CardDescription>{messages.siteSettingsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="grid gap-2">
          <Label htmlFor="robots-sitemaps">{messages.sitemaps}</Label>
          <Textarea
            id="robots-sitemaps"
            name="robots-sitemaps"
            rows={4}
            spellCheck={false}
            aria-label={messages.sitemaps}
            value={sitemapsText}
            onChange={(event) => {
              onSitemapsTextChange(event.target.value)
            }}
            placeholder={messages.sitemapPlaceholder}
            className="min-h-28 resize-y font-mono text-sm"
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3">
          <div className="grid gap-1">
            <div className="text-sm font-medium">
              {messages.advancedSettings}
            </div>
            <div className="text-xs text-muted-foreground">{messages.host}</div>
          </div>
          <Switch
            checked={advanced}
            aria-label={messages.advancedSettings}
            onCheckedChange={(checked) => {
              onAdvancedChange(checked === true)
            }}
          />
        </div>

        {advanced ? (
          <div className="grid gap-2">
            <Label htmlFor="robots-host">{messages.host}</Label>
            <Input
              id="robots-host"
              name="robots-host"
              autoComplete="off"
              spellCheck={false}
              aria-label={messages.host}
              value={host}
              onChange={(event) => {
                onHostChange(event.target.value)
              }}
              placeholder={messages.hostPlaceholder}
              className="font-mono text-sm"
            />
          </div>
        ) : null}
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SiteSettingsCard }
