import { useMemo } from "react"
import { DocumentDownload } from "@workspace/ui/components/tool/document-download"
import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { encodingLabel, type Encoding } from "../config"
import type { ConversionResult, Messages } from "../types"

export function outputFilename(filename: string, encoding: Encoding) {
  const dot = filename.lastIndexOf(".")
  return dot > 0
    ? `${filename.slice(0, dot)}-${encoding}${filename.slice(dot)}`
    : `${filename}-${encoding}`
}

export function OutputPreview({
  result,
  target,
  filename,
  messages: m,
  id,
  lang,
}: {
  result: ConversionResult
  target: Encoding
  filename: string
  messages: Messages
  id: string
  lang: string
}) {
  const blob = useMemo(
    () =>
      result.bytes === null
        ? null
        : new Blob([result.bytes], { type: "application/octet-stream" }),
    [result.bytes]
  )
  if (result.outputPreview === null) return null
  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${id}-output`}>{m.outputPreviewLabel}</FieldLabel>
        <Textarea
          id={`${id}-output`}
          value={result.outputPreview}
          readOnly
          rows={7}
          spellCheck={false}
          dir="auto"
          className="min-h-44 font-mono"
        />
        <FieldDescription>{m.previewNotice}</FieldDescription>
      </Field>
      {blob ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              <bdi>{encodingLabel(target)}</bdi>
            </Badge>
            <Badge variant="outline">
              {result.outputBom ? m.bomAdd : m.bomRemove}
            </Badge>
            <Badge variant="outline">
              {new Intl.NumberFormat(lang).format(blob.size)} {m.bytesLabel}
            </Badge>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p
              className="max-w-full text-sm break-all text-muted-foreground"
              dir="auto"
            >
              {outputFilename(filename, target)}
            </p>
            <DocumentDownload
              file={blob}
              filename={outputFilename(filename, target)}
              label={m.download}
            />
          </div>
          <p className="text-sm text-muted-foreground">{m.downloadHelp}</p>
          <details className="min-w-0">
            <summary className="cursor-pointer rounded-sm text-sm text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring">
              {m.hexLabel}
            </summary>
            <pre
              dir="ltr"
              className="mt-2 text-xs break-all whitespace-pre-wrap"
            >
              {result.hex || m.noneLabel}
            </pre>
          </details>
        </>
      ) : null}
    </>
  )
}
