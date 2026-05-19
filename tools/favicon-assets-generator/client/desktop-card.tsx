"use client"

import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Slider } from "@workspace/ui/components/ui/slider"
import { Switch } from "@workspace/ui/components/ui/switch"

import type { DesktopIconConfig } from "../core/config"
import { ColorField } from "./color-field"
import { DesktopPreview } from "./desktop-preview"
import { PlatformSourceToggle } from "./platform-source-toggle"
import type { FaviconMessages, GeneratedBundle, ImageSource } from "./types"

type DesktopCardProps = Readonly<{
  messages: FaviconMessages
  cfg: DesktopIconConfig
  onPatch: (patch: Partial<DesktopIconConfig>) => void
  dedicatedSource: ImageSource | null
  onDedicatedFileChange: (file: File | null) => void | Promise<void>
  appName: string
  bundle: GeneratedBundle | null
  globalSource: ImageSource | null
}>

function DesktopCard({
  messages,
  cfg,
  onPatch,
  dedicatedSource,
  onDedicatedFileChange,
  appName,
  bundle,
  globalSource,
}: DesktopCardProps) {
  const idPrefix = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.desktopCardTitle}</CardTitle>
        <CardDescription>{messages.desktopCardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel htmlFor={`${idPrefix}-use-svg`} className="flex-1">
                {messages.useOriginalSvgLabel}
                <FieldDescription className="font-normal">
                  {messages.useOriginalSvgDescription}
                </FieldDescription>
              </FieldLabel>
              <Switch
                id={`${idPrefix}-use-svg`}
                checked={cfg.useOriginalSvg}
                onCheckedChange={(checked) =>
                  onPatch({ useOriginalSvg: checked })
                }
              />
            </Field>

            <Field orientation="horizontal">
              <FieldLabel htmlFor={`${idPrefix}-bg`} className="flex-1">
                {messages.addBackgroundLabel}
              </FieldLabel>
              <Switch
                id={`${idPrefix}-bg`}
                checked={cfg.addBackground}
                onCheckedChange={(checked) =>
                  onPatch({ addBackground: checked })
                }
              />
            </Field>

            {cfg.addBackground ? (
              <>
                <ColorField
                  id={`${idPrefix}-bg-color`}
                  label={messages.cardBackgroundColorLabel}
                  value={cfg.backgroundColor}
                  onChange={(value) => onPatch({ backgroundColor: value })}
                />
                <Field>
                  <FieldLabel htmlFor={`${idPrefix}-bg-radius`}>
                    {messages.backgroundRadiusLabel}: {cfg.backgroundRadius}%
                  </FieldLabel>
                  <Slider
                    id={`${idPrefix}-bg-radius`}
                    min={0}
                    max={100}
                    step={1}
                    value={[cfg.backgroundRadius]}
                    onValueChange={(values) =>
                      onPatch({ backgroundRadius: values[0] ?? 0 })
                    }
                  />
                  <FieldDescription>
                    {messages.backgroundRadiusDescription}
                  </FieldDescription>
                </Field>
              </>
            ) : null}

            <Field>
              <FieldLabel htmlFor={`${idPrefix}-margin`}>
                {messages.marginLabel}: {cfg.margin}%
              </FieldLabel>
              <Slider
                id={`${idPrefix}-margin`}
                min={0}
                max={50}
                step={1}
                value={[cfg.margin]}
                onValueChange={(values) =>
                  onPatch({ margin: values[0] ?? 0 })
                }
              />
              <FieldDescription>{messages.marginDescription}</FieldDescription>
            </Field>

            <PlatformSourceToggle
              messages={messages}
              enabled={cfg.useDifferentImage}
              onToggle={(checked) => onPatch({ useDifferentImage: checked })}
              source={dedicatedSource}
              onFileChange={onDedicatedFileChange}
            />
          </FieldGroup>
          <DesktopPreview
            messages={messages}
            appName={appName}
            bundle={bundle}
            globalSource={globalSource}
            desktopSource={dedicatedSource}
            useDifferentImage={cfg.useDifferentImage}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { DesktopCard }
