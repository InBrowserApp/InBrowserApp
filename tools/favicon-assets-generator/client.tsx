"use client"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { DesktopCard } from "./client/desktop-card"
import { IosCard } from "./client/ios-card"
import { PreviewGallery } from "./client/preview-gallery"
import { PwaCard } from "./client/pwa-card"
import { ResultCard } from "./client/result-card"
import { SiteInfoCard } from "./client/site-info-card"
import type { FaviconMessages } from "./client/types"
import { UploadCard } from "./client/upload-card"
import { useFaviconGenerator } from "./client/use-favicon-generator"

type FaviconAssetsGeneratorClientProps = Readonly<{
  messages: FaviconMessages
}>

function FaviconAssetsGeneratorClient({
  messages,
}: FaviconAssetsGeneratorClientProps) {
  const {
    globalSource,
    dedicatedSources,
    siteCfg,
    desktopCfg,
    iosCfg,
    pwaCfg,
    isGenerating,
    bundle,
    error,
    canGenerate,
    handleGlobalFile,
    handleDedicatedFile,
    useDemo,
    patchSite,
    patchDesktop,
    patchIos,
    patchPwa,
    resetOptions,
    generate,
  } = useFaviconGenerator(messages)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <UploadCard
          messages={messages}
          source={globalSource}
          onFileChange={handleGlobalFile}
          onUseDemo={useDemo}
        />
        <SiteInfoCard
          messages={messages}
          siteCfg={siteCfg}
          onPatch={patchSite}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <DesktopCard
          messages={messages}
          cfg={desktopCfg}
          onPatch={patchDesktop}
          dedicatedSource={dedicatedSources.desktop}
          onDedicatedFileChange={(file) => handleDedicatedFile("desktop", file)}
        />
        <IosCard
          messages={messages}
          cfg={iosCfg}
          onPatch={patchIos}
          dedicatedSource={dedicatedSources.ios}
          onDedicatedFileChange={(file) => handleDedicatedFile("ios", file)}
        />
        <PwaCard
          messages={messages}
          cfg={pwaCfg}
          onPatch={patchPwa}
          dedicatedSource={dedicatedSources.pwa}
          onDedicatedFileChange={(file) => handleDedicatedFile("pwa", file)}
        />
      </div>

      <PreviewGallery
        messages={messages}
        appName={siteCfg.name || messages.meta.name}
        themeColor={siteCfg.themeColor}
        bundle={bundle}
        globalSource={globalSource}
      />

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{resolveErrorTitle(error.code, messages)}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <ResultCard
        messages={messages}
        bundle={bundle}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        onGenerate={generate}
        onReset={resetOptions}
      />
    </div>
  )
}

function resolveErrorTitle(
  code: ReturnType<typeof useFaviconGenerator>["error"] extends infer T
    ? T extends { code: infer C }
      ? C
      : never
    : never,
  messages: FaviconMessages
): string {
  switch (code) {
    case "needs-image":
      return messages.needImageTitle
    case "needs-app-name":
      return messages.needAppNameTitle
    case "invalid-image":
      return messages.invalidImageTitle
    case "missing-dedicated-image":
      return messages.missingDedicatedImageTitle
    case "canvas-unavailable":
    case "generation-failed":
    default:
      return messages.generationFailedTitle
  }
}

export default FaviconAssetsGeneratorClient
