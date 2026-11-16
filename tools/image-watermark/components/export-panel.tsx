import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { FieldGroup } from "@workspace/ui/components/ui/field"
import { Download, LoaderCircle } from "@workspace/ui/icons"
import type { Messages, Options } from "../types"
import { RangeField, SelectField } from "./controls"

export function ExportPanel({
  messages: m,
  options: o,
  onChange,
  ready,
  busy,
  onExport,
}: {
  messages: Messages
  options: Options
  onChange: (options: Options) => void
  ready: boolean
  busy: boolean
  onExport: (zip: boolean) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.exportTitle}</CardTitle>
        <CardDescription>{m.exportHint}</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <SelectField
            label={m.formatLabel}
            value={o.format}
            choices={[
              { value: "image/png", label: "PNG" },
              { value: "image/jpeg", label: "JPEG" },
              { value: "image/webp", label: "WebP" },
            ]}
            onChange={(format) => onChange({ ...o, format })}
          />
          {o.format !== "image/png" ? (
            <RangeField
              label={m.qualityLabel}
              min={10}
              max={100}
              value={o.quality}
              onChange={(quality) => onChange({ ...o, quality })}
            />
          ) : null}
          <Button
            className="h-auto min-h-8 whitespace-normal"
            disabled={!ready || busy}
            onClick={() => onExport(false)}
            variant="outline"
          >
            <Download aria-hidden="true" data-icon="inline-start" />
            {m.downloadImage}
          </Button>
          <Button
            className="h-auto min-h-8 whitespace-normal"
            disabled={!ready || busy}
            onClick={() => onExport(true)}
          >
            {busy ? (
              <LoaderCircle
                aria-hidden="true"
                data-icon="inline-start"
                className="animate-spin motion-reduce:animate-none"
              />
            ) : (
              <Download aria-hidden="true" data-icon="inline-start" />
            )}
            {m.downloadZip}
          </Button>
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
