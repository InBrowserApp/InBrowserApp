import { useId } from "react"
import {
  FORMATS,
  type Options,
  type Format,
  type InputFormat,
} from "../core/formats"
import type { Messages } from "../types"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { SelectItem } from "@workspace/ui/components/ui/select"
import { SubtitleSelect } from "./subtitle-select"

export function Settings({
  options,
  encoding,
  onChange,
  onEncoding,
  messages: m,
}: {
  options: Options
  encoding: string
  onChange: (options: Options) => void
  onEncoding: (encoding: string) => void
  messages: Messages
}) {
  const id = useId()
  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <SubtitleSelect
            label={m.source}
            value={options.source}
            onChange={(source) =>
              onChange({ ...options, source: source as InputFormat })
            }
          >
            <SelectItem value="auto">{m.auto}</SelectItem>
            {FORMATS.filter((f) => f.id !== "txt").map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.label}
              </SelectItem>
            ))}
          </SubtitleSelect>
          <SubtitleSelect
            label={m.target}
            value={options.target}
            onChange={(target) =>
              onChange({ ...options, target: target as Format })
            }
          >
            {FORMATS.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.id === "txt" ? `${m.text} · TXT` : f.label}
              </SelectItem>
            ))}
          </SubtitleSelect>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">
            {m.options}
          </summary>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-3">
            <SubtitleSelect
              label={m.encoding}
              value={encoding}
              onChange={onEncoding}
              hint={m.encodingHint}
            >
              <SelectItem value="auto">{m.encodingAuto}</SelectItem>
              {[
                "utf-8",
                "utf-16le",
                "utf-16be",
                "windows-1252",
                "windows-1251",
                "gb18030",
                "big5",
                "shift_jis",
                "euc-kr",
              ].map((name) => (
                <SelectItem key={name} value={name}>
                  {name.toUpperCase()}
                </SelectItem>
              ))}
            </SubtitleSelect>
            <Field className="gap-2">
              <FieldLabel htmlFor={`${id}-fps`}>{m.fps}</FieldLabel>
              <Input
                id={`${id}-fps`}
                className="h-10"
                aria-describedby={`${id}-fps-hint`}
                type="number"
                min="1"
                max="120"
                step="any"
                value={Number.isNaN(options.fps) ? "" : options.fps}
                onChange={(e) =>
                  onChange({ ...options, fps: e.target.valueAsNumber })
                }
              />
              <FieldDescription
                id={`${id}-fps-hint`}
                className="text-start text-xs"
              >
                {m.fpsHint}
              </FieldDescription>
            </Field>
            <Field className="gap-2">
              <FieldLabel htmlFor={`${id}-offset`}>{m.offset}</FieldLabel>
              <Input
                id={`${id}-offset`}
                className="h-10"
                aria-describedby={`${id}-offset-hint`}
                type="number"
                step="1"
                value={Number.isNaN(options.offset) ? "" : options.offset}
                onChange={(e) =>
                  onChange({ ...options, offset: e.target.valueAsNumber })
                }
              />
              <FieldDescription
                id={`${id}-offset-hint`}
                className="text-start text-xs"
              >
                {m.offsetHint}
              </FieldDescription>
            </Field>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
