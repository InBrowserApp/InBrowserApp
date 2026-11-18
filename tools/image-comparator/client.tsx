import { useMemo, useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"
import { Columns2, Layers2, ScanLine } from "@workspace/ui/icons"
import { Adjustment } from "./components/adjustment"
import { Difference } from "./components/difference"
import { ImageInput } from "./components/image-input"
import { ComparisonPreview } from "./components/preview"
import type { Messages, Mode } from "./types"
import { useImageSource } from "./use-image-source"

const modes = [
  { id: "slider", Icon: Columns2 },
  { id: "overlay", Icon: Layers2 },
  { id: "difference", Icon: ScanLine },
] as const

export default function ImageComparator({
  lang,
  messages: m,
}: {
  lang: string
  messages: Messages
}) {
  const before = useImageSource()
  const after = useImageSource()
  const [mode, setMode] = useState<Mode>("slider")
  const [divider, setDivider] = useState(50)
  const [opacity, setOpacity] = useState(50)
  const [tolerance, setTolerance] = useState(0)
  const numbers = useMemo(() => new Intl.NumberFormat(lang), [lang])
  const percent = useMemo(
    () =>
      new Intl.NumberFormat(lang, {
        style: "percent",
        maximumSignificantDigits: 3,
      }),
    [lang]
  )
  const beforeImage = before.image
  const afterImage = after.image
  const dir =
    typeof document !== "undefined" && document.dir === "rtl" ? "rtl" : "ltr"

  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <ImageInput
          label={m.before}
          source={before}
          messages={m}
          numbers={numbers}
        />
        <ImageInput
          label={m.after}
          source={after}
          messages={m}
          numbers={numbers}
        />
      </div>
      <p className="text-xs text-muted-foreground">{m.formatHint}</p>
      {beforeImage && afterImage ? (
        <Card className="min-w-0 py-3 sm:py-4">
          <CardContent className="grid min-w-0 gap-3 px-3 sm:px-4">
            <ToggleGroup
              type="single"
              dir={dir}
              value={mode}
              onValueChange={(next) => {
                if (next) setMode(next as Mode)
              }}
              aria-label={m.comparisonMode}
              variant="outline"
              spacing={2}
              className="w-full flex-wrap"
            >
              {modes.map(({ id, Icon }) => (
                <ToggleGroupItem
                  key={id}
                  value={id}
                  className="h-auto min-h-9 max-w-full whitespace-normal data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Icon aria-hidden="true" className="max-[360px]:hidden" />
                  {m[id]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {mode === "difference" ? (
              beforeImage.bitmap.width === afterImage.bitmap.width &&
              beforeImage.bitmap.height === afterImage.bitmap.height ? (
                <Difference
                  key={`${beforeImage.id}-${afterImage.id}`}
                  before={beforeImage.bitmap}
                  after={afterImage.bitmap}
                  dir={dir}
                  tolerance={tolerance}
                  setTolerance={setTolerance}
                  messages={m}
                  numbers={numbers}
                  percent={percent}
                />
              ) : (
                <p
                  role="status"
                  className="rounded-md bg-muted p-3 text-sm text-muted-foreground"
                >
                  {m.differentSizes}
                </p>
              )
            ) : (
              <>
                {mode === "overlay" && (
                  <Adjustment
                    label={m.opacity}
                    dir={dir}
                    value={opacity}
                    onChange={setOpacity}
                    percent={percent}
                  />
                )}
                <ComparisonPreview
                  before={beforeImage.bitmap}
                  after={afterImage.bitmap}
                  isSlider={mode === "slider"}
                  value={mode === "slider" ? divider : opacity}
                  setDivider={setDivider}
                  messages={m}
                  percent={percent}
                />
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid min-h-40 place-items-center rounded-lg border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
          <div className="grid justify-items-center gap-2">
            <Columns2 className="size-6" aria-hidden="true" />
            <p>{m.addImages}</p>
          </div>
        </div>
      )}
    </div>
  )
}
