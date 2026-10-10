import type { Loaded, Messages } from "./types"

export function Mapping({
  info,
  messages: m,
}: {
  info: Loaded
  messages: Messages
}) {
  return (
    <details className="rounded-md border p-3">
      <summary className="cursor-pointer font-medium">{m.mapping}</summary>
      <p className="my-3 text-sm text-muted-foreground">{m.mappingNote}</p>
      <ol className="flex max-h-64 flex-col gap-3 overflow-auto text-sm">
        {info.sheets.map((sheet) => (
          <li key={sheet.name} className="flex flex-col gap-1 wrap-anywhere">
            <span>
              {m.sourceSheet}: <bdi>{sheet.source?.sheet}</bdi>
            </span>
            <span>
              {m.sourceTable}: <bdi>{sheet.source?.table}</bdi>
            </span>
            <span>
              {m.outputSheet}: <bdi className="font-medium">{sheet.name}</bdi>
            </span>
          </li>
        ))}
      </ol>
    </details>
  )
}
