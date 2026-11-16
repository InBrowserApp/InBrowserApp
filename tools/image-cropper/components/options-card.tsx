import { useId } from "react"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import {
  Crop,
  FlipHorizontal2,
  FlipVertical2,
  LoaderCircle,
  RotateCcw,
  RotateCw,
  Undo2,
} from "@workspace/ui/icons"
import { pixelCrop, updatePixelCrop } from "../core/crop"
import type { Cropper } from "../client/use-image-cropper"
import type { Messages, OutputFormat } from "../client/types"

export function OptionsCard({ state: s, m }: { state: Cropper; m: Messages }) {
  const id = useId()
  const presets = [
    ["free", m.free],
    ["original", m.original],
    ["1", "1:1"],
    [String(4 / 3), "4:3"],
    [String(3 / 4), "3:4"],
    [String(16 / 9), "16:9"],
    [String(9 / 16), "9:16"],
    ["1.5", "3:2"],
    [String(2 / 3), "2:3"],
  ] as const
  const area = s.size
    ? pixelCrop(s.crop, s.size)
    : { x: 0, y: 0, width: 0, height: 0 }
  const disabled = !s.source || s.loading || s.processing
  function rotate(degrees: number) {
    s.changeTransform({
      rotation: (s.transform.rotation + degrees) % 360,
      flipHorizontal: s.transform.flipVertical,
      flipVertical: s.transform.flipHorizontal,
    })
  }
  const actions = [
    {
      label: m.rotateLeft,
      icon: RotateCcw,
      run: () => rotate(270),
    },
    {
      label: m.rotateRight,
      icon: RotateCw,
      run: () => rotate(90),
    },
    {
      label: m.flipHorizontal,
      icon: FlipHorizontal2,
      pressed: s.transform.flipHorizontal,
      run: () =>
        s.changeTransform({
          ...s.transform,
          flipHorizontal: !s.transform.flipHorizontal,
        }),
    },
    {
      label: m.flipVertical,
      icon: FlipVertical2,
      pressed: s.transform.flipVertical,
      run: () =>
        s.changeTransform({
          ...s.transform,
          flipVertical: !s.transform.flipVertical,
        }),
    },
  ]
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{m.optionsTitle}</CardTitle>
        <CardDescription>{m.optionsDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <fieldset disabled={disabled}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`${id}-ratio`}>{m.aspectRatio}</FieldLabel>
              <Select
                value={s.ratio}
                onValueChange={s.changeRatio}
                disabled={disabled}
              >
                <SelectTrigger id={`${id}-ratio`} className="w-full">
                  <SelectValue>
                    {presets.find(([value]) => value === s.ratio)?.[1]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {presets.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <FieldSet>
              <FieldLegend variant="label">{m.transform}</FieldLegend>
              <div className="flex flex-wrap gap-2">
                {actions.map(({ label, icon: Icon, run, pressed }) => (
                  <Button
                    key={label}
                    variant="outline"
                    size="icon"
                    type="button"
                    aria-label={label}
                    title={label}
                    aria-pressed={pressed}
                    onClick={run}
                  >
                    <Icon aria-hidden="true" />
                  </Button>
                ))}
              </div>
            </FieldSet>
            <FieldSet>
              <FieldLegend variant="label">{m.selection}</FieldLegend>
              <FieldGroup className="grid grid-cols-2 gap-3">
                {(["x", "y", "width", "height"] as const).map((field) => (
                  <Field key={field}>
                    <FieldLabel htmlFor={`${id}-${field}`}>
                      {m[field]}
                    </FieldLabel>
                    <Input
                      id={`${id}-${field}`}
                      name={field}
                      type="number"
                      inputMode="numeric"
                      min={field === "x" || field === "y" ? 0 : 1}
                      max={
                        s.size?.[
                          field === "x" || field === "width"
                            ? "width"
                            : "height"
                        ]
                      }
                      step={1}
                      value={area[field]}
                      onChange={(event) => {
                        if (s.size)
                          s.changeCrop(
                            updatePixelCrop(
                              s.crop,
                              s.size,
                              field,
                              Number(event.target.value),
                              s.aspect
                            )
                          )
                      }}
                    />
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>
            <Field>
              <FieldLabel>{m.format}</FieldLabel>
              <ToggleGroup
                type="single"
                value={s.format}
                onValueChange={(value) => {
                  if (value) s.changeFormat(value as OutputFormat)
                }}
                aria-label={m.format}
                variant="outline"
                disabled={disabled}
              >
                <ToggleGroupItem value="image/png">PNG</ToggleGroupItem>
                <ToggleGroupItem value="image/jpeg">JPEG</ToggleGroupItem>
                <ToggleGroupItem value="image/webp">WebP</ToggleGroupItem>
              </ToggleGroup>
              {s.format === "image/jpeg" ? (
                <FieldDescription>{m.jpegHint}</FieldDescription>
              ) : null}
            </Field>
            {s.format !== "image/png" ? (
              <Field>
                <FieldLabel htmlFor={`${id}-quality`}>{m.quality}</FieldLabel>
                <Input
                  id={`${id}-quality`}
                  name="quality"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={100}
                  value={s.quality}
                  onChange={(event) =>
                    s.changeQuality(
                      Math.max(
                        1,
                        Math.min(100, Number(event.target.value) || 1)
                      )
                    )
                  }
                />
              </Field>
            ) : null}
          </FieldGroup>
        </fieldset>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <Button variant="ghost" disabled={disabled} onClick={s.reset}>
          <Undo2 data-icon="inline-start" aria-hidden="true" />
          {m.reset}
        </Button>
        <Button
          disabled={disabled}
          onClick={() => {
            void s.runExport()
          }}
        >
          {s.processing ? (
            <LoaderCircle
              data-icon="inline-start"
              className="motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Crop data-icon="inline-start" aria-hidden="true" />
          )}
          {s.processing ? m.processing : m.export}
        </Button>
      </CardFooter>
    </Card>
  )
}
