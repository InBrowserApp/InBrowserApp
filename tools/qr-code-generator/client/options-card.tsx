import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { ERROR_CORRECTION_LEVELS } from "../core/options"
import { ColorField, SelectField, SliderField } from "./form-controls"

import type {
  QrCodeGeneratorMessages,
  QrErrorCorrectionLevel,
  QrGeneratorOptions,
  QrOptionHandlers,
  SelectChoice,
} from "./types"

type OptionsCardProps = Readonly<{
  handlers: QrOptionHandlers
  messages: QrCodeGeneratorMessages
  options: QrGeneratorOptions
}>

function getErrorCorrectionLabel(
  value: QrErrorCorrectionLevel,
  messages: QrCodeGeneratorMessages
) {
  return {
    H: messages.errorCorrectionHigh,
    L: messages.errorCorrectionLow,
    M: messages.errorCorrectionMedium,
    Q: messages.errorCorrectionQuartile,
  }[value]
}

function OptionsCard({ handlers, messages, options }: OptionsCardProps) {
  const errorCorrectionOptions: readonly SelectChoice<QrErrorCorrectionLevel>[] =
    ERROR_CORRECTION_LEVELS.map((value) => ({
      label: getErrorCorrectionLabel(value, messages),
      value,
    }))

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <SelectField
          id="qr-error-correction"
          label={messages.errorCorrectionLabel}
          options={errorCorrectionOptions}
          value={options.errorCorrectionLevel}
          onValueChange={handlers.onErrorCorrectionChange}
        />
        <SliderField
          label={messages.sizeLabel}
          max={1024}
          min={128}
          step={8}
          value={options.size}
          onValueChange={(value) => handlers.onNumberChange("size", value)}
        />
        <SliderField
          label={messages.marginLabel}
          max={12}
          min={0}
          step={1}
          value={options.margin}
          onValueChange={(value) => handlers.onNumberChange("margin", value)}
        />
        <ColorField
          label={messages.darkColorLabel}
          value={options.darkColor}
          onChange={(value) => handlers.onColorChange("darkColor", value)}
        />
        <ColorField
          label={messages.lightColorLabel}
          value={options.lightColor}
          onChange={(value) => handlers.onColorChange("lightColor", value)}
        />
      </CardContent>
    </Card>
  )
}

export { OptionsCard }
