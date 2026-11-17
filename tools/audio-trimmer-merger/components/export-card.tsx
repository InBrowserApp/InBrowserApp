import { useId, type RefObject } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
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
import { Switch } from "@workspace/ui/components/ui/switch"
import { Download, LoaderCircle, Scissors } from "@workspace/ui/icons"
import { formatDuration } from "../core/audio"
import { downloadName, formatBytes, FORMATS } from "../core/settings"
import { FormatOptions } from "./format-options"
import { JoinOptions } from "./join-options"
import type {
  AudioEditorMessages,
  AudioResult,
  ExportSettings,
  NativeSupport,
} from "../types"

export function ExportCard({
  messages: m,
  disabled,
  exporting,
  duration,
  count,
  name,
  settings,
  nativeSupport,
  onSettings,
  progress,
  onCancel,
  estimatedBytes,
  language,
  result,
  onName,
  onExport,
  onPlay,
  audioRef,
}: {
  audioRef: RefObject<HTMLAudioElement | null>
  messages: AudioEditorMessages
  disabled: boolean
  exporting: boolean
  duration: number
  count: number
  name: string
  settings: ExportSettings
  nativeSupport: NativeSupport | null
  onSettings: (settings: ExportSettings) => void
  progress: number
  onCancel: () => void
  estimatedBytes: number
  language: string
  result: AudioResult | null
  onName: (name: string) => void
  onExport: () => void
  onPlay: () => void
}) {
  const id = useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.exportTitle}</CardTitle>
        <CardDescription>{m.exportDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-4">
          <dl>
            <dt className="text-xs text-muted-foreground">{m.totalLabel}</dt>
            <dd className="mt-1 font-mono tabular-nums">
              <bdi>{formatDuration(duration)}</bdi>
            </dd>
          </dl>
          <p className="flex items-center justify-end text-sm">
            {m.clipCount.replace(
              "{count}",
              new Intl.NumberFormat(language).format(count)
            )}
          </p>
        </div>
        <FieldGroup>
          <FormatOptions
            messages={m}
            settings={settings}
            nativeSupport={nativeSupport}
            disabled={exporting}
            onChange={onSettings}
          />
          <p className="text-sm text-muted-foreground">
            {m.estimatedSizeLabel}:{" "}
            <bdi className="tabular-nums">
              {formatBytes(estimatedBytes, language)}
            </bdi>
          </p>
          <Field>
            <FieldLabel htmlFor={`${id}-name`}>{m.outputNameLabel}</FieldLabel>
            <Input
              id={`${id}-name`}
              name="output-name"
              autoComplete="off"
              value={name}
              disabled={exporting}
              onChange={(event) => onName(event.target.value)}
            />
          </Field>
          {count > 1 ? (
            <JoinOptions
              messages={m}
              settings={settings}
              disabled={exporting}
              onChange={onSettings}
            />
          ) : null}
          <Field orientation="horizontal">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <FieldLabel htmlFor={`${id}-smooth`}>{m.smoothLabel}</FieldLabel>
              <FieldDescription id={`${id}-smooth-help`}>
                {m.smoothDescription}
              </FieldDescription>
            </div>
            <Switch
              id={`${id}-smooth`}
              checked={settings.smooth}
              disabled={exporting}
              aria-describedby={`${id}-smooth-help`}
              onCheckedChange={(value) =>
                onSettings({ ...settings, smooth: value })
              }
            />
          </Field>
        </FieldGroup>
        <Button
          type="button"
          className="w-full"
          disabled={disabled}
          onClick={onExport}
        >
          {exporting ? (
            <LoaderCircle
              data-icon="inline-start"
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Scissors data-icon="inline-start" aria-hidden="true" />
          )}
          {exporting ? m.exporting : m.exportButton}
        </Button>
        {exporting ? (
          <div className="flex flex-col gap-3">
            <progress
              max={100}
              value={progress}
              aria-label={m.progressLabel}
              className="h-2 w-full accent-primary"
            />
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm tabular-nums">{progress}%</span>
              <Button type="button" variant="outline" onClick={onCancel}>
                {m.cancelButton}
              </Button>
            </div>
          </div>
        ) : null}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {m.outputNote}
        </p>
        {result ? (
          <div className="flex flex-col gap-3 rounded-lg border p-4">
            <p role="status" className="text-sm font-medium">
              {m.outputTitle}
            </p>
            {/* oxlint-disable-next-line jsx-a11y/media-has-caption */}
            <audio
              ref={audioRef}
              controls
              className="w-full min-w-0"
              src={result.url}
              aria-label={m.outputPreviewLabel}
              onPlay={onPlay}
            />
            <p className="text-xs text-muted-foreground">
              {m.actualSizeLabel}:{" "}
              <bdi className="tabular-nums">
                {formatBytes(result.bytes, language)}
              </bdi>
            </p>
            <Button asChild>
              <a href={result.url} download={downloadName(name, result.format)}>
                <Download data-icon="inline-start" aria-hidden="true" />
                {m.downloadButton.replace(
                  "{format}",
                  FORMATS[result.format].label
                )}
              </a>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
