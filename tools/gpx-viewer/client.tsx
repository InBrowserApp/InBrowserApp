import { useMemo, useRef, useState } from "react"
import { OfflineMap } from "@workspace/ui/components/tool/offline-map"
import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import {
  ArrowDown,
  ArrowUp,
  FolderInput,
  Ruler,
  Sparkles,
} from "@workspace/ui/icons"
import { parseGpx } from "./core/gpx"
import { ElevationProfile } from "./elevation-profile"
import { example } from "./example"
import type { Feature } from "geojson"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const emptyFeatures: readonly Feature[] = []

export default function Client({
  messages,
  lang,
}: Readonly<{ messages: Messages; lang: string }>) {
  const picker = useRef<HTMLInputElement>(null)
  const readId = useRef(0)
  const [data, setData] = useState<{
    track: ReturnType<typeof parseGpx>
    filename?: string
  }>()
  const [invalid, setInvalid] = useState(false)
  const [active, setActive] = useState(0)
  const kilometers = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "kilometer",
    maximumFractionDigits: 2,
  })
  const meters = new Intl.NumberFormat(lang, {
    style: "unit",
    unit: "meter",
    maximumFractionDigits: 0,
  })
  const { track } = data ?? {}
  const profile = track?.profile
  const samples = useMemo(() => profile?.flat() ?? [], [profile])
  const sample = samples[active]
  const labels = useMemo(() => {
    const map = new Map<number, string>()
    if (track) {
      const firstWaypoint = track.features.length - track.waypoints.length
      const numbers = new Intl.NumberFormat(lang)
      track.waypoints.forEach(({ name }, index) =>
        map.set(
          firstWaypoint + index,
          name ||
            messages.waypoint.replace("{number}", numbers.format(index + 1))
        )
      )
    }
    return map
  }, [lang, messages.waypoint, track])
  const formatDistance = (value: number) => kilometers.format(value / 1000)
  const formatElevation = (value: number) => meters.format(value)

  function view(text: string, filename?: string) {
    readId.current++
    try {
      setData({ track: parseGpx(text), filename })
      setActive(0)
      setInvalid(false)
    } catch {
      setInvalid(true)
    }
  }

  async function open(file: File) {
    const id = ++readId.current
    try {
      const text = await file.text()
      if (id === readId.current) view(text, file.name)
    } catch {
      if (id === readId.current) setInvalid(true)
    }
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => picker.current?.click()}>
          <FolderInput aria-hidden="true" />
          {messages.openFile}
        </Button>
        <Button variant="outline" onClick={() => view(example)}>
          <Sparkles aria-hidden="true" />
          {messages.example}
        </Button>
        <input
          ref={picker}
          hidden
          type="file"
          accept=".gpx"
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
      {invalid && (
        <p role="status" className="text-sm text-destructive">
          {messages.invalid}
        </p>
      )}
      <OfflineMap
        messages={messages}
        features={track?.features ?? emptyFeatures}
        labels={labels}
        highlight={sample ? [sample.lon, sample.lat] : undefined}
      />
      {track ? (
        <>
          <dl className="grid gap-2 sm:grid-cols-3">
            {(
              [
                [Ruler, messages.distance, formatDistance(track.distance)],
                [
                  ArrowUp,
                  messages.ascent,
                  sample ? formatElevation(track.ascent) : "—",
                ],
                [
                  ArrowDown,
                  messages.descent,
                  sample ? formatElevation(track.descent) : "—",
                ],
              ] as const
            ).map(([Icon, label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3 sm:grid"
              >
                <dt className="flex items-center gap-2 text-sm font-medium">
                  <Icon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  {label}
                </dt>
                <dd className="text-lg font-semibold tabular-nums" dir="auto">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <Card>
            <CardContent>
              {sample ? (
                <ElevationProfile
                  profile={track.profile}
                  samples={samples}
                  distance={track.distance}
                  active={active}
                  onActive={setActive}
                  label={messages.profile}
                  formatDistance={formatDistance}
                  formatElevation={formatElevation}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {messages.noElevation}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">{messages.empty}</p>
      )}
    </div>
  )
}
