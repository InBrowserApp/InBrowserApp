import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/ui/input-group"
import { Download, Trash2, Video } from "@workspace/ui/icons"

import { getExtensionForMimeType } from "../core/recorder"

import type { OutputMessages, ScreenRecordingOutput } from "../types"

const emptyCaptionsTrack = "data:text/vtt,WEBVTT%0A%0A"

type OutputCardProps = Readonly<{
  messages: OutputMessages
  output: ScreenRecordingOutput | null
  outputUrl: string
  displayMimeType: string
  fileName: string
  fileSizeLabel: string
  downloadName: string
  onFileNameChange: (value: string) => void
  onClear: () => void
}>

function OutputCard({
  messages,
  output,
  outputUrl,
  displayMimeType,
  fileName,
  fileSizeLabel,
  downloadName,
  onFileNameChange,
  onClear,
}: OutputCardProps) {
  return (
    <Card role="region" aria-labelledby="screen-recorder-output-title">
      <CardHeader>
        <CardTitle id="screen-recorder-output-title">
          {messages.title}
        </CardTitle>
        <CardDescription>{messages.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {output && outputUrl ? (
          <div className="flex flex-col gap-4">
            <video
              className="aspect-video w-full rounded-lg bg-muted object-contain"
              src={outputUrl}
              controls
            >
              <track
                kind="captions"
                src={emptyCaptionsTrack}
                label={messages.title}
              />
            </video>

            <dl className="grid gap-3 rounded-lg bg-muted/50 p-3 sm:grid-cols-2">
              <OutputMetric
                label={messages.formatLabel}
                value={displayMimeType}
              />
              <OutputMetric
                label={messages.fileSizeLabel}
                value={fileSizeLabel}
              />
            </dl>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="screen-recorder-file-name">
                  {messages.fileNameLabel}
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="screen-recorder-file-name"
                    value={fileName}
                    placeholder={messages.fileNamePlaceholder}
                    onChange={(event) => onFileNameChange(event.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    .{getExtensionForMimeType(output.mimeType)}
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>

            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <a href={outputUrl} download={downloadName}>
                  <Download data-icon="inline-start" />
                  {messages.downloadLabel}
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={onClear}>
                <Trash2 data-icon="inline-start" />
                {messages.clearLabel}
              </Button>
            </div>
          </div>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Video />
              </EmptyMedia>
              <EmptyTitle>{messages.emptyTitle}</EmptyTitle>
              <EmptyDescription>{messages.emptyDescription}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function OutputMetric({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="truncate font-mono text-sm">{value}</dd>
    </div>
  )
}

export { OutputCard }
