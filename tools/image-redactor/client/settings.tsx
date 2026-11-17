import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Slider } from "@workspace/ui/components/ui/slider"
import type { Messages } from "../types"
import type { Editor } from "./use-editor"

function Range({
  label,
  value,
  min,
  max,
  onChange,
  onCommit,
  unit = "px",
}: {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  onChange: (value: number) => void
  onCommit: () => void
}) {
  const id = useId()
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <Label id={id}>{label}</Label>
        <span className="text-muted-foreground tabular-nums">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <Slider
        aria-labelledby={id}
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => {
          if (next !== undefined) onChange(next)
        }}
        onValueCommit={onCommit}
      />
    </div>
  )
}

export function Settings({
  editor,
  messages,
}: {
  editor: Editor
  messages: Messages
}) {
  const style = editor.selected ?? editor.style
  const colorId = useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editor.selected ? messages.selectionTitle : messages.effectTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="grid grid-cols-3 gap-2"
          role="group"
          aria-label={messages.effectTitle}
        >
          {(["solid", "blur", "pixelate"] as const).map((effect) => (
            <Button
              key={effect}
              type="button"
              variant={style.effect === effect ? "secondary" : "outline"}
              className="h-auto min-h-20 flex-col gap-2 px-1 py-3 text-xs whitespace-normal"
              aria-pressed={style.effect === effect}
              onClick={() => editor.changeStyle({ effect })}
            >
              <span
                aria-hidden="true"
                className="relative h-6 w-10 overflow-hidden rounded border border-border/50"
                style={
                  effect === "solid"
                    ? { background: style.color }
                    : effect === "pixelate"
                      ? {
                          background:
                            "conic-gradient(#64748b 25%,#cbd5e1 0 50%,#334155 0 75%,#94a3b8 0)",
                          backgroundSize: "12px 12px",
                        }
                      : {
                          background:
                            "linear-gradient(35deg,#334155,#cbd5e1,#64748b)",
                          filter: "blur(2px)",
                        }
                }
              />
              {messages[effect]}
            </Button>
          ))}
        </div>
        {style.effect === "solid" ? (
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor={colorId}>{messages.color}</Label>
            <Input
              id={colorId}
              type="color"
              value={style.color}
              className="h-9 w-16 cursor-pointer p-1"
              onChange={(event) =>
                editor.changeStyle({ color: event.target.value }, true)
              }
              onBlur={() => editor.commit()}
            />
          </div>
        ) : (
          <Range
            label={
              style.effect === "blur" ? messages.blurRadius : messages.pixelSize
            }
            value={style.strength}
            min={4}
            max={100}
            onChange={(strength) => editor.changeStyle({ strength }, true)}
            onCommit={() => editor.commit()}
          />
        )}
        {(editor.tool === "brush" || editor.selected?.shape === "brush") && (
          <Range
            label={messages.brushSize}
            value={style.brushSize}
            min={4}
            max={200}
            onChange={(brushSize) => editor.changeStyle({ brushSize }, true)}
            onCommit={() => editor.commit()}
          />
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">
          {messages.privacyTip}
        </p>
        <div className="space-y-4 border-t pt-4">
          {editor.selected ? (
            <>
              <Range
                label={messages.rotation}
                value={editor.selected.rotation}
                min={-180}
                max={180}
                unit="°"
                onChange={(rotation) => editor.changeStyle({ rotation }, true)}
                onCommit={() => editor.commit()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={editor.remove}
              >
                {messages.deleteSelected}
              </Button>
            </>
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {messages.noSelection}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { Range }
