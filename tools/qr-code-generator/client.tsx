import { useDeferredValue, useEffect, useMemo, useState } from "react"

import {
  DEFAULT_QR_GENERATOR_OPTIONS,
  normalizeQrGeneratorOptions,
  parseStoredQrGeneratorOptions,
} from "./core/options"
import { buildQrPayload } from "./core/payload"
import { DEFAULT_QR_CONTENT_STATE } from "./core/content"
import { STORAGE_KEY } from "./client/constants"
import { ContentCard } from "./client/content-card"
import { OptionsCard } from "./client/options-card"
import { PreviewCard } from "./client/preview-card"
import { renderQrImageBlob, renderQrSvgMarkup } from "./client/render"

import type { QrCodeGeneratorMessages } from "./client/types"
import type { QrContentState, QrContentType } from "./core/content"
import type { QrGeneratorOptions } from "./core/options"

type QrCodeGeneratorClientProps = Readonly<{
  messages: QrCodeGeneratorMessages
}>

function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  return url
}

function QrCodeGeneratorClient({ messages }: QrCodeGeneratorClientProps) {
  const [contentType, setContentType] = useState<QrContentType>("text")
  const [content, setContent] = useState(DEFAULT_QR_CONTENT_STATE)
  const [options, setOptions] = useState(DEFAULT_QR_GENERATOR_OPTIONS)
  const [svgMarkup, setSvgMarkup] = useState("")
  const [pngBlob, setPngBlob] = useState<Blob | null>(null)
  const [jpgBlob, setJpgBlob] = useState<Blob | null>(null)
  const [webpBlob, setWebpBlob] = useState<Blob | null>(null)
  const [error, setError] = useState("")
  const [isRendering, setIsRendering] = useState(false)
  const payloadResult = useMemo(
    () => buildQrPayload(contentType, content),
    [content, contentType]
  )
  const deferredPayload = useDeferredValue(payloadResult.payload)
  const deferredOptions = useDeferredValue(options)

  useEffect(() => {
    const storedOptions = parseStoredQrGeneratorOptions(
      window.localStorage.getItem(STORAGE_KEY)
    )

    if (storedOptions) {
      setOptions(storedOptions)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    let cancelled = false

    if (!deferredPayload) {
      setSvgMarkup("")
      setPngBlob(null)
      setJpgBlob(null)
      setWebpBlob(null)
      setError("")
      setIsRendering(false)
      return
    }

    setIsRendering(true)
    setError("")

    void (async () => {
      try {
        const [svg, png, jpg, webp] = await Promise.all([
          renderQrSvgMarkup(deferredPayload, deferredOptions),
          renderQrImageBlob(deferredPayload, deferredOptions, "image/png"),
          renderQrImageBlob(deferredPayload, deferredOptions, "image/jpeg"),
          renderQrImageBlob(deferredPayload, deferredOptions, "image/webp"),
        ])

        if (!cancelled) {
          setSvgMarkup(svg)
          setPngBlob(png)
          setJpgBlob(jpg)
          setWebpBlob(webp)
        }
      } catch (renderError) {
        if (!cancelled) {
          setSvgMarkup("")
          setPngBlob(null)
          setJpgBlob(null)
          setWebpBlob(null)
          setError(
            renderError instanceof Error
              ? renderError.message
              : "Failed to render QR code."
          )
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [deferredOptions, deferredPayload])

  const svgBlob = useMemo(
    () =>
      svgMarkup
        ? new Blob([svgMarkup], {
            type: "image/svg+xml",
          })
        : null,
    [svgMarkup]
  )
  const jpgUrl = useObjectUrl(jpgBlob)
  const pngUrl = useObjectUrl(pngBlob)
  const svgUrl = useObjectUrl(svgBlob)
  const webpUrl = useObjectUrl(webpBlob)
  const previewUrl = useMemo(
    () =>
      svgMarkup
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`
        : null,
    [svgMarkup]
  )

  function updateOptions(nextOptions: Partial<QrGeneratorOptions>) {
    setOptions((currentOptions) =>
      normalizeQrGeneratorOptions({ ...currentOptions, ...nextOptions })
    )
  }

  function updateContent<TSection extends keyof QrContentState>(
    section: TSection,
    value: QrContentState[TSection]
  ) {
    setContent((currentContent) => ({
      ...currentContent,
      [section]: value,
    }))
  }

  return (
    <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <div className="grid gap-6">
        <ContentCard
          content={content}
          handlers={{
            onCalendarChange: (key, value) =>
              updateContent("calendar", { ...content.calendar, [key]: value }),
            onContactChange: (key, value) =>
              updateContent("contact", { ...content.contact, [key]: value }),
            onEmailChange: (key, value) =>
              updateContent("email", { ...content.email, [key]: value }),
            onLocationChange: (key, value) =>
              updateContent("location", { ...content.location, [key]: value }),
            onPhoneChange: (value) => updateContent("phone", value),
            onSmsChange: (key, value) =>
              updateContent("sms", { ...content.sms, [key]: value }),
            onTextChange: (value) => updateContent("text", value),
            onTypeChange: setContentType,
            onWifiChange: (key, value) =>
              updateContent("wifi", { ...content.wifi, [key]: value }),
          }}
          messages={messages}
          missing={payloadResult.missing}
          payload={payloadResult.payload}
          type={contentType}
        />
        <OptionsCard
          handlers={{
            onColorChange: (key, value) => updateOptions({ [key]: value }),
            onErrorCorrectionChange: (value) =>
              updateOptions({ errorCorrectionLevel: value }),
            onNumberChange: (key, value) => updateOptions({ [key]: value }),
          }}
          messages={messages}
          options={options}
        />
      </div>
      <PreviewCard
        error={error}
        isRendering={isRendering}
        jpgUrl={jpgUrl}
        messages={messages}
        missing={Boolean(payloadResult.missing)}
        pngUrl={pngUrl}
        previewUrl={previewUrl}
        svgUrl={svgUrl}
        webpUrl={webpUrl}
      />
    </div>
  )
}

export default QrCodeGeneratorClient
