import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Trash2 } from "@workspace/ui/icons"

import type { RobotsTxtGeneratorMessages } from "../client/types"

type SiteSettingsCardProps = Readonly<{
  messages: RobotsTxtGeneratorMessages
  advanced: boolean
  host: string
  sitemaps: readonly string[]
  onAdvancedChange: (advanced: boolean) => void
  onHostChange: (host: string) => void
  onSitemapsChange: (sitemaps: readonly string[]) => void
}>

function SiteSettingsCard({
  messages,
  advanced,
  host,
  sitemaps,
  onAdvancedChange,
  onHostChange,
  onSitemapsChange,
}: SiteSettingsCardProps) {
  function updateSitemap(index: number, value: string) {
    onSitemapsChange(
      sitemaps.map((sitemap, sitemapIndex) =>
        sitemapIndex === index ? value : sitemap
      )
    )
  }

  function removeSitemap(index: number) {
    onSitemapsChange(
      sitemaps.filter((_, sitemapIndex) => sitemapIndex !== index)
    )
  }

  function addSitemap() {
    onSitemapsChange([...sitemaps, ""])
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.siteSettings}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <section className="grid gap-3">
          <div className="text-sm font-medium text-foreground">
            {messages.sitemaps}
          </div>
          <div className="grid gap-2">
            {sitemaps.map((sitemap, index) => (
              <div key={`sitemap-${index}`} className="flex items-center gap-2">
                <Input
                  aria-label={`${messages.sitemaps} ${index + 1}`}
                  value={sitemap}
                  placeholder={messages.sitemapPlaceholder}
                  onChange={(event) => {
                    updateSitemap(index, event.target.value)
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`remove sitemap ${index + 1}`}
                  onClick={() => {
                    removeSitemap(index)
                  }}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSitemap}
            >
              {messages.addSitemap}
            </Button>
          </div>
        </section>

        <section className="grid gap-3 rounded-xl border border-border/70 bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-foreground">
              {messages.advancedSettings}
            </div>
            <Switch
              aria-label={messages.advancedSettings}
              checked={advanced}
              onCheckedChange={onAdvancedChange}
            />
          </div>

          {advanced ? (
            <div className="grid gap-2">
              <div className="text-sm font-medium text-foreground">
                {messages.host}
              </div>
              <Input
                aria-label={messages.host}
                value={host}
                placeholder={messages.hostPlaceholder}
                onChange={(event) => {
                  onHostChange(event.target.value)
                }}
              />
            </div>
          ) : null}
        </section>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SiteSettingsCard }
