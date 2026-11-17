import { useMemo, useState } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { FORMATS } from "../core/formats"
import { clock } from "../core/time"
import { plainText } from "../core/text"
import { batchZip, type Conversion } from "../batch"
import type { Messages } from "../types"
import { selectClass } from "./settings"

export function SubtitleOutput({
  results,
  messages: m,
}: {
  results: Conversion[]
  messages: Messages
}) {
  const [selected, setSelected] = useState(0)
  const [mode, setMode] = useState("preview")
  const item = results[Math.min(selected, results.length - 1)]
  const result = item?.result
  const file = useMemo(
    () => (result ? new Blob([result.output], { type: result.mime }) : null),
    [result]
  )
  const zip = useMemo(
    () =>
      results.filter((entry) => entry.result).length > 1
        ? batchZip(results)
        : null,
    [results]
  )
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>{m.output}</CardTitle>
        {results.length > 1 ? (
          <select
            aria-label={m.output}
            className={selectClass}
            value={Math.min(selected, results.length - 1)}
            onChange={(e) => setSelected(Number(e.target.value))}
          >
            {results.map((entry, index) => (
              <option key={index} value={index}>
                {entry.name}
                {entry.error ? ` — ${m[entry.error as keyof Messages]}` : ""}
              </option>
            ))}
          </select>
        ) : null}
        {result ? (
          <p role="status" className="text-sm text-muted-foreground">
            {m.detected}: {FORMATS.find((f) => f.id === result.format)!.label} ·{" "}
            {result.cues.length} {m.cues}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="grid flex-1 content-start gap-4">
        {!item ? (
          <p className="flex min-h-64 items-center justify-center text-center text-sm text-muted-foreground">
            {m.emptyOutput}
          </p>
        ) : item.error ? (
          <p
            role="alert"
            className="rounded-md border border-destructive/40 p-4 text-sm text-destructive"
          >
            {m[item.error as keyof Messages]}
          </p>
        ) : null}
        {result ? (
          <>
            <div className="flex gap-2">
              <Button
                variant={mode === "preview" ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mode === "preview"}
                onClick={() => setMode("preview")}
              >
                {m.preview}
              </Button>
              <Button
                variant={mode === "code" ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mode === "code"}
                onClick={() => setMode("code")}
              >
                {m.code}
              </Button>
            </div>
            {mode === "code" ? (
              <Textarea
                aria-label={m.code}
                readOnly
                value={result.output}
                rows={10}
                spellCheck={false}
                dir="auto"
                className="min-h-64 font-mono text-sm"
              />
            ) : (
              <div className="max-h-80 min-h-64 overflow-auto rounded-md border">
                <table className="w-full text-start text-sm">
                  <thead className="sticky top-0 bg-muted">
                    <tr>
                      <th className="p-2 text-start">{m.start}</th>
                      <th className="p-2 text-start">{m.end}</th>
                      <th className="p-2 text-start">{m.text}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.cues.slice(0, 100).map((cue, index) => (
                      <tr key={index} className="border-t">
                        <td
                          className="p-2 align-top font-mono text-xs whitespace-nowrap"
                          dir="ltr"
                        >
                          {clock(cue.start)}
                        </td>
                        <td
                          className="p-2 align-top font-mono text-xs whitespace-nowrap"
                          dir="ltr"
                        >
                          {clock(cue.end)}
                        </td>
                        <td
                          className="p-2 align-top break-words whitespace-pre-wrap"
                          dir="auto"
                        >
                          {plainText(cue.text)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {result.cues.length > 100 ? (
              <p className="text-xs text-muted-foreground">{m.previewLimit}</p>
            ) : null}
            {result.notes
              .filter((note) => note !== "fidelity")
              .map((note) => (
                <p key={note} className="text-xs text-muted-foreground">
                  {m[note as keyof Messages]}
                </p>
              ))}
          </>
        ) : null}
      </CardContent>
      <CardFooter className="flex-wrap justify-end gap-2 border-t">
        <ToolCopyButton
          value={result?.output ?? ""}
          copyLabel={m.copy}
          copiedLabel={m.copied}
          disabled={!result}
        />
        {file ? (
          <DocumentDownload
            file={file}
            filename={item!.name}
            label={m.download}
          />
        ) : (
          <Button disabled>{m.download}</Button>
        )}
        {zip ? (
          <DocumentDownload
            file={zip}
            filename="subtitles.zip"
            label={m.downloadAll}
          />
        ) : null}
      </CardFooter>
    </Card>
  )
}
