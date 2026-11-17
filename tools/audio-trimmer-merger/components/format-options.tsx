import { useId } from "react"
import {
  Field,
  FieldDescription,
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
import { bitrate, FORMATS } from "../core/settings"
import type {
  AudioEditorMessages,
  CompressionQuality,
  ExportSettings,
  OutputFormat,
  NativeSupport,
} from "../types"

export function FormatOptions({
  messages: m,
  settings,
  nativeSupport,
  disabled,
  onChange,
}: {
  messages: AudioEditorMessages
  settings: ExportSettings
  nativeSupport: NativeSupport | null
  disabled: boolean
  onChange: (value: ExportSettings) => void
}) {
  const id = useId()
  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${id}-format`}>{m.formatLabel}</FieldLabel>
        <Select
          value={settings.format}
          disabled={disabled || nativeSupport === null}
          onValueChange={(value) => {
            if (value) onChange({ ...settings, format: value as OutputFormat })
          }}
        >
          <SelectTrigger
            id={`${id}-format`}
            className="w-full"
            aria-describedby={`${id}-format-help`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(FORMATS).map(([value, format]) => (
                <SelectItem
                  key={value}
                  value={value}
                  disabled={
                    (value === "m4a" || value === "webm") &&
                    !nativeSupport?.[value]
                  }
                >
                  {format.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription id={`${id}-format-help`}>
          {
            {
              mp3: m.formatMp3Note,
              wav: m.formatWavNote,
              ogg: m.formatOggNote,
              m4a: m.formatM4aNote,
              webm: m.formatWebmNote,
            }[settings.format]
          }
        </FieldDescription>
        <FieldDescription>{m.nativeFormatsNote}</FieldDescription>
        {nativeSupport === null ? (
          <p role="status" className="text-sm text-muted-foreground">
            {m.checkingFormats}
          </p>
        ) : (settings.format === "m4a" || settings.format === "webm") &&
          !nativeSupport[settings.format] ? (
          <p role="status" className="text-sm text-destructive">
            {m.formatUnavailable}
          </p>
        ) : null}
      </Field>
      {settings.format !== "wav" ? (
        <Field>
          <FieldLabel htmlFor={`${id}-quality`}>{m.qualityLabel}</FieldLabel>
          <Select
            value={settings.quality}
            disabled={disabled}
            onValueChange={(value) =>
              onChange({ ...settings, quality: value as CompressionQuality })
            }
          >
            <SelectTrigger id={`${id}-quality`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {(["small", "standard", "high"] as const).map((quality) => (
                  <SelectItem key={quality} value={quality}>
                    {
                      {
                        small: m.qualitySmall,
                        standard: m.qualityStandard,
                        high: m.qualityHigh,
                      }[quality]
                    }
                    {settings.format !== "ogg" && settings.format !== "wav"
                      ? ` · ${bitrate(settings.format, quality)} kbps`
                      : ""}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {settings.format !== "mp3" ? (
            <FieldDescription>{m.oggQualityNote}</FieldDescription>
          ) : null}
        </Field>
      ) : null}
    </>
  )
}
