import { Card, CardContent } from "@workspace/ui/components/ui/card"
import type { Feature, Geometry } from "geojson"

type Messages = Readonly<
  Record<"features" | "feature" | "attributes" | "noAttributes", string>
>

const selectClass =
  "h-9 min-w-0 max-w-full rounded-md border border-input bg-background px-2 text-sm"

export function FeatureInspector({
  features,
  selected,
  onSelect,
  messages: m,
  lang,
  formatValue,
}: {
  features: readonly Feature<Geometry | null>[]
  selected: number
  onSelect: (index: number) => void
  messages: Messages
  lang: string
  formatValue?: (value: unknown) => string | undefined
}) {
  const number = new Intl.NumberFormat(lang)
  const properties = Object.entries(features[selected]?.properties ?? {})
  return (
    <Card className="min-w-0">
      <CardContent className="grid min-w-0 gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-semibold">{m.features}</h2>
          <span className="text-sm text-muted-foreground tabular-nums">
            {number.format(features.length)}
          </span>
        </div>
        {features.length > 0 && (
          <>
            <select
              aria-label={m.features}
              className={selectClass}
              value={selected}
              onChange={(event) => onSelect(Number(event.target.value))}
            >
              {features.map(({ properties }, index) => {
                const name = properties?.name ?? properties?.NAME
                return (
                  <option key={index} value={index}>
                    {typeof name === "string" && name.trim()
                      ? name
                      : m.feature.replace("{number}", number.format(index + 1))}
                  </option>
                )
              })}
            </select>
            <h3 className="text-sm font-medium">{m.attributes}</h3>
            {properties.length ? (
              <dl className="grid gap-2 text-sm">
                {properties.map(([key, value]) => (
                  <div key={key} className="grid gap-0.5 border-t pt-2">
                    <dt
                      dir="auto"
                      className="text-xs wrap-anywhere text-muted-foreground"
                    >
                      {key}
                    </dt>
                    <dd dir="auto" className="wrap-anywhere">
                      {formatValue?.(value) ??
                        (typeof value === "string"
                          ? value
                          : JSON.stringify(value))}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">{m.noAttributes}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
