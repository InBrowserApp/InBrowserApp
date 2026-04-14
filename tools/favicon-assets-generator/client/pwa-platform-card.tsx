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
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"

import { AssetDownloadPanel } from "./asset-download-panel"
import { faviconGeneratorCopy } from "./copy"
import { DedicatedImagePanel } from "./dedicated-image-panel"
import {
  generatePWAAnyAssetGroup,
  generatePWAMaskableAssetGroup,
} from "./generate-favicon-assets"
import { PlatformCardTabs } from "./platform-card-tabs"
import { ColorField, PercentageField } from "./setting-fields"

import type { PWAIconConfig, SiteConfig } from "../core/favicon-assets"

type PWAPlatformCardProps = Readonly<{
  pwa: PWAIconConfig
  site: SiteConfig
  sourceFile: File | null
  onPWAChange: (patch: Partial<PWAIconConfig>) => void
}>

function PWAPlatformCard({
  pwa,
  site,
  sourceFile,
  onPWAChange,
}: PWAPlatformCardProps) {
  const [tab, setTab] = useState("settings")
  const resolvedAnySourceFile = pwa.sourceFile ?? sourceFile
  const resolvedMaskableSourceFile = pwa.maskableSourceFile ?? sourceFile

  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.pwaTitle}</CardTitle>
        <CardDescription>{faviconGeneratorCopy.pwaDescription}</CardDescription>
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
          <div className="grid gap-5">
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
                  onPWAChange({ backgroundColor: value || "#FFFFFF" })
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
                      maskableBackgroundColor: value || "#FFFFFF",
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
          </div>
        ) : null}

        {tab === "dedicated" ? (
          <div className="grid gap-6">
            <DedicatedImagePanel
              inputId="favicon-pwa-dedicated"
              file={pwa.sourceFile}
              description={faviconGeneratorCopy.pwaDedicatedImageDescription}
              onFileChange={(file) => {
                onPWAChange({ sourceFile: file })
              }}
            />
            <DedicatedImagePanel
              inputId="favicon-pwa-maskable-dedicated"
              file={pwa.maskableSourceFile}
              description={
                faviconGeneratorCopy.pwaMaskableDedicatedImageDescription
              }
              onFileChange={(file) => {
                onPWAChange({ maskableSourceFile: file })
              }}
            />
          </div>
        ) : null}

        {tab === "download" ? (
          <div className="grid gap-6">
            <p className="text-sm text-muted-foreground">
              {faviconGeneratorCopy.pwaDownloadDescription}
            </p>

            <div className="grid gap-4">
              <h3 className="text-sm font-medium text-foreground">
                {faviconGeneratorCopy.standardPwaLabel}
              </h3>
              <AssetDownloadPanel
                enabled={Boolean(resolvedAnySourceFile)}
                sourceKey={JSON.stringify({
                  root: sourceFile?.name ?? "",
                  rootSize: sourceFile?.size ?? 0,
                  dedicated: pwa.sourceFile?.name ?? "",
                  dedicatedSize: pwa.sourceFile?.size ?? 0,
                  sitePath: site.assetPath,
                  addBackground: pwa.addBackground,
                  backgroundColor: pwa.backgroundColor,
                  backgroundRadius: pwa.backgroundRadius,
                  margin: pwa.margin,
                })}
                buildGroup={async () => {
                  if (!resolvedAnySourceFile) {
                    return null
                  }

                  return generatePWAAnyAssetGroup({
                    sourceFile: resolvedAnySourceFile,
                    site,
                    pwa,
                  })
                }}
                snippetLabel={faviconGeneratorCopy.manifestIconsLabel}
                copyLabel={faviconGeneratorCopy.copyManifestLabel}
              />
            </div>

            {pwa.includeMaskable ? (
              <div className="grid gap-4">
                <h3 className="text-sm font-medium text-foreground">
                  {faviconGeneratorCopy.pwaMaskableLabel}
                </h3>
                <AssetDownloadPanel
                  enabled={Boolean(resolvedMaskableSourceFile)}
                  sourceKey={JSON.stringify({
                    root: sourceFile?.name ?? "",
                    rootSize: sourceFile?.size ?? 0,
                    dedicated: pwa.maskableSourceFile?.name ?? "",
                    dedicatedSize: pwa.maskableSourceFile?.size ?? 0,
                    sitePath: site.assetPath,
                    includeMaskable: pwa.includeMaskable,
                    maskableBackgroundColor: pwa.maskableBackgroundColor,
                    maskableMargin: pwa.maskableMargin,
                  })}
                  buildGroup={async () => {
                    if (!resolvedMaskableSourceFile) {
                      return null
                    }

                    return generatePWAMaskableAssetGroup({
                      sourceFile: resolvedMaskableSourceFile,
                      site,
                      pwa,
                    })
                  }}
                  snippetLabel={faviconGeneratorCopy.manifestIconsLabel}
                  copyLabel={faviconGeneratorCopy.copyManifestLabel}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { PWAPlatformCard }
