import { useId, useRef, useState } from "react"
import { OfflineMap } from "@workspace/ui/components/tool/offline-map"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Textarea } from "@workspace/ui/components/ui/textarea"
import { Braces, FolderInput, Sparkles } from "@workspace/ui/icons"
import {
  featuresOf,
  parseGeoJson,
  positionsOf,
} from "@workspace/geospatial/geojson"
import { example } from "./example"
import type { Feature, Geometry } from "geojson"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

type MapFeature = Feature<Geometry | null>

const emptyFeatures: readonly MapFeature[] = []

function displayName(
  feature: MapFeature,
  index: number,
  fallback: string,
  format: Intl.NumberFormat
) {
  const name = feature.properties?.name
  if (typeof name === "string" && name.trim()) return name
  return String(
    feature.id ?? fallback.replace("{number}", format.format(index + 1))
  )
}

export default function Client({
  messages,
  lang,
}: Readonly<{ messages: Messages; lang: string }>) {
  const picker = useRef<HTMLInputElement>(null)
  const readId = useRef(0)
  const editor = useId()
  const [showEditor, setShowEditor] = useState(false)
  const [text, setText] = useState("")
  const [data, setData] = useState<{
    features: MapFeature[]
    hasGeometry: boolean
    filename?: string
  }>()
  const [selected, setSelected] = useState(0)
  const [invalid, setInvalid] = useState(false)
  const number = new Intl.NumberFormat(lang)
  const properties = data?.features[selected]?.properties

  function view(input: string, filename?: string) {
    readId.current++
    try {
      const features = featuresOf(parseGeoJson(input))
      let hasGeometry = false
      for (const { geometry } of features) {
        if (!geometry) continue
        for (const position of positionsOf(geometry)) {
          const [longitude, latitude] = position as [number, number]
          if (Math.abs(longitude) > 180 || Math.abs(latitude) > 90)
            throw new Error("Invalid WGS 84 coordinates")
          hasGeometry = true
        }
      }
      setData({ features, filename, hasGeometry })
      setSelected(0)
      setInvalid(false)
    } catch {
      setData(undefined)
      setInvalid(true)
    }
  }

  async function open(file: File) {
    const id = ++readId.current
    try {
      const input = await file.text()
      if (id === readId.current) view(input, file.name)
    } catch {
      if (id === readId.current) {
        setData(undefined)
        setInvalid(true)
      }
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => picker.current?.click()}>
          <FolderInput aria-hidden="true" />
          {messages.openFile}
        </Button>
        <Button
          variant="outline"
          aria-expanded={showEditor}
          aria-controls={editor}
          onClick={() => setShowEditor(!showEditor)}
        >
          <Braces aria-hidden="true" />
          {messages.paste}
        </Button>
        <Button variant="ghost" onClick={() => view(JSON.stringify(example))}>
          <Sparkles aria-hidden="true" />
          {messages.example}
        </Button>
        <input
          ref={picker}
          hidden
          type="file"
          accept=".geojson,.json"
          onChange={(event) => {
            const file = event.target.files?.[0]
            event.target.value = ""
            if (file) void open(file)
          }}
        />
        {data?.filename && (
          <span
            dir="auto"
            className="min-w-0 text-sm wrap-anywhere text-muted-foreground"
          >
            {data.filename}
          </span>
        )}
      </div>
      <form
        id={editor}
        hidden={!showEditor}
        className={showEditor ? "grid gap-2" : ""}
        onSubmit={(event) => {
          event.preventDefault()
          view(text)
        }}
      >
        <Textarea
          aria-label={messages.paste}
          dir="ltr"
          rows={5}
          spellCheck={false}
          className="field-sizing-fixed font-mono"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          disabled={!text.trim()}
          className="justify-self-start"
        >
          {messages.render}
        </Button>
      </form>
      {invalid && (
        <p role="status" className="text-sm text-destructive">
          {messages.invalid}
        </p>
      )}
      <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(14rem,1fr)]">
        <OfflineMap
          messages={messages}
          features={data?.features ?? emptyFeatures}
          selected={selected}
          onSelect={setSelected}
        />
        <Card className="min-w-0">
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{messages.features}</h2>
              {data && (
                <span className="text-sm text-muted-foreground tabular-nums">
                  {number.format(data.features.length)}
                </span>
              )}
            </div>
            {data ? (
              data.features.length ? (
                <>
                  {!data.hasGeometry && (
                    <p className="text-sm text-muted-foreground">
                      {messages.noGeometry}
                    </p>
                  )}
                  <select
                    aria-label={messages.features}
                    className="h-9 min-w-0 rounded-md border border-input bg-background px-2 text-sm"
                    value={selected}
                    onChange={(event) =>
                      setSelected(Number(event.target.value))
                    }
                  >
                    {data.features.map((feature, index) => (
                      <option key={index} value={index}>
                        {displayName(feature, index, messages.feature, number)}
                      </option>
                    ))}
                  </select>
                  <div className="grid min-w-0 gap-2">
                    <h3 className="text-sm font-medium">
                      {messages.properties}
                    </h3>
                    {properties && Object.keys(properties).length ? (
                      <dl className="grid gap-2 text-sm">
                        {Object.entries(properties).map(([key, value]) => (
                          <div
                            key={key}
                            className="grid min-w-0 gap-0.5 border-t pt-2"
                          >
                            <dt
                              dir="auto"
                              className="text-xs wrap-anywhere text-muted-foreground"
                            >
                              {key}
                            </dt>
                            <dd dir="auto" className="wrap-anywhere">
                              {typeof value === "string"
                                ? value
                                : JSON.stringify(value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {messages.noProperties}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {messages.noGeometry}
                </p>
              )
            ) : (
              <p className="text-sm text-muted-foreground">{messages.empty}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
