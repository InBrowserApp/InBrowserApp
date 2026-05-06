import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Play, Square, TriangleAlert } from "@workspace/ui/icons"

import { stations } from "../core/stations"

import type { StationId } from "../core/encoders"
import type { Station } from "../core/stations"
import type { RadioTimecodeMessages } from "../types"

type SignalCardProps = Readonly<{
  messages: RadioTimecodeMessages
  station: Station
  stationId: StationId
  audioAvailable: boolean
  playing: boolean
  starting: boolean
  startFailed: boolean
  onStationChange: (stationId: StationId) => void
  onStart: () => void
  onStop: () => void
}>

function SignalCard({
  messages,
  station,
  stationId,
  audioAvailable,
  playing,
  starting,
  startFailed,
  onStationChange,
  onStart,
  onStop,
}: SignalCardProps) {
  const runLabel = starting
    ? messages.startingLabel
    : playing
      ? messages.stopLabel
      : messages.startLabel
  const statusLabel = playing
    ? messages.playbackStatusPlaying
    : messages.playbackStatusIdle

  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.signalTitle}</CardTitle>
        <CardDescription>{messages.stationHint}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-5 p-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="radio-timecode-station">
              {messages.stationLabel}
            </FieldLabel>
            <Select
              value={stationId}
              onValueChange={(value) => {
                onStationChange(value as StationId)
              }}
            >
              <SelectTrigger
                id="radio-timecode-station"
                className="w-full"
                data-testid="station-select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {stations.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              {messages.stationDescriptions[station.id]}
            </FieldDescription>
          </Field>
        </FieldGroup>

        {!audioAvailable ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.unsupportedAudioTitle}</AlertTitle>
            <AlertDescription>
              {messages.unsupportedAudioDescription}
            </AlertDescription>
          </Alert>
        ) : null}

        {startFailed ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.startFailedTitle}</AlertTitle>
            <AlertDescription>
              {messages.startFailedDescription}
            </AlertDescription>
          </Alert>
        ) : null}
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="flex flex-wrap items-center justify-between gap-3 border-t">
        <p
          aria-live="polite"
          className="text-sm text-muted-foreground"
          data-testid="playback-status"
        >
          {messages.playbackStatusLabel}: {statusLabel}
        </p>
        <Button
          type="button"
          size="sm"
          variant={playing ? "destructive" : "default"}
          disabled={!audioAvailable || starting}
          onClick={playing ? onStop : onStart}
        >
          {starting ? (
            <Spinner data-icon="inline-start" />
          ) : playing ? (
            <Square data-icon="inline-start" />
          ) : (
            <Play data-icon="inline-start" />
          )}
          {runLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { SignalCard }
