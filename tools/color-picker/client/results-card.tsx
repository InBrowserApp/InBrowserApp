import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Switch } from "@workspace/ui/components/ui/switch"

import { OutputField } from "./output-field"

import type { ColorPickerMessages } from "./types"

type ResultsCardProps = Readonly<{
  cssColor: string
  hexValue: string
  rgbValue: string
  hslValue: string
  hsvValue: string
  cmykValue: string
  alphaValue: string
  messages: ColorPickerMessages
  pickedSource: "screen" | "image" | null
  showAlpha: boolean
  onShowAlphaChange: (value: boolean) => void
}>

function ResultsCard({
  cssColor,
  hexValue,
  rgbValue,
  hslValue,
  hsvValue,
  cmykValue,
  alphaValue,
  messages,
  pickedSource,
  showAlpha,
  onShowAlphaChange,
}: ResultsCardProps) {
  const sourceLabel =
    pickedSource === "screen"
      ? messages.sourceScreen
      : pickedSource === "image"
        ? messages.sourceImage
        : messages.sourceUnknown

  const fields = [
    { label: messages.hex, value: hexValue },
    { label: showAlpha ? messages.rgba : messages.rgb, value: rgbValue },
    { label: showAlpha ? messages.hsla : messages.hsl, value: hslValue },
    { label: showAlpha ? messages.hsva : messages.hsv, value: hsvValue },
    { label: messages.cmyk, value: cmykValue },
  ]

  if (showAlpha) {
    fields.push({ label: messages.alpha, value: alphaValue })
  }

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
        <CardAction>
          <div className="grid gap-2 rounded-xl border bg-muted/20 px-3 py-2 text-sm">
            <span className="text-muted-foreground">{messages.showAlpha}</span>
            <div className="flex justify-end">
              <Switch
                checked={showAlpha}
                data-testid="alpha-switch"
                onCheckedChange={onShowAlphaChange}
                size="sm"
              />
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <ToolPanelCardContent className="gap-5">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-muted/20 p-4">
          <div
            className="size-16 rounded-2xl border shadow-inner"
            style={{ backgroundColor: cssColor }}
          />
          <div className="space-y-1">
            <p className="font-medium">{messages.meta.name}</p>
            <p className="text-sm text-muted-foreground">
              {messages.sourceLabel}: {sourceLabel}
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <OutputField
              key={field.label}
              label={field.label}
              messages={messages}
              value={field.value}
            />
          ))}
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ResultsCard }
