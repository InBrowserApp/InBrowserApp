import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Button } from "@workspace/ui/components/ui/button"
import { Globe, LayoutGrid, Sparkles } from "@workspace/ui/icons"

import type { SitemapMode, SitemapPresetKey } from "../core/sitemap-state"
import type { SitemapXmlGeneratorMessages } from "../client/types"

type SettingsCardProps = Readonly<{
  messages: SitemapXmlGeneratorMessages
  mode: SitemapMode
  baseUrl: string
  autoJoin: boolean
  onModeChange: (value: SitemapMode) => void
  onBaseUrlChange: (value: string) => void
  onAutoJoinChange: (value: boolean) => void
  onPresetApply: (preset: SitemapPresetKey) => void
}>

function SettingsCard({
  messages,
  mode,
  baseUrl,
  autoJoin,
  onModeChange,
  onBaseUrlChange,
  onAutoJoinChange,
  onPresetApply,
}: SettingsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.modeLabel}</CardTitle>
        <CardDescription>{messages.modeDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <FieldGroup className="gap-6">
          <Field className="gap-3">
            <ToggleGroup
              type="single"
              aria-label={messages.modeLabel}
              value={mode}
              onValueChange={(value) => {
                if (value === "urlset" || value === "sitemapindex") {
                  onModeChange(value)
                }
              }}
              variant="outline"
              className="w-full flex-wrap"
            >
              <ToggleGroupItem
                value="urlset"
                className="min-w-40 flex-1 justify-center"
              >
                <Globe data-icon="inline-start" />
                {messages.urlsetModeLabel}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="sitemapindex"
                className="min-w-40 flex-1 justify-center"
              >
                <LayoutGrid data-icon="inline-start" />
                {messages.sitemapIndexModeLabel}
              </ToggleGroupItem>
            </ToggleGroup>
          </Field>

          <Field>
            <FieldContent>
              <FieldLabel htmlFor="sitemap-base-url">
                {messages.baseUrlLabel}
              </FieldLabel>
              <FieldDescription>{messages.baseUrlDescription}</FieldDescription>
            </FieldContent>
            <Input
              id="sitemap-base-url"
              name="baseUrl"
              type="url"
              autoComplete="off"
              dir="ltr"
              spellCheck={false}
              className="text-left"
              value={baseUrl}
              placeholder={messages.baseUrlPlaceholder}
              onChange={(event) => {
                onBaseUrlChange(event.target.value)
              }}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="sitemap-auto-join"
              checked={autoJoin}
              onCheckedChange={(value) => {
                onAutoJoinChange(value === true)
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor="sitemap-auto-join">
                {messages.autoJoinLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.autoJoinDescription}
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldContent>
              <FieldLabel>{messages.presetsLabel}</FieldLabel>
              <FieldDescription>{messages.presetsDescription}</FieldDescription>
            </FieldContent>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onPresetApply("standard")
                }}
              >
                <Sparkles data-icon="inline-start" />
                {messages.standardPresetLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onPresetApply("content")
                }}
              >
                <Sparkles data-icon="inline-start" />
                {messages.contentPresetLabel}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onPresetApply("index")
                }}
              >
                <Sparkles data-icon="inline-start" />
                {messages.indexPresetLabel}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { SettingsCard }
