import { useState } from "react"
import { Check, Info } from "../../../icons"
import { Badge } from "../../ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import type { MeshReport } from "@workspace/model-mesh/inspect"
import type { MeshInspectorMessages } from "./messages"

const units = {
  unitless: "",
  millimeter: "mm",
  centimeter: "cm",
  meter: "m",
  inch: "in",
  foot: "ft",
} as const
type Unit = keyof typeof units

const meshCounts = ["triangles", "vertices", "shells"] as const
const topologyChecks = [
  "boundaryEdges",
  "nonManifoldEdges",
  "nonManifoldVertices",
  "inconsistentEdges",
  "degenerateFaces",
  "duplicateFaces",
] as const

export function InspectionReport({
  report,
  name,
  previous,
  lang,
  messages: m,
}: {
  report: MeshReport
  name: string
  previous: boolean
  lang: string
  messages: MeshInspectorMessages
}) {
  const [unit, setUnit] = useState<Unit>("unitless")
  const count = new Intl.NumberFormat(lang)
  const measure = new Intl.NumberFormat(lang, { maximumSignificantDigits: 6 })

  function format(value: number, exponent: string) {
    return units[unit]
      ? `${measure.format(value)} ${units[unit]}${exponent}`
      : measure.format(value)
  }

  return (
    <section
      className="grid min-w-0 gap-4 rounded-lg border bg-background p-4 sm:p-5"
      aria-label={m.result}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">
            {previous ? m.previous : m.result}
          </p>
          <p dir="auto" className="font-medium break-all">
            {name}
          </p>
        </div>
        <Badge variant="outline" className="inline-flex max-w-full gap-1.5">
          {report.volume === null ? (
            <Info aria-hidden="true" />
          ) : (
            <Check aria-hidden="true" />
          )}
          {report.volume === null ? m.issues : m.closed}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {m.coordinateUnit}
        </span>
        <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
          <SelectTrigger size="sm" aria-label={m.coordinateUnit}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {(Object.keys(units) as Unit[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {m[key]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md bg-muted/55 p-3">
          <dt className="text-sm text-muted-foreground">{m.volume}</dt>
          <dd className="text-2xl font-semibold break-words tabular-nums">
            {report.volume === null ? (
              "—"
            ) : (
              <bdi>{format(report.volume, "³")}</bdi>
            )}
          </dd>
          {report.volume === null && (
            <dd className="mt-0.5 text-xs text-muted-foreground">
              {m.noVolume}
            </dd>
          )}
        </div>
        <div className="min-w-0 rounded-md bg-muted/55 p-3">
          <dt className="text-sm text-muted-foreground">{m.area}</dt>
          <dd className="text-2xl font-semibold break-words tabular-nums">
            <bdi>{format(report.surfaceArea, "²")}</bdi>
          </dd>
        </div>
      </dl>
      <dl className="grid grid-cols-3 gap-2 border-b pb-3">
        {meshCounts.map((key) => (
          <div key={key} className="min-w-0">
            <dt className="text-xs break-words text-muted-foreground">
              {m[key]}
            </dt>
            <dd className="font-mono text-sm break-words">
              {count.format(report[key])}
            </dd>
          </div>
        ))}
      </dl>
      <div>
        <h2 className="mb-1.5 text-sm font-semibold">{m.checks}</h2>
        <dl className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
          {topologyChecks.map((key) => (
            <div
              key={key}
              className="flex items-baseline justify-between gap-2 border-b py-1.5 last:border-b-0"
            >
              <dt className="min-w-0 text-sm text-muted-foreground">
                {m[key]}
              </dt>
              <dd
                className={
                  report[key]
                    ? "font-mono text-sm font-semibold"
                    : "font-mono text-sm text-muted-foreground"
                }
              >
                {count.format(report[key])}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
