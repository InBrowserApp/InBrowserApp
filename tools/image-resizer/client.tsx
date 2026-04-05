import { startTransition, useEffect, useId, useState } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"
import {
  Download,
  ImageUp,
  LoaderCircle,
  RefreshCcw,
  TriangleAlert,
} from "@workspace/ui/icons"

import {
  readImageDimensions,
  resizeImageFile,
  type ImageDimensions,
  type ResizeAlgorithm,
  type ResizeOptions,
  type ResizeOutputFormat,
  type ResizeResult,
} from "./core/resize-image"

type ImageResizerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  uploadTitle: string
  uploadDescription: string
  chooseImageLabel: string
  changeImageLabel: string
  uploadHint: string
  optionsTitle: string
  optionsDescription: string
  widthLabel: string
  heightLabel: string
  keepAspectRatioLabel: string
  keepAspectRatioDescription: string
  allowUpscaleLabel: string
  allowUpscaleDescription: string
  algorithmLabel: string
  formatLabel: string
  qualityLabel: string
  qualityDescription: string
  resizeLabel: string
  resetLabel: string
  resultTitle: string
  resultDescription: string
  downloadLabel: string
  originalLabel: string
  outputLabel: string
  emptyResultTitle: string
  emptyResultDescription: string
  invalidImageTitle: string
  invalidImageDescription: string
  resizeErrorTitle: string
  resizeErrorDescription: string
  algorithmHighQuality: string
  algorithmBalanced: string
  algorithmPixelated: string
  formatAuto: string
  formatPng: string
  formatJpeg: string
  formatWebp: string
}>

type ImageResizerClientProps = Readonly<{
  messages: ImageResizerMessages
}>

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DEFAULT_OPTIONS = {
  algorithm: "high-quality",
  allowUpscale: false,
  height: 1080,
  keepAspectRatio: true,
  outputFormat: "auto",
  quality: 92,
  width: 1920,
} as const satisfies ResizeOptions

const OPTION_STORAGE_KEY = "tools:image-resizer:options"

