"use client"

import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Switch } from "@workspace/ui/components/ui/switch"
import { Textarea } from "@workspace/ui/components/ui/textarea"

import type { DisplayMode, SiteConfig } from "../core/config"
import { ColorField } from "./color-field"
import type { FaviconMessages } from "./types"

type SiteInfoCardProps = Readonly<{
  messages: FaviconMessages
  siteCfg: SiteConfig
  onPatch: (patch: Partial<SiteConfig>) => void
}>

function SiteInfoCard({ messages, siteCfg, onPatch }: SiteInfoCardProps) {
  const idPrefix = useId()
  const displayOptions: readonly { value: DisplayMode; label: string }[] = [
    { value: "fullscreen", label: messages.displayFullscreen },
    { value: "standalone", label: messages.displayStandalone },
    { value: "minimal-ui", label: messages.displayMinimalUi },
    { value: "browser", label: messages.displayBrowser },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.siteInfoCardTitle}</CardTitle>
        <CardDescription>{messages.siteInfoCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-name`}>
                {messages.appNameLabel}
              </FieldLabel>
              <Input
                id={`${idPrefix}-name`}
                value={siteCfg.name}
                onChange={(event) => onPatch({ name: event.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-short-name`}>
                {messages.shortNameLabel}
              </FieldLabel>
              <Input
                id={`${idPrefix}-short-name`}
                value={siteCfg.shortName}
                onChange={(event) => onPatch({ shortName: event.target.value })}
              />
              <FieldDescription>
                {messages.shortNameDescription}
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor={`${idPrefix}-description`}>
              {messages.descriptionLabel}
            </FieldLabel>
            <Textarea
              id={`${idPrefix}-description`}
              value={siteCfg.description}
              rows={2}
              onChange={(event) => onPatch({ description: event.target.value })}
            />
            <FieldDescription>
              {messages.descriptionDescription}
            </FieldDescription>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-start-url`}>
                {messages.startUrlLabel}
              </FieldLabel>
              <Input
                id={`${idPrefix}-start-url`}
                value={siteCfg.startUrl}
                onChange={(event) => onPatch({ startUrl: event.target.value })}
              />
              <FieldDescription>
                {messages.startUrlDescription}
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor={`${idPrefix}-asset-path`}>
                {messages.assetPathLabel}
              </FieldLabel>
              <Input
                id={`${idPrefix}-asset-path`}
                value={siteCfg.assetPath}
                onChange={(event) => onPatch({ assetPath: event.target.value })}
              />
              <FieldDescription>
                {messages.assetPathDescription}
              </FieldDescription>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor={`${idPrefix}-display`}>
              {messages.displayModeLabel}
            </FieldLabel>
            <Select
              value={siteCfg.display}
              onValueChange={(value) =>
                onPatch({ display: value as DisplayMode })
              }
            >
              <SelectTrigger id={`${idPrefix}-display`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {displayOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <ColorField
            id={`${idPrefix}-theme-color`}
            label={messages.themeColorLabel}
            description={messages.themeColorDescription}
            value={siteCfg.themeColor}
            onChange={(value) => onPatch({ themeColor: value })}
          />

          <Field orientation="horizontal">
            <FieldLabel
              htmlFor={`${idPrefix}-enable-dark-theme`}
              className="flex-1"
            >
              {messages.enableDarkThemeColorLabel}
              <FieldDescription className="font-normal">
                {messages.enableDarkThemeColorDescription}
              </FieldDescription>
            </FieldLabel>
            <Switch
              id={`${idPrefix}-enable-dark-theme`}
              checked={siteCfg.enableDarkThemeColor}
              onCheckedChange={(checked) =>
                onPatch({ enableDarkThemeColor: checked })
              }
            />
          </Field>

          {siteCfg.enableDarkThemeColor ? (
            <ColorField
              id={`${idPrefix}-dark-theme-color`}
              label={messages.darkThemeColorLabel}
              value={siteCfg.darkThemeColor}
              onChange={(value) => onPatch({ darkThemeColor: value })}
            />
          ) : null}

          <ColorField
            id={`${idPrefix}-background-color`}
            label={messages.backgroundColorLabel}
            description={messages.backgroundColorDescription}
            value={siteCfg.backgroundColor}
            onChange={(value) => onPatch({ backgroundColor: value })}
          />

          <Field orientation="horizontal">
            <FieldLabel htmlFor={`${idPrefix}-optimize-png`} className="flex-1">
              {messages.optimizePngLabel}
              <FieldDescription className="font-normal">
                {messages.optimizePngDescription}
              </FieldDescription>
            </FieldLabel>
            <Switch
              id={`${idPrefix}-optimize-png`}
              checked={siteCfg.optimizePng}
              onCheckedChange={(checked) => onPatch({ optimizePng: checked })}
            />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { SiteInfoCard }
