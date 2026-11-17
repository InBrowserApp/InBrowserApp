import { useId } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { validJoin } from "../core/mix"
import type {
  AudioEditorMessages,
  ExportSettings,
  JoinSettings,
} from "../types"

export function JoinOptions({
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
  const valid = validJoin(settings.join)
  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${id}-mode`}>{m.joinLabel}</FieldLabel>
        <Select
          value={settings.join.mode}
          disabled={disabled}
          onValueChange={(value) =>
            onChange({
              ...settings,
              join: { ...settings.join, mode: value as JoinSettings["mode"] },
            })
          }
        >
          <SelectTrigger id={`${id}-mode`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">{m.joinNone}</SelectItem>
              <SelectItem value="gap">{m.joinGap}</SelectItem>
              <SelectItem value="crossfade">{m.joinCrossfade}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      {settings.join.mode !== "none" ? (
        <Field data-invalid={!valid}>
          <FieldLabel htmlFor={`${id}-seconds`}>
            {m.joinSecondsLabel}
          </FieldLabel>
          <Input
            id={`${id}-seconds`}
            name="join-seconds"
            type="number"
            inputMode="decimal"
            autoComplete="off"
            min={0}
            max={5}
            step="0.1"
            dir="ltr"
            disabled={disabled}
            aria-invalid={!valid}
            aria-describedby={
              !valid
                ? `${id}-error`
                : settings.join.mode === "crossfade"
                  ? `${id}-help`
                  : undefined
            }
            value={
              Number.isNaN(settings.join.seconds) ? "" : settings.join.seconds
            }
            onChange={(event) =>
              onChange({
                ...settings,
                join: { ...settings.join, seconds: event.target.valueAsNumber },
              })
            }
          />
          {!valid ? (
            <FieldError id={`${id}-error`}>{m.joinError}</FieldError>
          ) : null}
          {settings.join.mode === "crossfade" ? (
            <FieldDescription id={`${id}-help`}>{m.joinNote}</FieldDescription>
          ) : null}
        </Field>
      ) : null}
    </>
  )
}