function ImageResizerClient({ messages }: ImageResizerClientProps) {
  const inputId = useId()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sourceDimensions, setSourceDimensions] =
    useState<ImageDimensions | null>(null)
  const [options, setOptions] = useState<ResizeOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<ResizeResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null)
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const storedOptions = window.localStorage.getItem(OPTION_STORAGE_KEY)

    if (!storedOptions) {
      return
    }

    try {
      const parsedOptions = JSON.parse(storedOptions) as Partial<ResizeOptions>

      setOptions((currentOptions) => ({
        ...currentOptions,
        ...parsedOptions,
      }))
    } catch {
      // Ignore broken storage.
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(OPTION_STORAGE_KEY, JSON.stringify(options))
  }, [options])

  useEffect(() => {
    if (!selectedFile) {
      setSourcePreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return null
      })
      return
    }

    const nextUrl = URL.createObjectURL(selectedFile)
    setSourcePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return nextUrl
    })

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [selectedFile])

  useEffect(() => {
    if (!result) {
      setResultPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl)
        }

        return null
      })
      return
    }

    const nextUrl = URL.createObjectURL(result.blob)
    setResultPreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl)
      }

      return nextUrl
    })

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [result])

  const algorithmOptions = [
    { label: messages.algorithmHighQuality, value: "high-quality" },
    { label: messages.algorithmBalanced, value: "balanced" },
    { label: messages.algorithmPixelated, value: "pixelated" },
  ] as const satisfies readonly Readonly<{
    label: string
    value: ResizeAlgorithm
  }>[]

  const formatOptions = [
    { label: messages.formatAuto, value: "auto" },
    { label: messages.formatPng, value: "png" },
    { label: messages.formatJpeg, value: "jpeg" },
    { label: messages.formatWebp, value: "webp" },
  ] as const satisfies readonly Readonly<{
    label: string
    value: ResizeOutputFormat
  }>[]

  async function handleFileChange(file: File | null) {
    setError(null)
    setResult(null)

    if (!file) {
      setSelectedFile(null)
      setSourceDimensions(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      setSelectedFile(null)
      setSourceDimensions(null)
      setError(messages.invalidImageDescription)
      return
    }

    try {
      const dimensions = await readImageDimensions(file)

      startTransition(() => {
        setSelectedFile(file)
        setSourceDimensions(dimensions)
        setOptions((currentOptions) => ({
          ...currentOptions,
          width: dimensions.width,
          height: dimensions.height,
        }))
      })
    } catch {
      setSelectedFile(null)
      setSourceDimensions(null)
      setError(messages.invalidImageDescription)
    }
  }

  function updateWidth(nextWidth: number) {
    setOptions((currentOptions) => {
      if (!sourceDimensions || !currentOptions.keepAspectRatio) {
        return {
          ...currentOptions,
          width: nextWidth,
        }
      }

      const ratio = sourceDimensions.height / sourceDimensions.width
      return {
        ...currentOptions,
        width: nextWidth,
        height: Math.max(1, Math.round(nextWidth * ratio)),
      }
    })
  }

  function updateHeight(nextHeight: number) {
    setOptions((currentOptions) => {
      if (!sourceDimensions || !currentOptions.keepAspectRatio) {
        return {
          ...currentOptions,
          height: nextHeight,
        }
      }

      const ratio = sourceDimensions.width / sourceDimensions.height
      return {
        ...currentOptions,
        width: Math.max(1, Math.round(nextHeight * ratio)),
        height: nextHeight,
      }
    })
  }

  async function runResize() {
    if (!selectedFile) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const nextResult = await resizeImageFile(selectedFile, options)
      setResult(nextResult)
    } catch {
      setResult(null)
      setError(messages.resizeErrorDescription)
    } finally {
      setIsProcessing(false)
    }
  }

  function resetOptions() {
    setResult(null)
    setError(null)
    setOptions((currentOptions) => ({
      ...DEFAULT_OPTIONS,
      width: sourceDimensions?.width ?? currentOptions.width,
      height: sourceDimensions?.height ?? currentOptions.height,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader>
            <CardTitle>{messages.uploadTitle}</CardTitle>
            <CardDescription>{messages.uploadDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            {selectedFile && sourcePreviewUrl && sourceDimensions ? (
              <>
                <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                  <img
                    src={sourcePreviewUrl}
                    alt=""
                    className="h-72 w-full object-contain"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </span>
                  <Badge variant="outline" className="font-mono">
                    {sourceDimensions.width} × {sourceDimensions.height}
                  </Badge>
                  <Badge variant="secondary">
                    {formatFileSize(selectedFile.size)}
                  </Badge>
                </div>
                <label
                  htmlFor={inputId}
                  className="inline-flex cursor-pointer text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  {messages.changeImageLabel}
                </label>
              </>
            ) : (
              <label
                htmlFor={inputId}
                className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-6 py-8 text-center transition-colors hover:border-foreground/20 hover:bg-muted/45"
              >
                <ImageUp className="size-6 text-muted-foreground" />
                <div className="mt-4 space-y-1">
                  <p className="font-medium text-foreground">
                    {messages.chooseImageLabel}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {messages.uploadHint}
                  </p>
                </div>
              </label>
            )}
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                void handleFileChange(event.target.files?.[0] ?? null)
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{messages.optionsTitle}</CardTitle>
            <CardDescription>{messages.optionsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor={`${inputId}-width`}>
                  {messages.widthLabel}
                </Label>
                <Input
                  id={`${inputId}-width`}
                  type="number"
                  min={1}
                  value={options.width}
                  onChange={(event) => {
                    updateWidth(Math.max(1, Number(event.target.value) || 1))
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${inputId}-height`}>
                  {messages.heightLabel}
                </Label>
                <Input
                  id={`${inputId}-height`}
                  type="number"
                  min={1}
                  value={options.height}
                  onChange={(event) => {
                    updateHeight(Math.max(1, Number(event.target.value) || 1))
                  }}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
              <div className="space-y-2">
                <Label>{messages.algorithmLabel}</Label>
                <Select
                  value={options.algorithm}
                  onValueChange={(value) => {
                    setOptions((currentOptions) => ({
                      ...currentOptions,
                      algorithm: value as ResizeAlgorithm,
                    }))
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{messages.algorithmLabel}</SelectLabel>
                      {algorithmOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{messages.formatLabel}</Label>
                <Select
                  value={options.outputFormat}
                  onValueChange={(value) => {
                    setOptions((currentOptions) => ({
                      ...currentOptions,
                      outputFormat: value as ResizeOutputFormat,
                    }))
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{messages.formatLabel}</SelectLabel>
                      {formatOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{messages.qualityLabel}</Label>
                <span className="font-mono text-sm text-muted-foreground">
                  {options.quality}
                </span>
              </div>
              <Slider
                min={1}
                max={100}
                value={[options.quality]}
                onValueChange={([value]) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    quality: value,
                  }))
                }}
              />
              <p className="text-sm leading-6 text-muted-foreground">
                {messages.qualityDescription}
              </p>
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label>{messages.keepAspectRatioLabel}</Label>
                <p className="text-sm leading-6 text-muted-foreground">
                  {messages.keepAspectRatioDescription}
                </p>
              </div>
              <Switch
                checked={options.keepAspectRatio}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    keepAspectRatio: checked,
                  }))
                }}
                aria-label={messages.keepAspectRatioLabel}
              />
            </div>

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <Label>{messages.allowUpscaleLabel}</Label>
                <p className="text-sm leading-6 text-muted-foreground">
                  {messages.allowUpscaleDescription}
                </p>
              </div>
              <Switch
                checked={options.allowUpscale}
                onCheckedChange={(checked) => {
                  setOptions((currentOptions) => ({
                    ...currentOptions,
                    allowUpscale: checked,
                  }))
                }}
                aria-label={messages.allowUpscaleLabel}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetOptions}
            >
              <RefreshCcw data-icon="inline-start" />
              {messages.resetLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!selectedFile || isProcessing}
              onClick={() => {
                void runResize()
              }}
            >
              {isProcessing ? (
                <LoaderCircle
                  data-icon="inline-start"
                  className="animate-spin"
                />
              ) : null}
              {messages.resizeLabel}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {error ? (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {selectedFile
              ? messages.resizeErrorTitle
              : messages.invalidImageTitle}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{messages.resultTitle}</CardTitle>
          <CardDescription>{messages.resultDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {result &&
          resultPreviewUrl &&
          sourcePreviewUrl &&
          sourceDimensions ? (
            <>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {messages.originalLabel}
                    </span>
                    <Badge variant="outline" className="font-mono">
                      {sourceDimensions.width} × {sourceDimensions.height}
                    </Badge>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                    <img
                      src={sourcePreviewUrl}
                      alt=""
                      className="h-72 w-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {messages.outputLabel}
                    </span>
                    <Badge variant="outline" className="font-mono">
                      {result.outputWidth} × {result.outputHeight}
                    </Badge>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                    <img
                      src={resultPreviewUrl}
                      alt=""
                      className="h-72 w-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{result.mimeType}</Badge>
                <Badge variant="secondary">
                  {formatFileSize(result.blob.size)}
                </Badge>
              </div>
            </>
          ) : (
            <Alert>
              <ImageUp />
              <AlertTitle>{messages.emptyResultTitle}</AlertTitle>
              <AlertDescription>
                {messages.emptyResultDescription}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        {result && resultPreviewUrl ? (
          <CardFooter className="justify-end">
            <Button asChild>
              <a href={resultPreviewUrl} download={result.outputName}>
                <Download data-icon="inline-start" />
                {messages.downloadLabel}
              </a>
            </Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}

export default ImageResizerClient
