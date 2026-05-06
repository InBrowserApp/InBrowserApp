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
import { Input } from "@workspace/ui/components/ui/input"
import { Slider } from "@workspace/ui/components/ui/slider"

import type { Station } from "../core/stations"
import type { RadioTimecodeMessages } from "../types"

type OutputCardProps = Readonly<{
  messages: RadioTimecodeMessages
  station: Station
  volume: number
  offsetMs: number
  formatHz: (value: number) => string
  formatPercent: (value: number) => string
  onVolumeChange: (volume: number) => void
  onOffsetChange: (offsetMs: number) => void
}>

function OutputCard({
  messages,
  station,
  volume,
  offsetMs,
  formatHz,
  formatPercent,
  onVolumeChange,
  onOffsetChange,
}: OutputCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
        <CardDescription>{messages.volumeHint}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6 p-6">
        <FieldGroup>
          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>{messages.volumeLabel}</FieldLabel>
              <span className="font-mono text-sm text-muted-foreground">
                {formatPercent(volume)}
              </span>
            </div>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[volume]}
              onValueChange={(value) => {
                onVolumeChange(value[0] ?? 0)
              }}
              aria-label={messages.volumeLabel}
              data-testid="volume-slider"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="radio-timecode-offset">
              {messages.offsetLabel}
            </FieldLabel>
            <Input
              id="radio-timecode-offset"
              type="number"
              inputMode="numeric"
              step="1"
              value={offsetMs}
              onChange={(event) => {
                const nextValue = Number(event.currentTarget.value)
                onOffsetChange(Number.isFinite(nextValue) ? nextValue : 0)
              }}
              data-testid="offset-input"
            />
            <FieldDescription>
              {messages.offsetHint} ({messages.millisecondsUnit})
            </FieldDescription>
          </Field>
        </FieldGroup>

        <dl className="grid gap-4 border-t pt-5 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.carrierLabel}
            </dt>
            <dd className="font-mono text-sm tabular-nums">
              {formatHz(station.carrierHz)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.outputToneLabel}
            </dt>
            <dd className="font-mono text-sm tabular-nums">
              {formatHz(station.baseHz)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-muted-foreground">
              {messages.attenuationLabel}
            </dt>
            <dd className="font-mono text-sm tabular-nums">
              {formatPercent(station.lowRatio)}
            </dd>
          </div>
        </dl>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { OutputCard }
