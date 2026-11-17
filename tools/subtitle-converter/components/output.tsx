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
import { SelectItem } from "@workspace/ui/components/ui/select"
import { ArrowRight, Code, Eye, TriangleAlert } from "@workspace/ui/icons"
import { FORMATS } from "../core/formats"
import { clock } from "../core/time"
import { plainText } from "../core/text"
import { batchZip, type Conversion } from "../batch"
import type { Messages } from "../types"
import { SubtitleSelect } from "./subtitle-select"

export function SubtitleOutput({
  results,
  messages: m,
  direction,
}: {
  results: Conversion[]
  messages: Messages
  direction: "ltr" | "rtl"
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
    <Card className="min-w-0 xl:row-span-3 xl:grid xl:grid-rows-subgrid">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2>{m.output}</h2>
          {item ? (
            <span
              className="min-w-0 truncate text-sm font-normal text-muted-foreground"
              title={item.name}
            >
              {item.name}
            </span>
          ) : null}
        </CardTitle>
        {results.length > 1 ? (
          <SubtitleSelect
            direction={direction}
            label={m.output}
            hiddenLabel
            value={String(Math.min(selected, results.length - 1))}
            onChange={(value) => setSelected(Number(value))}
          >
            {results.map((entry, index) => (
              <SelectItem
                key={index}
                value={String(index)}
                aria-label={
                  entry.error
                    ? `${entry.name}: ${m[entry.error as keyof Messages]}`
                    : undefined
                }
              >
                <span className="min-w-0 truncate">{entry.name}</span>
                {entry.error ? (
                  <TriangleAlert
                    aria-hidden="true"
                    className="text-destructive"
                  />
                ) : null}
              </SelectItem>
            ))}
          </SubtitleSelect>
        ) : null}
        {result ? (
          <p
            role="status"
            className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            {FORMATS.find(
              (f) => f.id === result.format
            )!.extension.toUpperCase()}
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 rtl:rotate-180"
            />
            {FORMATS.find(
              (f) => f.id === result.target
            )!.extension.toUpperCase()}{" "}
            · {result.cues.length} {m.cues}
          </p>
        ) : null}
        {result && results.some((entry) => entry.error) ? (
          <ul role="alert" className="space-y-1 text-sm text-destructive">
            {results
              .filter((entry) => entry.error)
              .map((entry) => (
                <li key={entry.name} className="break-words">
                  {entry.name}: {m[entry.error as keyof Messages]}
                </li>
              ))}
          </ul>
        ) : null}
      </CardHeader>
      <CardContent className="grid flex-1 content-start gap-4">
        {!item ? (
          <p className="flex min-h-32 items-center justify-center text-center text-sm text-muted-foreground xl:min-h-64">
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
            {result.target === "txt" ? (
              <p className="flex h-7 items-center text-sm text-muted-foreground">
                {m.text} · TXT
              </p>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant={mode === "preview" ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={mode === "preview"}
                  onClick={() => setMode("preview")}
                >
                  <Eye data-icon="inline-start" aria-hidden="true" />
                  {m.preview}
                </Button>
                <Button
                  variant={mode === "code" ? "secondary" : "ghost"}
                  size="sm"
                  aria-pressed={mode === "code"}
                  onClick={() => setMode("code")}
                >
                  <Code data-icon="inline-start" aria-hidden="true" />
                  {m.code}
                </Button>
              </div>
            )}
            {mode === "code" || result.target === "txt" ? (
              <Textarea
                aria-label={m.code}
                readOnly
                value={result.output}
                rows={10}
                spellCheck={false}
                dir="auto"
                className="h-64 min-h-64 resize-y overflow-y-auto font-mono text-base md:text-sm xl:h-80"
              />
            ) : (
              <div className="max-h-80 overflow-auto rounded-md border xl:h-80">
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
            {mode === "preview" &&
            result.target !== "txt" &&
            result.cues.length > 100 ? (
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
          size="default"
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
