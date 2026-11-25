import { useId } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Mic, MicOff, Volume2 } from "@workspace/ui/icons"

import { useMicrophone } from "./use-microphone"
import { useStereoTone } from "./use-stereo-tone"

import type English from "./messages/en.json"

const channels = ["left", "both", "right"] as const

export default function MicrophoneTest({
  messages,
}: {
  messages: typeof English
}) {
  const microphone = useMicrophone()
  const stereo = useStereoTone()
  const meterLabel = useId()
  const stereoLabel = useId()
  const listening = microphone.status === "active"
  const starting = microphone.status === "starting"

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic aria-hidden="true" className="size-5 shrink-0" />
            {messages.microphone}
          </CardTitle>
          <CardDescription>{messages.microphoneHint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <span id={meterLabel} className="text-sm font-medium">
              {messages.inputLevel}
            </span>
            <div
              role="meter"
              aria-labelledby={meterLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={microphone.level}
              className="h-3 overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${microphone.level}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={starting}
              onClick={() => {
                if (listening) microphone.stop()
                else void microphone.start()
              }}
            >
              {listening ? (
                <MicOff aria-hidden="true" />
              ) : (
                <Mic aria-hidden="true" />
              )}
              {listening
                ? messages.stop
                : starting
                  ? messages.starting
                  : messages.start}
            </Button>
            <Button
              type="button"
              variant={microphone.monitoring ? "secondary" : "outline"}
              aria-pressed={microphone.monitoring}
              disabled={!listening}
              onClick={microphone.toggleMonitoring}
            >
              <Volume2 aria-hidden="true" />
              {messages.monitor}
            </Button>
          </div>
          {microphone.status === "error" && (
            <p role="alert" className="text-sm text-destructive">
              {messages.micError}
            </p>
          )}
        </CardContent>
      </Card>
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle id={stereoLabel} className="flex items-center gap-2">
            <Volume2 aria-hidden="true" className="size-5 shrink-0" />
            {messages.speakers}
          </CardTitle>
          <CardDescription>{messages.speakersHint}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            role="group"
            aria-labelledby={stereoLabel}
            className="grid grid-cols-3 gap-2"
            dir="ltr"
          >
            {channels.map((channel) => (
              <Button
                key={channel}
                type="button"
                variant={stereo.channel === channel ? "default" : "outline"}
                aria-pressed={stereo.channel === channel}
                className="h-auto min-h-11 min-w-0 px-2 whitespace-normal"
                onClick={() => void stereo.play(channel)}
              >
                <bdi>{messages[channel]}</bdi>
              </Button>
            ))}
          </div>
          {stereo.error && (
            <p role="alert" className="text-sm text-destructive">
              {messages.speakerError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
