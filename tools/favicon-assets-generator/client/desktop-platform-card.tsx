import { useState } from "react"

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
import { Switch } from "@workspace/ui/components/ui/switch"

import { AssetDownloadPanel } from "./asset-download-panel"
import { faviconGeneratorCopy } from "./copy"
import { DedicatedImagePanel } from "./dedicated-image-panel"
import { generateDesktopAssetGroup } from "./generate-favicon-assets"
import { PlatformCardTabs } from "./platform-card-tabs"
import { ColorField, PercentageField } from "./setting-fields"

import type { DesktopIconConfig, SiteConfig } from "../core/favicon-assets"

type DesktopPlatformCardProps = Readonly<{
  desktop: DesktopIconConfig
  site: SiteConfig
  sourceFile: File | null
  onDesktopChange: (patch: Partial<DesktopIconConfig>) => void
}>

function DesktopPlatformCard({
  desktop,
  site,
  sourceFile,
  onDesktopChange,
}: DesktopPlatformCardProps) {
  const [tab, setTab] = useState("settings")
  const resolvedSourceFile = desktop.sourceFile ?? sourceFile

  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.desktopTitle}</CardTitle>
        <CardDescription>
          {faviconGeneratorCopy.desktopDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <PlatformCardTabs
          value={tab}
          onValueChange={setTab}
          tabs={[
            {
              value: "settings",
              label: faviconGeneratorCopy.settingsTabLabel,
            },
            {
              value: "dedicated",
              label: faviconGeneratorCopy.dedicatedImageTabLabel,
            },
            {
              value: "download",
              label: faviconGeneratorCopy.downloadSeparatelyTabLabel,
            },
          ]}
        />

        {tab === "settings" ? (
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
                  onDesktopChange({ backgroundColor: value || "#FFFFFF" })
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
          </FieldGroup>
        ) : null}

        {tab === "dedicated" ? (
          <DedicatedImagePanel
            inputId="favicon-desktop-dedicated"
            file={desktop.sourceFile}
            description={faviconGeneratorCopy.desktopDedicatedImageDescription}
            onFileChange={(file) => {
              onDesktopChange({ sourceFile: file })
            }}
          />
        ) : null}

        {tab === "download" ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {faviconGeneratorCopy.desktopDownloadDescription}
            </p>
            <AssetDownloadPanel
              enabled={Boolean(resolvedSourceFile)}
              sourceKey={JSON.stringify({
                root: sourceFile?.name ?? "",
                rootSize: sourceFile?.size ?? 0,
                dedicated: desktop.sourceFile?.name ?? "",
                dedicatedSize: desktop.sourceFile?.size ?? 0,
                sitePath: site.assetPath,
                useOriginalSvg: desktop.useOriginalSvg,
                addBackground: desktop.addBackground,
                backgroundColor: desktop.backgroundColor,
                backgroundRadius: desktop.backgroundRadius,
                margin: desktop.margin,
              })}
              buildGroup={async () => {
                if (!resolvedSourceFile) {
                  return null
                }

                return generateDesktopAssetGroup({
                  sourceFile: resolvedSourceFile,
                  site,
                  desktop,
                })
              }}
              snippetLabel={faviconGeneratorCopy.desktopSnippetLabel}
              copyLabel={faviconGeneratorCopy.copyHeadLabel}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { DesktopPlatformCard }
