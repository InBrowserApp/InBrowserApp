import { useId } from "react"

import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"

import { NumberField } from "./number-field"
import type { ControlCardProps } from "./types"

function LayoutCard({ messages, onChange, settings }: ControlCardProps) {
  const shadowId = useId()
  const fontSizeId = useId()
  const lineHeightId = useId()
  const cardPaddingId = useId()
  const framePaddingId = useId()
  const cornerRadiusId = useId()
  const tabSizeId = useId()
  const backgroundDisabled = settings.backgroundMode === "none"

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.layoutTitle}</CardTitle>
        <CardDescription>{messages.layoutDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <NumberField
            id={fontSizeId}
            label={messages.fontSizeLabel}
            min={12}
            max={28}
            value={settings.fontSize}
            onChange={(fontSize) => {
              onChange({ fontSize })
            }}
          />
          <NumberField
            id={lineHeightId}
            label={messages.lineHeightLabel}
            min={1.2}
            max={2}
            step={0.05}
            value={settings.lineHeight}
            onChange={(lineHeight) => {
              onChange({ lineHeight })
            }}
          />
          <NumberField
            id={cardPaddingId}
            label={messages.cardPaddingLabel}
            min={12}
            max={60}
            value={settings.cardPadding}
            onChange={(cardPadding) => {
              onChange({ cardPadding })
            }}
          />
          <NumberField
            id={framePaddingId}
            label={messages.framePaddingLabel}
            min={0}
            max={120}
            value={backgroundDisabled ? 0 : settings.framePadding}
            onChange={(framePadding) => {
              onChange({ framePadding })
            }}
          />
          <NumberField
            id={cornerRadiusId}
            label={messages.cornerRadiusLabel}
            min={6}
            max={40}
            value={settings.cornerRadius}
            onChange={(cornerRadius) => {
              onChange({ cornerRadius })
            }}
          />
          <NumberField
            id={tabSizeId}
            label={messages.tabSizeLabel}
            min={2}
            max={8}
            value={settings.tabSize}
            onChange={(tabSize) => {
              onChange({ tabSize })
            }}
          />
          <Field orientation="horizontal" data-disabled={backgroundDisabled}>
            <Checkbox
              id={shadowId}
              checked={!backgroundDisabled && settings.shadow}
              disabled={backgroundDisabled}
              onCheckedChange={(checked) => {
                onChange({ shadow: checked === true })
              }}
            />
            <FieldContent>
              <FieldLabel htmlFor={shadowId}>{messages.shadowLabel}</FieldLabel>
              {backgroundDisabled ? (
                <FieldDescription>
                  {messages.backgroundModeNone}
                </FieldDescription>
              ) : null}
            </FieldContent>
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}

export { LayoutCard }
