import { Button } from "@workspace/ui/components/ui/button"
import { interpolate, type Diagnostic, type Messages } from "../types"

type Props = {
  diagnostics: Diagnostic[]
  messages: Messages
  onLine: (line: number) => void
  id: string
}

export function Diagnostics({ diagnostics, messages, onLine, id }: Props) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {diagnostics.length ? (
        <section
          aria-label={messages.diagnosticsLabel}
          className="mt-4 space-y-2"
        >
          <h2 className="text-sm font-medium">{messages.diagnosticsLabel}</h2>
          <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
            {diagnostics.map((item, index) => (
              <li
                key={index}
                className={`rounded-md border p-3 break-words ${item.severity === "error" ? "border-destructive/40 text-destructive" : "border-amber-500/40 text-amber-800 dark:text-amber-300"}`}
              >
                {item.line ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-inherit"
                    onClick={() => onLine(item.line!)}
                  >
                    {interpolate(messages.lineLabel, { line: item.line })}
                  </Button>
                ) : null}
                <p>
                  {interpolate(messages.diagnostics[item.code], { ...item })}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
