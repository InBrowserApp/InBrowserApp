"use client"

import { useEffect, useId, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import {
  DEFAULT_DESKTOP_ICON_CONFIG,
  DEFAULT_IOS_ICON_CONFIG,
  DEFAULT_PWA_ICON_CONFIG,
  DEFAULT_SITE_CONFIG,
} from "./core/favicon-assets"
import { faviconGeneratorCopy } from "./client/copy"
import { createDemoIconFile } from "./client/demo-icon"
import { generateFaviconAssets } from "./client/generate-favicon-assets"
import { IconSettingsCard } from "./client/icon-settings-card"
import { OutputCard } from "./client/output-card"
import { PreviewGallery } from "./client/preview-gallery"
import { SiteSettingsCard } from "./client/site-settings-card"
import { UploadCard } from "./client/upload-card"

import type {
  DesktopIconConfig,
  IOSIconConfig,
  PWAIconConfig,
  SiteConfig,
} from "./core/favicon-assets"
import type { GeneratedFaviconBundle } from "./client/types"

function FaviconAssetsGeneratorClient() {
  const inputId = useId()
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [site, setSite] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)
  const [desktop, setDesktop] = useState<DesktopIconConfig>(
    DEFAULT_DESKTOP_ICON_CONFIG
  )
  const [ios, setIOS] = useState<IOSIconConfig>(DEFAULT_IOS_ICON_CONFIG)
  const [pwa, setPWA] = useState<PWAIconConfig>(DEFAULT_PWA_ICON_CONFIG)
  const [bundle, setBundle] = useState<GeneratedFaviconBundle | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (!sourceFile) {
      setSourcePreviewUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(sourceFile)
    setSourcePreviewUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [sourceFile])

  useEffect(() => {
    if (!bundle) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(bundle.zipBlob)
    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [bundle])

  useEffect(() => {
    setBundle(null)
    setError(null)
  }, [sourceFile, site, desktop, ios, pwa])

  function updateSite(patch: Partial<SiteConfig>) {
    setSite((current) => ({ ...current, ...patch }))
  }

  function updateDesktop(patch: Partial<DesktopIconConfig>) {
    setDesktop((current) => ({ ...current, ...patch }))
  }

  function updateIOS(patch: Partial<IOSIconConfig>) {
    setIOS((current) => ({ ...current, ...patch }))
  }

  function updatePWA(patch: Partial<PWAIconConfig>) {
    setPWA((current) => ({ ...current, ...patch }))
  }

  function handleGenerate() {
    if (!sourceFile) {
      return
    }

    setError(null)
    setIsGenerating(true)

    void generateFaviconAssets({
      sourceFile,
      site,
      desktop,
      ios,
      pwa,
    })
      .then((nextBundle) => {
        setBundle(nextBundle)
      })
      .catch((generationError: unknown) => {
        setBundle(null)
        setError(
          generationError instanceof Error
            ? generationError.message
            : faviconGeneratorCopy.errorDescription
        )
      })
      .finally(() => {
        setIsGenerating(false)
      })
  }

  function handleUseDemoIcon() {
    setSourceFile(createDemoIconFile())
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <UploadCard
          inputId={inputId}
          onUseDemoIcon={handleUseDemoIcon}
          previewUrl={sourcePreviewUrl}
          sourceFile={sourceFile}
          onFileChange={setSourceFile}
        />
        <OutputCard
          bundle={bundle}
          downloadUrl={downloadUrl}
          hasSourceFile={Boolean(sourceFile)}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
        />
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>{faviconGeneratorCopy.errorTitle}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <PreviewGallery
        desktop={desktop}
        ios={ios}
        pwa={pwa}
        site={site}
        sourceFile={sourceFile}
        sourcePreviewUrl={sourcePreviewUrl}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SiteSettingsCard site={site} onSiteChange={updateSite} />
        <IconSettingsCard
          desktop={desktop}
          ios={ios}
          pwa={pwa}
          onDesktopChange={updateDesktop}
          onIOSChange={updateIOS}
          onPWAChange={updatePWA}
        />
      </div>
    </div>
  )
}

export default FaviconAssetsGeneratorClient
