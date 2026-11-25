import { Check, TriangleAlert } from "../../../icons"
import { DocumentDownload } from "../document-download"
import type { MeshRepair } from "@workspace/model-mesh/repair"
import type { MeshInspectorMessages } from "../mesh-inspector/messages"
import type { MeshRepairMessages } from "./messages"

const counts = [
  "triangles",
  "duplicateFaces",
  "degenerateFaces",
  "inconsistentEdges",
  "boundaryEdges",
  "nonManifoldEdges",
  "nonManifoldVertices",
] as const

export function RepairReport({
  lang,
  name,
  report,
  previous,
  messages: m,
  meshMessages,
}: {
  lang: string
  name: string
  report: MeshRepair
  previous?: boolean
  messages: MeshRepairMessages
  meshMessages: MeshInspectorMessages
}) {
  const { before, after, flipped, stl } = report
  const count = new Intl.NumberFormat(lang)
  const issuesRemain = after.volume === null
  const status = !stl ? m.empty : issuesRemain ? m.remaining : m.complete
  const StatusIcon = !stl || issuesRemain ? TriangleAlert : Check
  const unchanged = before.triangles === after.triangles && !flipped
  const filename = `${name.replace(/\.stl$/i, "")}-repaired.stl`

  return (
    <section
      aria-label={m.result}
      className="grid min-w-0 gap-4 rounded-lg border bg-background p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-medium">{previous ? m.previous : m.result}</h2>
          <p className="text-sm break-all text-muted-foreground" dir="auto">
            {name}
          </p>
        </div>
        {stl && (
          <DocumentDownload file={stl} filename={filename} label={m.download} />
        )}
      </div>
      <div className="grid gap-1 text-sm">
        <p className="flex items-start gap-2">
          <StatusIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {status}
        </p>
        {unchanged && <p className="text-muted-foreground">{m.unchanged}</p>}
        {flipped > 0 && (
          <p className="text-muted-foreground">
            {m.flipped.replace("{count}", count.format(flipped))}
          </p>
        )}
      </div>
      <table className="w-full table-fixed text-sm">
        <thead className="text-muted-foreground">
          <tr className="border-b">
            <td className="w-3/5" />
            <th
              scope="col"
              className="px-1 pb-2 text-end font-medium break-words"
            >
              {m.before}
            </th>
            <th
              scope="col"
              className="ps-1 pb-2 text-end font-medium break-words"
            >
              {m.after}
            </th>
          </tr>
        </thead>
        <tbody>
          {counts.map((key) => (
            <tr key={key} className="border-b last:border-0">
              <th
                scope="row"
                className="py-2 pe-2 text-start font-normal break-words"
              >
                {meshMessages[key]}
              </th>
              <td className="px-1 py-2 text-end tabular-nums">
                {count.format(before[key])}
              </td>
              <td
                className={`py-2 ps-1 text-end tabular-nums ${after[key] !== before[key] ? "font-semibold" : ""}`}
              >
                {count.format(after[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
