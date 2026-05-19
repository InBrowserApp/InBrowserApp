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

import type { IOSIconConfig } from "../core/config"
import { ColorField } from "./color-field"
import { PlatformSourceToggle } from "./platform-source-toggle"
import type { FaviconMessages, ImageSource } from "./types"

type IosCardProps = Readonly<{
  messages: FaviconMessages
  cfg: IOSIconConfig
  onPatch: (patch: Partial<IOSIconConfig>) => void
  dedicatedSource: ImageSource | null
  onDedicatedFileChange: (file: File | null) => void | Promise<void>
}>

function IosCard({
  messages,
  cfg,
  onPatch,
  dedicatedSource,
  onDedicatedFileChange,
}: IosCardProps) {
  const idPrefix = useId()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{messages.iosCardTitle}</CardTitle>
        <CardDescription>{messages.iosCardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <FieldGroup>
          <ColorField
            id={`${idPrefix}-bg-color`}
            label={messages.iosBackgroundColorLabel}
            description={messages.iosBackgroundColorDescription}
            value={cfg.backgroundColor}
            onChange={(value) => onPatch({ backgroundColor: value })}
          />
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
              onValueChange={(values) => onPatch({ margin: values[0] ?? 0 })}
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
      </CardContent>
    </Card>
  )
}

export { IosCard }
