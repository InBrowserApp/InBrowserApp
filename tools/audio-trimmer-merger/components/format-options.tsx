import { useId } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { FORMATS, MP3_BITRATES } from "../core/settings"
import type {
  AudioEditorMessages,
  CompressionQuality,
  ExportSettings,
  OutputFormat,
} from "../types"

export function FormatOptions({
  messages: m,
  settings,
  disabled,
  onChange,
}: {
  messages: AudioEditorMessages
  settings: ExportSettings
  disabled: boolean
  onChange: (value: ExportSettings) => void
}) {
  const id = useId()
  return (
    <>
      <Field>
        <FieldLabel id={`${id}-format`}>{m.formatLabel}</FieldLabel>
        <ToggleGroup
          type="single"
          variant="outline"
          className="w-full"
          value={settings.format}
          disabled={disabled}
          aria-labelledby={`${id}-format`}
          onValueChange={(value) => {
            if (value) onChange({ ...settings, format: value as OutputFormat })
          }}
        >
          {Object.entries(FORMATS).map(([value, format]) => (
            <ToggleGroupItem key={value} value={value} className="flex-1">
              {format.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <FieldDescription>
          {
            {
              mp3: m.formatMp3Note,
              wav: m.formatWavNote,
              ogg: m.formatOggNote,
            }[settings.format]
          }
        </FieldDescription>
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
                    {settings.format === "mp3"
                      ? ` · ${MP3_BITRATES[quality]} kbps`
                      : ""}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {settings.format === "ogg" ? (
            <FieldDescription>{m.oggQualityNote}</FieldDescription>
          ) : null}
        </Field>
      ) : null}
    </>
  )
}
