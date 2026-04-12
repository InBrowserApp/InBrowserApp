import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import { DEFAULT_SITE_CONFIG } from "../core/favicon-assets"
import { faviconGeneratorCopy } from "./copy"
import { ColorField } from "./setting-fields"

import type { DisplayMode, SiteConfig } from "../core/favicon-assets"

type SiteSettingsCardProps = Readonly<{
  site: SiteConfig
  onSiteChange: (patch: Partial<SiteConfig>) => void
}>

const DISPLAY_OPTIONS = [
  {
    label: faviconGeneratorCopy.displayStandalone,
    value: "standalone",
  },
  {
    label: faviconGeneratorCopy.displayMinimalUi,
    value: "minimal-ui",
  },
  {
    label: faviconGeneratorCopy.displayBrowser,
    value: "browser",
  },
  {
    label: faviconGeneratorCopy.displayFullscreen,
    value: "fullscreen",
  },
] as const satisfies readonly Readonly<{
  label: string
  value: DisplayMode
}>[]

function SiteSettingsCard({ site, onSiteChange }: SiteSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.siteTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.siteDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="favicon-site-name">
                {faviconGeneratorCopy.siteNameLabel}
              </FieldLabel>
              <Input
                id="favicon-site-name"
                value={site.name}
                onChange={(event) => {
                  onSiteChange({ name: event.target.value })
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="favicon-site-short-name">
                {faviconGeneratorCopy.siteShortNameLabel}
              </FieldLabel>
              <Input
                id="favicon-site-short-name"
                value={site.shortName}
                onChange={(event) => {
                  onSiteChange({ shortName: event.target.value })
                }}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="favicon-site-description">
              {faviconGeneratorCopy.siteDescriptionLabel}
            </FieldLabel>
            <Textarea
              id="favicon-site-description"
              value={site.description}
              onChange={(event) => {
                onSiteChange({ description: event.target.value })
              }}
            />
          </Field>

          <div className="grid gap-4 lg:grid-cols-3">
            <Field>
              <FieldLabel htmlFor="favicon-start-url">
                {faviconGeneratorCopy.startUrlLabel}
              </FieldLabel>
              <Input
                id="favicon-start-url"
                value={site.startUrl}
                spellCheck={false}
                onChange={(event) => {
                  onSiteChange({ startUrl: event.target.value })
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="favicon-asset-path">
                {faviconGeneratorCopy.assetPathLabel}
              </FieldLabel>
              <Input
                id="favicon-asset-path"
                value={site.assetPath}
                spellCheck={false}
                onChange={(event) => {
                  onSiteChange({ assetPath: event.target.value })
                }}
              />
              <FieldDescription>
                {faviconGeneratorCopy.assetPathDescription}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel>{faviconGeneratorCopy.displayLabel}</FieldLabel>
              <Select
                value={site.display}
                onValueChange={(value) => {
                  onSiteChange({ display: value as DisplayMode })
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    {
                      DISPLAY_OPTIONS.find(
                        (option) => option.value === site.display
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>
                      {faviconGeneratorCopy.displayLabel}
                    </SelectLabel>
                    {DISPLAY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ColorField
              id="favicon-theme-color"
              label={faviconGeneratorCopy.themeColorLabel}
              value={site.themeColor}
              onChange={(value) => {
                onSiteChange({
                  themeColor: value || DEFAULT_SITE_CONFIG.themeColor,
                })
              }}
            />

            <ColorField
              id="favicon-background-color"
              label={faviconGeneratorCopy.backgroundColorLabel}
              value={site.backgroundColor}
              onChange={(value) => {
                onSiteChange({
                  backgroundColor: value || DEFAULT_SITE_CONFIG.backgroundColor,
                })
              }}
            />
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="favicon-dark-theme-toggle">
                {faviconGeneratorCopy.enableDarkThemeColorLabel}
              </FieldLabel>
            </FieldContent>
            <Switch
              id="favicon-dark-theme-toggle"
              checked={site.enableDarkThemeColor}
              onCheckedChange={(checked) => {
                onSiteChange({ enableDarkThemeColor: checked })
              }}
              aria-label={faviconGeneratorCopy.enableDarkThemeColorLabel}
            />
          </Field>

          {site.enableDarkThemeColor ? (
            <ColorField
              id="favicon-dark-theme-color"
              label={faviconGeneratorCopy.darkThemeColorLabel}
              value={site.darkThemeColor}
              onChange={(value) => {
                onSiteChange({
                  darkThemeColor: value || DEFAULT_SITE_CONFIG.darkThemeColor,
                })
              }}
            />
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { SiteSettingsCard }
