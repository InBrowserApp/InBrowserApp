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
  FieldLabel,
  FieldTitle,
} from "@workspace/ui/components/ui/field"
import { Switch } from "@workspace/ui/components/ui/switch"
import { cn } from "@workspace/ui/lib/utils"
import { LoaderCircle, Sparkles } from "@workspace/ui/icons"

import { SIZE_OPTIONS } from "../core/convert-image-to-ico"

import type { ImageToIcoOptions } from "../core/convert-image-to-ico"
import type { ImageToIcoMessages } from "./types"

type OptionsCardProps = Readonly<{
  isConverting: boolean
  messages: ImageToIcoMessages
  onGenerate: () => void
  onSetBackgroundColor: (value: string) => void
  onSetBackgroundEnabled: (value: boolean) => void
  onToggleSize: (size: number) => void
  options: ImageToIcoOptions
  selectedFile: File | null
}>

export function OptionsCard({
  isConverting,
  messages,
  onGenerate,
  onSetBackgroundColor,
  onSetBackgroundEnabled,
  onToggleSize,
  options,
  selectedFile,
}: OptionsCardProps) {
  const selectedSizeCount = options.sizes.length
  const canGenerate =
    Boolean(selectedFile) && selectedSizeCount > 0 && !isConverting

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Field className="gap-4">
          <div className="flex items-center justify-between gap-3">
            <FieldTitle>{messages.sizesLabel}</FieldTitle>
            <span className="text-sm text-muted-foreground">
              {selectedSizeCount}
            </span>
          </div>
          <FieldDescription>{messages.sizesDescription}</FieldDescription>
          <div className="grid gap-2 sm:grid-cols-2">
            {SIZE_OPTIONS.map((size) => {
              const checked = options.sizes.includes(size)

              return (
                <label
                  key={size}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                    checked
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-foreground/20"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => {
                      onToggleSize(size)
                    }}
                  />
                  <span className="text-sm font-medium">
                    {size} × {size}
                  </span>
                </label>
              )
            })}
          </div>
          {selectedSizeCount === 0 ? (
            <p className="text-sm text-destructive">
              {messages.selectSizeError}
            </p>
          ) : null}
        </Field>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_7rem]">
          <Field className="gap-3">
            <FieldLabel htmlFor="image-to-ico-background-enabled">
              {messages.backgroundLabel}
            </FieldLabel>
            <FieldDescription>
              {messages.backgroundDescription}
            </FieldDescription>
            <FieldContent className="items-start">
              <Switch
                checked={options.backgroundEnabled}
                id="image-to-ico-background-enabled"
                onCheckedChange={onSetBackgroundEnabled}
              />
            </FieldContent>
          </Field>

          <Field className="gap-3">
            <FieldLabel htmlFor="image-to-ico-background-color">
              {messages.backgroundColorLabel}
            </FieldLabel>
            <input
              aria-label={messages.backgroundColorLabel}
              className="h-10 w-full cursor-pointer rounded-lg border border-input bg-transparent p-1 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!options.backgroundEnabled}
              id="image-to-ico-background-color"
              onChange={(event) => {
                onSetBackgroundColor(event.target.value)
              }}
              type="color"
              value={options.backgroundColor}
            />
          </Field>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button disabled={!canGenerate} onClick={onGenerate} type="button">
          {isConverting ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <Sparkles data-icon="inline-start" />
          )}
          {isConverting ? messages.generatingLabel : messages.generateLabel}
        </Button>
      </CardFooter>
    </Card>
  )
}
