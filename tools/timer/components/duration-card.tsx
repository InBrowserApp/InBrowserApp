import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import { formatPresetLabel } from "../core/timer"

import type { TimerDurationParts } from "../core/timer"
import type { TimerMessages } from "../types"

type DurationCardProps = Readonly<{
  messages: TimerMessages
  parts: TimerDurationParts
  running: boolean
  presetMinutes: readonly number[]
  onHoursChange: (value: number | null) => void
  onMinutesChange: (value: number | null) => void
  onSecondsChange: (value: number | null) => void
  onPreset: (presetMinutes: number) => void
}>

function parseInputValue(value: string) {
  if (!value.trim()) {
    return 0
  }

  const parsedValue = Number(value)

  return Number.isFinite(parsedValue) ? parsedValue : 0
}

function DurationCard({
  messages,
  parts,
  running,
  presetMinutes,
  onHoursChange,
  onMinutesChange,
  onSecondsChange,
  onPreset,
}: DurationCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.durationLabel}</CardTitle>
        <CardDescription>{messages.durationHintLabel}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="timer-hours">{messages.hoursLabel}</Label>
            <Input
              id="timer-hours"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              disabled={running}
              value={String(parts.hours)}
              data-testid="hours-input"
              onChange={(event) => {
                onHoursChange(parseInputValue(event.target.value))
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timer-minutes">{messages.minutesLabel}</Label>
            <Input
              id="timer-minutes"
              type="number"
              min={0}
              max={59}
              step={1}
              inputMode="numeric"
              disabled={running}
              value={String(parts.minutes)}
              data-testid="minutes-input"
              onChange={(event) => {
                onMinutesChange(parseInputValue(event.target.value))
              }}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timer-seconds">{messages.secondsLabel}</Label>
            <Input
              id="timer-seconds"
              type="number"
              min={0}
              max={59}
              step={1}
              inputMode="numeric"
              disabled={running}
              value={String(parts.seconds)}
              data-testid="seconds-input"
              onChange={(event) => {
                onSecondsChange(parseInputValue(event.target.value))
              }}
            />
          </div>
        </div>

        <div className="grid gap-3">
          <p className="text-sm font-medium">{messages.quickPresetsLabel}</p>
          <div className="flex flex-wrap gap-2">
            {presetMinutes.map((preset) => (
              <Button
                key={preset}
                type="button"
                size="sm"
                variant="outline"
                disabled={running}
                data-testid={`preset-${preset}`}
                onClick={() => {
                  onPreset(preset)
                }}
              >
                {formatPresetLabel(messages.presetMinutesLabel, preset)}
              </Button>
            ))}
          </div>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { DurationCard }
