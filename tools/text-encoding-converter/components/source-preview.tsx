import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { encodingLabel } from "../config"
import type { Encoding } from "../config"
import type { ConversionResult, Messages } from "../types"

export function SourcePreview({
  result,
  messages: m,
  id,
  lang,
  onSource,
}: {
  result: ConversionResult
  messages: Messages
  id: string
  lang: string
  onSource: (source: Encoding) => void
}) {
  const format = new Intl.NumberFormat(lang)
  const endings =
    Object.entries(result.lineEndings)
      .filter(([, count]) => count > 0)
      .map(
        ([ending, count]) => `${ending.toUpperCase()} × ${format.format(count)}`
      )
      .join(" · ") || m.noneLabel
  return (
    <FieldGroup>
      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="secondary">
          {m.sourceEncodingLabel}:{" "}
          <bdi>{encodingLabel(result.sourceEncoding)}</bdi>
        </Badge>
        <Badge variant="outline">
          {m.sourceBomLabel}:{" "}
          <bdi>{result.sourceBom?.toUpperCase() ?? m.noneLabel}</bdi>
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        {m.sourceLineEndingsLabel}: <bdi>{endings}</bdi>
      </p>
      <Field>
        <FieldLabel htmlFor={`${id}-decoded`}>
          {m.sourcePreviewLabel}
        </FieldLabel>
        <Textarea
          id={`${id}-decoded`}
          value={result.sourcePreview}
          readOnly
          rows={7}
          spellCheck={false}
          dir="auto"
          className="field-sizing-fixed h-48 min-h-44 resize-y font-mono"
        />
        <FieldDescription>{m.previewNotice}</FieldDescription>
      </Field>
      <details className="min-w-0">
        <summary className="cursor-pointer rounded-sm text-sm font-medium focus-visible:outline-2 focus-visible:outline-ring">
          {m.compareLabel}
        </summary>
        <p className="my-3 text-sm text-muted-foreground">{m.compareHelp}</p>
        <div className="flex flex-col gap-3">
          {result.candidates.map((candidate) => (
            <div
              key={candidate.encoding}
              className="min-w-0 rounded-lg border p-3"
            >
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => onSource(candidate.encoding)}
              >
                {m.useEncoding.replace(
                  "{encoding}",
                  encodingLabel(candidate.encoding)
                )}
              </Button>
              <pre
                dir="auto"
                className="mt-2 max-h-20 overflow-auto text-xs break-all whitespace-pre-wrap"
              >
                {candidate.preview}
              </pre>
            </div>
          ))}
        </div>
      </details>
    </FieldGroup>
  )
}
