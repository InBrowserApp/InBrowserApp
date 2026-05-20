import { Button } from "@workspace/ui/components/ui/button"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { Mic, Pause, Play, Square } from "@workspace/ui/icons"

import type { RecorderError, RecorderState } from "../client/use-audio-recorder"
import type { AudioRecorderMessages } from "../types"

type RecorderButtonsProps = Readonly<{
  messages: AudioRecorderMessages
  isSupported: boolean
  recorderState: RecorderState
  isPreparing: boolean
  error: RecorderError | null
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
}>

function RecorderButtons({
  messages,
  isSupported,
  recorderState,
  isPreparing,
  error,
  onStart,
  onPause,
  onResume,
  onStop,
}: RecorderButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {recorderState === "idle" ? (
        <Button
          type="button"
          variant="destructive"
          disabled={!isSupported || isPreparing}
          onClick={onStart}
        >
          {isPreparing ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Mic data-icon="inline-start" />
          )}
          {isPreparing ? messages.preparingLabel : messages.recordButton}
        </Button>
      ) : null}
      {recorderState === "recording" ? (
        <Button type="button" variant="secondary" onClick={onPause}>
          <Pause data-icon="inline-start" />
          {messages.pauseButton}
        </Button>
      ) : null}
      {recorderState === "paused" ? (
        <Button type="button" variant="secondary" onClick={onResume}>
          <Play data-icon="inline-start" />
          {messages.resumeButton}
        </Button>
      ) : null}
      {recorderState !== "idle" ? (
        <Button type="button" variant="destructive" onClick={onStop}>
          <Square data-icon="inline-start" />
          {messages.stopButton}
        </Button>
      ) : null}
      {error === "permission" && recorderState === "idle" ? (
        <Button type="button" variant="outline" onClick={onStart}>
          {messages.retryButton}
        </Button>
      ) : null}
    </div>
  )
}

export { RecorderButtons }
