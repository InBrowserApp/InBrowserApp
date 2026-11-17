/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable schema text needs keyboard access. */
import { ResultTable } from "./result-table"
import type {
  DatabaseObject,
  Messages,
  Structure as StructureData,
} from "../types"

export function Structure({
  object,
  structure,
  messages: m,
  lang,
}: {
  object: DatabaseObject | undefined
  structure: StructureData | null
  messages: Messages
  lang: string
}) {
  if (!object || !structure || structure.name !== object.name)
    return <p className="py-6 text-sm text-muted-foreground">{m.chooseTable}</p>
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">{m.definition}</h2>
        <pre
          dir="ltr"
          tabIndex={0}
          className="max-h-64 overflow-auto rounded-lg border bg-muted/30 p-3 text-xs"
        >
          <code>{object.sql}</code>
        </pre>
      </div>
      <ResultTable
        result={structure.columns}
        title={m.columns}
        messages={m}
        lang={lang}
      />
      {(["indexes", "foreignKeys"] as const).map((key) => (
        <details key={key} className="min-w-0">
          <summary className="cursor-pointer text-sm font-medium">
            {m[key]} (
            {new Intl.NumberFormat(lang).format(structure[key].rows.length)})
          </summary>
          <div className="mt-3">
            <ResultTable
              result={structure[key]}
              title={m[key]}
              messages={m}
              lang={lang}
            />
          </div>
        </details>
      ))}
    </div>
  )
}
