import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { AssetDownloadPanel } from "./asset-download-panel"
import { faviconGeneratorCopy } from "./copy"
import { DedicatedImagePanel } from "./dedicated-image-panel"
import { generateIOSAssetGroup } from "./generate-favicon-assets"
import { PlatformCardTabs } from "./platform-card-tabs"
import { ColorField, PercentageField } from "./setting-fields"

import type { IOSIconConfig, SiteConfig } from "../core/favicon-assets"

type IOSPlatformCardProps = Readonly<{
  ios: IOSIconConfig
  site: SiteConfig
  sourceFile: File | null
  onIOSChange: (patch: Partial<IOSIconConfig>) => void
}>

function IOSPlatformCard({
  ios,
  site,
  sourceFile,
  onIOSChange,
}: IOSPlatformCardProps) {
  const [tab, setTab] = useState("settings")
  const resolvedSourceFile = ios.sourceFile ?? sourceFile

  return (
    <Card>
      <CardHeader>
        <CardTitle>{faviconGeneratorCopy.iosTitle}</CardTitle>
        <CardDescription>{faviconGeneratorCopy.iosDescription}</CardDescription>
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
          <div className="grid gap-4 lg:grid-cols-2">
            <ColorField
              id="favicon-ios-background-color"
              label={faviconGeneratorCopy.iosBackgroundColorLabel}
              value={ios.backgroundColor}
              onChange={(value) => {
                onIOSChange({ backgroundColor: value || "#FFFFFF" })
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
        ) : null}

        {tab === "dedicated" ? (
          <DedicatedImagePanel
            inputId="favicon-ios-dedicated"
            file={ios.sourceFile}
            description={faviconGeneratorCopy.iosDedicatedImageDescription}
            onFileChange={(file) => {
              onIOSChange({ sourceFile: file })
            }}
          />
        ) : null}

        {tab === "download" ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              {faviconGeneratorCopy.iosDownloadDescription}
            </p>
            <AssetDownloadPanel
              enabled={Boolean(resolvedSourceFile)}
              sourceKey={JSON.stringify({
                root: sourceFile?.name ?? "",
                rootSize: sourceFile?.size ?? 0,
                dedicated: ios.sourceFile?.name ?? "",
                dedicatedSize: ios.sourceFile?.size ?? 0,
                sitePath: site.assetPath,
                backgroundColor: ios.backgroundColor,
                margin: ios.margin,
              })}
              buildGroup={async () => {
                if (!resolvedSourceFile) {
                  return null
                }

                return generateIOSAssetGroup({
                  sourceFile: resolvedSourceFile,
                  site,
                  ios,
                })
              }}
              snippetLabel={faviconGeneratorCopy.iosSnippetLabel}
              copyLabel={faviconGeneratorCopy.copyHeadLabel}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export { IOSPlatformCard }
