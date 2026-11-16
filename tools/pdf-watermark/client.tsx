import { useMemo, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"
import { parsePages } from "./core/page-range"
import { Settings } from "./client/settings"
import { Upload } from "./client/upload"
import { Preview } from "./client/preview"
import { Output } from "./client/output"
import { useDocument, messageFor } from "./client/use-document"
import { useWatermark } from "./client/use-watermark"
import { DEFAULT_OPTIONS } from "./types"
import type { Messages, Options } from "./types"

function Client({ messages: m }: Readonly<{ messages: Messages }>) {
  const doc = useDocument(m)
  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS)
  const [range, setRange] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const watermark = useWatermark(options, image)
  const count = doc.source?.pages.length ?? 0
  const selection = useMemo(() => {
    if (!count) return { pages: [], error: "" }
    try {
      return { pages: parsePages(range, count), error: "" }
    } catch (error) {
      return { pages: [], error: messageFor(error, m, m.rangeInvalid) }
    }
  }, [range, count, m])
  const markError = watermark.error ? m[watermark.error as keyof Messages] : ""
  const canGenerate = Boolean(
    doc.source && watermark.mark && !selection.error && doc.status === "idle"
  )
  return (
    <div className="space-y-6">
      <Upload
        messages={m}
        source={doc.source}
        reading={doc.status === "reading"}
        disabled={doc.status === "generating"}
        onSelect={(file) => {
          if (file) {
            setRange("")
            void doc.select(file)
          }
        }}
        onClear={() => {
          setRange("")
          doc.clear()
        }}
      />
      {doc.error ? (
        <Alert variant="destructive" role="alert">
          <TriangleAlert aria-hidden="true" />
          <AlertTitle>{m.errorTitle}</AlertTitle>
          <AlertDescription>{doc.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="grid items-start gap-6 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <Settings
          options={options}
          onChange={(value) => {
            setOptions(value)
            doc.invalidate()
          }}
          messages={m}
          image={image}
          onImage={(file) => {
            if (file) {
              setImage(file)
              doc.invalidate()
            }
          }}
          markError={markError}
          range={range}
          onRange={(value) => {
            setRange(value)
            doc.invalidate()
          }}
          rangeError={selection.error}
          disabled={doc.status === "generating"}
        />
        <div className="min-w-0 space-y-4 xl:sticky xl:top-6">
          <Preview
            key={doc.source?.file.name ?? "sample"}
            messages={m}
            source={doc.source}
            options={options}
            mark={watermark.mark}
            selected={selection.pages}
          />
          <Output
            messages={m}
            result={doc.result}
            busy={doc.status === "generating"}
            preparing={watermark.preparing}
            canGenerate={canGenerate}
            onGenerate={() => {
              if (watermark.mark)
                void doc.generate(watermark.mark, options, selection.pages)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Client
