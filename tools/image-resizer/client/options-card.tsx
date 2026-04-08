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
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
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
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Field>
              <FieldLabel htmlFor={`${inputId}-width`}>
                {messages.widthLabel}
              </FieldLabel>
              <Input
                id={`${inputId}-width`}
                type="number"
                min={1}
                value={options.width}
                onChange={(event) => {
                  updateWidth(Math.max(1, Number(event.target.value) || 1))
                }}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor={`${inputId}-height`}>
                {messages.heightLabel}
              </FieldLabel>
              <Input
                id={`${inputId}-height`}
                type="number"
                min={1}
                value={options.height}
                onChange={(event) => {
                  updateHeight(Math.max(1, Number(event.target.value) || 1))
                }}
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <Field>
              <FieldLabel>{messages.algorithmLabel}</FieldLabel>
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
                      algorithmOptions.find(
                        (o) => o.value === options.algorithm
                      )?.label
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
            </Field>

            <Field>
              <FieldLabel>{messages.formatLabel}</FieldLabel>
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
                      formatOptions.find(
                        (o) => o.value === options.outputFormat
                      )?.label
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
            </Field>
          </div>

          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldTitle>{messages.qualityLabel}</FieldTitle>
              <span className="font-mono text-sm text-muted-foreground">
                {options.quality}
              </span>
            </div>
            <Slider
              aria-label={messages.qualityLabel}
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
            <FieldDescription>{messages.qualityDescription}</FieldDescription>
          </Field>

          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor={`${inputId}-keep-aspect-ratio`}>
                {messages.keepAspectRatioLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.keepAspectRatioDescription}
              </FieldDescription>
            </FieldContent>
            <Switch
              id={`${inputId}-keep-aspect-ratio`}
              checked={options.keepAspectRatio}
              onCheckedChange={(checked) => {
                setOptions((currentOptions) => ({
                  ...currentOptions,
                  keepAspectRatio: checked,
                }))
              }}
              aria-label={messages.keepAspectRatioLabel}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id={`${inputId}-allow-upscale`}
              checked={options.allowUpscale}
              onCheckedChange={(checked) => {
                setOptions((currentOptions) => ({
                  ...currentOptions,
                  allowUpscale: Boolean(checked),
                }))
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor={`${inputId}-allow-upscale`}>
                {messages.allowUpscaleLabel}
              </FieldLabel>
              <FieldDescription>
                {messages.allowUpscaleDescription}
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
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
