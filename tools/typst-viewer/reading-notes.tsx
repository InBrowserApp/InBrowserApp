import type { Diagnostic, Messages } from "./types"

export function ReadingNotes({
  messages: m,
  diagnostics,
  failed,
}: {
  messages: Messages
  diagnostics: Diagnostic[]
  failed: boolean
}) {
  return (
    <details
      className="max-h-48 shrink-0 overflow-auto border-t px-3 py-1"
      open={failed || diagnostics.length > 0 ? true : undefined}
    >
      <summary className="cursor-pointer rounded-sm py-1 text-sm focus-visible:outline-2 focus-visible:outline-ring">
        {diagnostics.length ? m.diagnostics : m.compatibility}
      </summary>
      <div className="flex flex-col gap-2 pb-2 text-xs text-muted-foreground">
        {diagnostics.length ? <p>{m.diagnosticLanguage}</p> : null}
        {diagnostics.map((item, index) => (
          <p key={index} className="break-words text-foreground" dir="auto">
            {item.line !== null && item.column !== null ? (
              <strong className="font-medium">
                {m.location
                  .replace("{line}", String(item.line))
                  .replace("{column}", String(item.column))}
                {": "}
              </strong>
            ) : null}
            {item.message}
          </p>
        ))}
        <p>{m.dependencyNote}</p>
        <p>{m.fontNote}</p>
        <p>{m.runtimeNote}</p>
      </div>
    </details>
  )
}
