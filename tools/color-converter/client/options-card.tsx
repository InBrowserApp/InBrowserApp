import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
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
import { Switch } from "@workspace/ui/components/ui/switch"
import { cn } from "@workspace/ui/lib/utils"

import type { ColorConverterMessages } from "./types"

type OptionsCardProps = Readonly<{
  colorInputValue: string
  currentDisplayValue: string
  messages: ColorConverterMessages
  onColorInputChange: (value: string) => void
  onShowAlphaChange: (value: boolean) => void
  onSwatchSelect: (value: string) => void
  showAlpha: boolean
  swatches: readonly string[]
  swatchStyle: string
}>

export function OptionsCard({
  colorInputValue,
  currentDisplayValue,
  messages,
  onColorInputChange,
  onShowAlphaChange,
  onSwatchSelect,
  showAlpha,
  swatches,
  swatchStyle,
}: OptionsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.optionsTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-6 py-4">
        <div className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4">
          <div
            aria-hidden="true"
            className="size-16 rounded-xl border border-border/70 shadow-xs"
            style={{ background: swatchStyle }}
          />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{messages.meta.name}</div>
            <code className="font-mono text-xs text-muted-foreground uppercase">
              {currentDisplayValue}
            </code>
          </div>
          <input
            aria-label={messages.meta.name}
            className="h-11 w-16 cursor-pointer rounded-lg border border-input bg-transparent p-1"
            data-testid="native-color-picker"
            onChange={(event) => {
              onColorInputChange(event.target.value)
            }}
            type="color"
            value={colorInputValue}
          />
        </div>

        <FieldGroup>
          <Field
            orientation="horizontal"
            className="items-center rounded-xl border p-4"
          >
            <div className="grid gap-1">
              <FieldLabel htmlFor="alpha-switch">
                {messages.enableAlphaLabel}
              </FieldLabel>
              <FieldDescription>{messages.meta.description}</FieldDescription>
            </div>
            <Switch
              checked={showAlpha}
              data-testid="alpha-switch"
              id="alpha-switch"
              onCheckedChange={onShowAlphaChange}
            />
          </Field>
        </FieldGroup>

        <div className="flex flex-wrap gap-2">
          {swatches.map((swatch) => (
            <button
              aria-label={swatch}
              className={cn(
                "size-8 rounded-lg border transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                colorInputValue === swatch
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border"
              )}
              key={swatch}
              onClick={() => {
                onSwatchSelect(swatch)
              }}
              style={{ backgroundColor: swatch }}
              type="button"
            />
          ))}
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
