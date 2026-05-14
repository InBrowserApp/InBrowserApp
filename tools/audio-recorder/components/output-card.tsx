import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { cn } from "@workspace/ui/lib/utils"
import { Download, Mic, Trash2 } from "@workspace/ui/icons"

import {
  formatRecordingDuration,
  formatRecordingFileSize,
} from "../core/recorder"

import type { RecordingResult } from "../client/use-audio-recorder"
import type { AudioRecorderMessages } from "../types"

type AudioRecorderOutputCardProps = Readonly<{
  messages: AudioRecorderMessages
  recording: RecordingResult | null
  onClear: () => void
}>

function AudioRecorderOutputCard({
  messages,
  recording,
  onClear,
}: AudioRecorderOutputCardProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{messages.outputTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {recording ? (
          <RecordingOutput
            messages={messages}
            recording={recording}
            onClear={onClear}
          />
        ) : (
          <Empty className="min-h-80 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Mic />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyOutputTitle}</EmptyTitle>
              <EmptyDescription>
                {messages.emptyOutputDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function RecordingOutput({
  messages,
  recording,
  onClear,
}: Readonly<{
  messages: AudioRecorderMessages
  recording: RecordingResult
  onClear: () => void
}>) {
  const recordingDuration = formatRecordingDuration(recording.durationMs)
  const recordingFileSize = formatRecordingFileSize(recording.blob.size)

  return (
    <div className="grid gap-5">
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        className="w-full"
        controls
        src={recording.url}
        aria-label={messages.playbackLabel}
      />

      <dl className="grid gap-3 sm:grid-cols-3">
        <RecordingStat
          label={messages.durationLabel}
          value={recordingDuration}
        />
        <RecordingStat
          label={messages.fileSizeLabel}
          value={recordingFileSize}
        />
        <RecordingStat
          label={messages.formatLabel}
          value={recording.mimeType || messages.unknownFormatLabel}
          code
        />
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <a href={recording.url} download={recording.downloadName}>
            <Download data-icon="inline-start" />
            {messages.downloadButton}
          </a>
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          <Trash2 data-icon="inline-start" />
          {messages.clearButton}
        </Button>
      </div>
    </div>
  )
}

function RecordingStat({
  label,
  value,
  code = false,
}: Readonly<{
  label: string
  value: string
  code?: boolean
}>) {
  return (
    <div className="grid gap-1 rounded-md border bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-sm font-medium break-words",
          code && "font-mono text-xs break-all"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

export { AudioRecorderOutputCard }
