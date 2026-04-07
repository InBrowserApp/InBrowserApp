import type { Dispatch, SetStateAction } from "react"

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
import { LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import type {
  ResizeAlgorithm,
  ResizeOptions,
  ResizeOutputFormat,
} from "../core/resize-image"
import type { ImageResizerMessages } from "./types"

type OptionsCardProps = Readonly<{
  inputId: string
  isProcessing: boolean
  messages: ImageResizerMessages
  onReset: () => void
  onResize: () => void
  options: ResizeOptions
  selectedFile: File | null
  setOptions: Dispatch<SetStateAction<ResizeOptions>>
  updateHeight: (next: number) => void
  updateWidth: (next: number) => void
}>

export function OptionsCard({
  inputId,
  isProcessing,
  messages,
  onReset,
  onResize,
  options,
  selectedFile,
  setOptions,
  updateHeight,
  updateWidth,
}: OptionsCardProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor={`${inputId}-width`}>{messages.widthLabel}</Label>
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
            <Label htmlFor={`${inputId}-height`}>{messages.heightLabel}</Label>
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
          <div className="flex flex-col gap-2">
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
                <SelectValue>
                  {
                    algorithmOptions.find((o) => o.value === options.algorithm)
                      ?.label
                  }
                </SelectValue>
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

          <div className="flex flex-col gap-2">
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
                <SelectValue>
                  {
                    formatOptions.find((o) => o.value === options.outputFormat)
                      ?.label
                  }
                </SelectValue>
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
              if (value === undefined) return
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
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RefreshCcw data-icon="inline-start" />
          {messages.resetLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!selectedFile || isProcessing}
          onClick={() => {
            void onResize()
          }}
        >
          {isProcessing ? (
            <LoaderCircle data-icon="inline-start" className="animate-spin" />
          ) : null}
          {messages.resizeLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
