import { useId } from "react"
import { DocumentNumberInput } from "./document-number-input"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

type Messages = Record<
  | "format"
  | "quality"
  | "qualityHint"
  | "background"
  | "white"
  | "black"
  | "custom"
  | "color",
  string
>
export function RasterExportOptions({
  format,
  onFormat,
  jpeg,
  onJpeg,
  disabled,
  messages: m,
}: {
  format: "png" | "jpg"
  onFormat?: (format: "png" | "jpg") => void
  jpeg: { quality: number; background: string }
  onJpeg: (value: typeof jpeg) => void
  disabled: boolean
  messages: Messages
}) {
  const id = useId()
  const background =
    jpeg.background === "#ffffff"
      ? "white"
      : jpeg.background === "#000000"
        ? "black"
        : "custom"
  return (
    <fieldset
      disabled={disabled}
      className="mb-3 flex min-w-0 flex-wrap items-end gap-3"
    >
      {onFormat ? (
        <div className="grid min-w-0 gap-1.5">
          <Label htmlFor={`${id}-format`}>{m.format}</Label>
          <Select
            value={format}
            onValueChange={(value) => onFormat(value === "jpg" ? "jpg" : "png")}
            disabled={disabled}
          >
            <SelectTrigger id={`${id}-format`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPG</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {format === "jpg" ? (
        <>
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor={`${id}-quality`}>{m.quality}</Label>
            <DocumentNumberInput
              id={`${id}-quality`}
              aria-describedby={`${id}-hint`}
              value={jpeg.quality}
              min={1}
              max={100}
              className="w-24"
              onCommit={(quality) => onJpeg({ ...jpeg, quality })}
            />
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor={`${id}-background`}>{m.background}</Label>
            <Select
              value={background}
              onValueChange={(value) =>
                onJpeg({
                  ...jpeg,
                  background:
                    value === "white"
                      ? "#ffffff"
                      : value === "black"
                        ? "#000000"
                        : "#808080",
                })
              }
              disabled={disabled}
            >
              <SelectTrigger id={`${id}-background`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">{m.white}</SelectItem>
                <SelectItem value="black">{m.black}</SelectItem>
                <SelectItem value="custom">{m.custom}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid min-w-0 gap-1.5">
            <Label htmlFor={`${id}-color`}>{m.color}</Label>
            <Input
              id={`${id}-color`}
              type="color"
              value={jpeg.background}
              onChange={(event) =>
                onJpeg({ ...jpeg, background: event.target.value })
              }
              className="w-20 cursor-pointer p-1"
            />
          </div>
          <p
            id={`${id}-hint`}
            className="basis-full text-xs text-muted-foreground"
          >
            {m.qualityHint}
          </p>
        </>
      ) : null}
    </fieldset>
  )
}
