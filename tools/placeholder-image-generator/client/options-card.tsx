import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldSeparator,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { Download } from "@workspace/ui/icons"

import { PLACEHOLDER_PRESETS } from "../core/placeholder-image"
import {
  ColorField,
  NumberField,
  OptionPills,
  SliderField,
} from "./form-fields"

import type {
  PlaceholderOptions,
  PlaceholderScale,
} from "../core/placeholder-image"
import type {
  PlaceholderBackgroundChoice,
  PlaceholderImageGeneratorMessages,
  PlaceholderOptionHandlers,
} from "./types"

type OptionsCardProps = Readonly<{
  activePresetLabel: string
  backgroundChoices: readonly PlaceholderBackgroundChoice[]
  downloads: ReadonlyArray<{
    download: string
    href: string | null
    label: string
  }>
  error: string
  handlers: PlaceholderOptionHandlers
  messages: PlaceholderImageGeneratorMessages
  options: PlaceholderOptions
  quality: number
  scale: PlaceholderScale
}>

function DownloadButton({
  download,
  href,
  label,
}: Readonly<{
  download: string
  href: string | null
  label: string
}>) {
  if (href) {
    return (
      <Button asChild variant="outline">
        <a download={download} href={href}>
          <Download data-icon="inline-start" />
          {label}
        </a>
      </Button>
    )
  }

  return (
    <Button disabled variant="outline">
      <Download data-icon="inline-start" />
      {label}
    </Button>
  )
}

function OptionsCard({
  activePresetLabel,
  backgroundChoices,
  downloads,
  error,
  handlers,
  messages,
  options,
  quality,
  scale,
}: OptionsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Field className="gap-4">
          <FieldTitle>{messages.dimensionsTitle}</FieldTitle>
          <FieldDescription>{messages.dimensionsDescription}</FieldDescription>
          <OptionPills
            onChange={(presetId) => {
              const preset = PLACEHOLDER_PRESETS.find(
                (candidate) => candidate.id === presetId
              )

              if (!preset) {
                return
              }

              handlers.onPresetSelect(preset.width, preset.height)
            }}
            options={PLACEHOLDER_PRESETS.map((preset) => ({
              label: preset.label,
              value: preset.id,
            }))}
            value={
              PLACEHOLDER_PRESETS.find(
                (preset) =>
                  preset.width === options.width &&
                  preset.height === options.height
              )?.id ?? ""
            }
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              id="placeholder-width"
              label={messages.widthLabel}
              min={1}
              onChange={(value) => {
                handlers.onOptionChange("width", value)
              }}
              value={options.width}
            />
            <NumberField
              id="placeholder-height"
              label={messages.heightLabel}
              min={1}
              onChange={(value) => {
                handlers.onOptionChange("height", value)
              }}
              value={options.height}
            />
          </div>
        </Field>

        <FieldSeparator />

        <div className="grid gap-6 xl:grid-cols-2">
          <Field className="gap-4">
            <FieldTitle>{messages.backgroundTitle}</FieldTitle>
            <FieldDescription>
              {messages.backgroundDescription}
            </FieldDescription>
            <OptionPills
              onChange={(value) => {
                handlers.onOptionChange("backgroundType", value)
              }}
              options={backgroundChoices}
              value={options.backgroundType}
            />
            {options.backgroundType === "solid" ? (
              <ColorField
                label={messages.backgroundColorLabel}
                onChange={(value) => {
                  handlers.onOptionChange("backgroundColor", value)
                }}
                value={options.backgroundColor}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <ColorField
                  label={messages.gradientColor1Label}
                  onChange={(value) => {
                    handlers.onOptionChange("gradientColor1", value)
                  }}
                  value={options.gradientColor1}
                />
                <ColorField
                  label={messages.gradientColor2Label}
                  onChange={(value) => {
                    handlers.onOptionChange("gradientColor2", value)
                  }}
                  value={options.gradientColor2}
                />
                {options.backgroundType === "linear-gradient" ? (
                  <div className="sm:col-span-2">
                    <SliderField
                      label={messages.gradientAngleLabel}
                      max={360}
                      min={0}
                      onValueChange={(value) => {
                        handlers.onOptionChange("gradientAngle", value)
                      }}
                      suffix="°"
                      value={options.gradientAngle}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </Field>

          <Field className="gap-4">
            <FieldTitle>{messages.textTitle}</FieldTitle>
            <FieldDescription>{messages.textDescription}</FieldDescription>
            <Field>
              <label
                className="text-sm leading-none font-medium"
                htmlFor="placeholder-text"
              >
                {messages.customTextLabel}
              </label>
              <Input
                id="placeholder-text"
                onChange={(event) => {
                  handlers.onOptionChange("text", event.target.value)
                }}
                placeholder={`${options.width} × ${options.height}`}
                value={options.text}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <ColorField
                label={messages.textColorLabel}
                onChange={(value) => {
                  handlers.onOptionChange("textColor", value)
                }}
                value={options.textColor}
              />
              <NumberField
                id="placeholder-font-size"
                label={messages.fontSizeLabel}
                onChange={(value) => {
                  handlers.onOptionChange("fontSize", value)
                }}
                placeholder={messages.autoFontSizeHint}
                value={options.fontSize}
              />
            </div>
          </Field>
        </div>

        <FieldSeparator />

        <div className="grid gap-6 xl:grid-cols-2">
          <Field className="gap-4">
            <FieldTitle>{messages.scaleLabel}</FieldTitle>
            <OptionPills
              onChange={(value) => {
                handlers.onScaleChange(value as PlaceholderScale)
              }}
              options={[
                { label: "1x", value: 1 },
                { label: "2x", value: 2 },
                { label: "3x", value: 3 },
              ]}
              value={scale}
            />
          </Field>
          <SliderField
            description={messages.qualityDescription}
            label={messages.qualityLabel}
            max={100}
            min={10}
            onValueChange={handlers.onQualityChange}
            step={5}
            suffix="%"
            value={quality}
          />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium">{messages.downloadLabel}</p>
          <p className="text-sm text-muted-foreground">
            {messages.presetLabel}: {activePresetLabel}
          </p>
          <p className="text-sm text-muted-foreground">
            {messages.downloadDescription}
          </p>
        </div>
        <div className="grid w-full gap-2 sm:w-auto sm:grid-cols-2 lg:flex">
          {downloads.map((download) => (
            <DownloadButton key={download.label} {...download} />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export { OptionsCard }
