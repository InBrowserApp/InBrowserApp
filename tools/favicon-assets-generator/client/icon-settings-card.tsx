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
  FieldSeparator,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
} from "../core/favicon-assets"
import { faviconGeneratorCopy } from "./copy"
import { ColorField, PercentageField } from "./setting-fields"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
} from "../core/favicon-assets"

type IconSettingsCardProps = Readonly<{
  desktop: DesktopIconConfig
  ios: IOSIconConfig
  pwa: PWAIconConfig
  onDesktopChange: (patch: Partial<DesktopIconConfig>) => void
  onIOSChange: (patch: Partial<IOSIconConfig>) => void
  onPWAChange: (patch: Partial<PWAIconConfig>) => void
}>

function IconSettingsCard({
  desktop,
  ios,
  pwa,
  onDesktopChange,
  onIOSChange,
  onPWAChange,
}: IconSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.desktopTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.desktopDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="favicon-desktop-original">
                {faviconGeneratorCopy.keepOriginalSvgLabel}
              </FieldLabel>
              <FieldDescription>
                {faviconGeneratorCopy.keepOriginalSvgDescription}
              </FieldDescription>
            </FieldContent>
            <Switch
              id="favicon-desktop-original"
              checked={desktop.useOriginalSvg}
              onCheckedChange={(checked) => {
                onDesktopChange({ useOriginalSvg: checked })
              }}
              aria-label={faviconGeneratorCopy.keepOriginalSvgLabel}
            />
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="favicon-desktop-background">
                {faviconGeneratorCopy.desktopBackgroundLabel}
              </FieldLabel>
            </FieldContent>
            <Switch
              id="favicon-desktop-background"
              checked={desktop.addBackground}
              onCheckedChange={(checked) => {
                onDesktopChange({ addBackground: checked })
              }}
              aria-label={faviconGeneratorCopy.desktopBackgroundLabel}
            />
          </Field>

          {desktop.addBackground ? (
            <ColorField
              id="favicon-desktop-background-color"
              label={faviconGeneratorCopy.desktopBackgroundColorLabel}
              value={desktop.backgroundColor}
              onChange={(value) => {
                onDesktopChange({
                  backgroundColor:
                    value || DEFAULT_DESKTOP_ICON_CONFIG.backgroundColor,
                })
              }}
            />
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <PercentageField
              id="favicon-desktop-radius"
              label={faviconGeneratorCopy.desktopBackgroundRadiusLabel}
              suffix={faviconGeneratorCopy.sliderSuffix}
              value={desktop.backgroundRadius}
              onChange={(value) => {
                onDesktopChange({ backgroundRadius: value })
              }}
            />
            <PercentageField
              id="favicon-desktop-margin"
              label={faviconGeneratorCopy.desktopMarginLabel}
              suffix={faviconGeneratorCopy.sliderSuffix}
              value={desktop.margin}
              onChange={(value) => {
                onDesktopChange({ margin: value })
              }}
            />
          </div>

          <FieldSeparator>iOS</FieldSeparator>

          <p className="text-sm text-muted-foreground">
            {faviconGeneratorCopy.iosDescription}
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <ColorField
              id="favicon-ios-background-color"
              label={faviconGeneratorCopy.iosBackgroundColorLabel}
              value={ios.backgroundColor}
              onChange={(value) => {
                onIOSChange({
                  backgroundColor:
                    value || DEFAULT_IOS_ICON_CONFIG.backgroundColor,
                })
              }}
            />
            <PercentageField
              id="favicon-ios-margin"
              label={faviconGeneratorCopy.iosMarginLabel}
              suffix={faviconGeneratorCopy.sliderSuffix}
              value={ios.margin}
              onChange={(value) => {
                onIOSChange({ margin: value })
              }}
            />
          </div>

          <FieldSeparator>PWA</FieldSeparator>

          <p className="text-sm text-muted-foreground">
            {faviconGeneratorCopy.pwaDescription}
          </p>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="favicon-pwa-background">
                {faviconGeneratorCopy.pwaBackgroundLabel}
              </FieldLabel>
            </FieldContent>
            <Switch
              id="favicon-pwa-background"
              checked={pwa.addBackground}
              onCheckedChange={(checked) => {
                onPWAChange({ addBackground: checked })
              }}
              aria-label={faviconGeneratorCopy.pwaBackgroundLabel}
            />
          </Field>

          {pwa.addBackground ? (
            <ColorField
              id="favicon-pwa-background-color"
              label={faviconGeneratorCopy.pwaBackgroundColorLabel}
              value={pwa.backgroundColor}
              onChange={(value) => {
                onPWAChange({
                  backgroundColor:
                    value || DEFAULT_PWA_ICON_CONFIG.backgroundColor,
                })
              }}
            />
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            <PercentageField
              id="favicon-pwa-radius"
              label={faviconGeneratorCopy.pwaBackgroundRadiusLabel}
              suffix={faviconGeneratorCopy.sliderSuffix}
              value={pwa.backgroundRadius}
              onChange={(value) => {
                onPWAChange({ backgroundRadius: value })
              }}
            />
            <PercentageField
              id="favicon-pwa-margin"
              label={faviconGeneratorCopy.pwaMarginLabel}
              suffix={faviconGeneratorCopy.sliderSuffix}
              value={pwa.margin}
              onChange={(value) => {
                onPWAChange({ margin: value })
              }}
            />
          </div>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="favicon-maskable-toggle">
                {faviconGeneratorCopy.maskableLabel}
              </FieldLabel>
            </FieldContent>
            <Switch
              id="favicon-maskable-toggle"
              checked={pwa.includeMaskable}
              onCheckedChange={(checked) => {
                onPWAChange({ includeMaskable: checked })
              }}
              aria-label={faviconGeneratorCopy.maskableLabel}
            />
          </Field>

          {pwa.includeMaskable ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <ColorField
                id="favicon-maskable-background-color"
                label={faviconGeneratorCopy.maskableBackgroundColorLabel}
                value={pwa.maskableBackgroundColor}
                onChange={(value) => {
                  onPWAChange({
                    maskableBackgroundColor:
                      value || DEFAULT_PWA_ICON_CONFIG.maskableBackgroundColor,
                  })
                }}
              />
              <PercentageField
                id="favicon-maskable-margin"
                label={faviconGeneratorCopy.maskableMarginLabel}
                suffix={faviconGeneratorCopy.sliderSuffix}
                value={pwa.maskableMargin}
                onChange={(value) => {
                  onPWAChange({ maskableMargin: value })
                }}
              />
            </div>
          ) : null}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { IconSettingsCard }
