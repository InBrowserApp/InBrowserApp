import {
  FORMATS,
  type Options,
  type Format,
  type InputFormat,
} from "../core/formats"
import type { Messages } from "../types"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"

export const selectClass =
  "h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm"

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
  return (
    <Card>
      <CardContent className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid min-w-0 gap-2 text-sm font-medium">
            {m.source}
            <select
              className={selectClass}
              value={options.source}
              onChange={(e) =>
                onChange({ ...options, source: e.target.value as InputFormat })
              }
            >
              <option value="auto">{m.auto}</option>
              {FORMATS.filter((f) => f.id !== "txt").map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid min-w-0 gap-2 text-sm font-medium">
            {m.target}
            <select
              className={selectClass}
              value={options.target}
              onChange={(e) =>
                onChange({ ...options, target: e.target.value as Format })
              }
            >
              {FORMATS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">
            {m.options}
          </summary>
          <div className="mt-4 grid items-start gap-4 md:grid-cols-3">
            <label className="grid gap-2 font-medium">
              {m.encoding}
              <select
                className={selectClass}
                value={encoding}
                onChange={(e) => onEncoding(e.target.value)}
              >
                <option value="auto">{m.encodingAuto}</option>
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
                  <option key={name} value={name}>
                    {name.toUpperCase()}
                  </option>
                ))}
              </select>
              <span className="text-xs font-normal text-muted-foreground">
                {m.encodingHint}
              </span>
            </label>
            <label className="grid gap-2 font-medium">
              {m.fps}
              <Input
                type="number"
                min="1"
                max="120"
                step="any"
                value={Number.isNaN(options.fps) ? "" : options.fps}
                onChange={(e) =>
                  onChange({ ...options, fps: e.target.valueAsNumber })
                }
              />
              <span className="text-xs font-normal text-muted-foreground">
                {m.fpsHint}
              </span>
            </label>
            <label className="grid gap-2 font-medium">
              {m.offset}
              <Input
                type="number"
                step="1"
                value={Number.isNaN(options.offset) ? "" : options.offset}
                onChange={(e) =>
                  onChange({ ...options, offset: e.target.valueAsNumber })
                }
              />
              <span className="text-xs font-normal text-muted-foreground">
                {m.offsetHint}
              </span>
            </label>
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
