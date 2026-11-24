import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Mouse, RotateCcw } from "@workspace/ui/icons"

import {
  countPress,
  endDrag,
  mouseButtons,
  trackDrag,
  wheelUnit,
} from "./core/measure"
import { MotionTrail } from "./motion-trail"

import type { MouseEvent } from "react"
import type { Drag, Point } from "./core/measure"
import type english from "./messages/en.json"

type Wheel = { x: number; y: number; unit: ReturnType<typeof wheelUnit> }
const initialCounts = mouseButtons.map(() => 0)

export default function MouseTester({
  language,
  messages,
}: {
  language: string
  messages: typeof english
}) {
  const [counts, setCounts] = useState(initialCounts)
  const [buttons, setButtons] = useState(0)
  const [doubleClicks, setDoubleClicks] = useState(0)
  const [wheel, setWheel] = useState<Wheel | null>(null)
  const [drag, setDrag] = useState<Drag | null>(null)
  const [points, setPoints] = useState<(Point | null)[]>([])
  const area = useRef<HTMLDivElement>(null)
  const format = useMemo(
    () => new Intl.NumberFormat(language, { maximumFractionDigits: 1 }),
    [language]
  )

  useEffect(() => {
    const element = area.current
    if (!element) return
    function handleWheel(event: WheelEvent) {
      if (event.ctrlKey) return
      event.preventDefault()
      const unit = wheelUnit(event.deltaMode)
      setWheel({ x: event.deltaX, y: event.deltaY, unit })
    }
    element.addEventListener("wheel", handleWheel, { passive: false })
    return () => element.removeEventListener("wheel", handleWheel)
  }, [])

  function press(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault()
    setCounts((previous) => countPress(previous, event.button))
    setButtons(event.buttons)
    const origin = { x: event.clientX, y: event.clientY }
    setDrag((previous) =>
      previous?.active ? previous : { origin, distance: 0, active: true }
    )
  }

  function release(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault()
    setButtons(event.buttons)
    if (event.buttons === 0) {
      const point = { x: event.clientX, y: event.clientY }
      setDrag((previous) => endDrag(trackDrag(previous, point)))
    }
  }

  function track(event: MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    const point = { x: event.clientX, y: event.clientY }
    const relative = {
      x: (point.x - bounds.left) / bounds.width,
      y: (point.y - bounds.top) / bounds.height,
    }
    setPoints((previous) => [...previous.slice(-119), relative])
    setButtons(event.buttons)
    setDrag((previous) =>
      event.buttons ? trackDrag(previous, point) : endDrag(previous)
    )
  }

  function leave() {
    setPoints((previous) =>
      previous.at(-1) ? [...previous.slice(-119), null] : previous
    )
    setButtons(0)
    setDrag(endDrag)
  }

  function reset() {
    setCounts(initialCounts)
    setButtons(0)
    setDoubleClicks(0)
    setWheel(null)
    setDrag(null)
    setPoints([])
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <h2 className="text-sm font-semibold">{messages.testArea}</h2>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            {messages.reset}
          </Button>
        </div>
        <div
          ref={area}
          role="region"
          aria-label={messages.testArea}
          className="relative flex h-44 cursor-crosshair items-center justify-center overflow-hidden border-t bg-muted/55 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-[size:18px_18px] select-none sm:h-72"
          onPointerDown={(event) => {
            if (event.pointerType === "mouse") {
              event.currentTarget.setPointerCapture(event.pointerId)
            }
          }}
          onPointerCancel={leave}
          onMouseDown={press}
          onMouseUp={release}
          onMouseMove={track}
          onMouseLeave={leave}
          onContextMenu={(event) => event.preventDefault()}
          onAuxClick={(event) => event.preventDefault()}
          onDoubleClick={() => setDoubleClicks((count) => count + 1)}
        >
          <MotionTrail points={points} />
          {points.length === 0 && (
            <p className="pointer-events-none flex flex-col items-center gap-2 px-4 text-center text-sm font-medium text-muted-foreground">
              <Mouse aria-hidden="true" className="size-6" />
              {messages.areaHint}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-4">
        <h2 className="text-sm font-semibold">{messages.buttons}</h2>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {mouseButtons.map(({ label, mask }, index) => {
            const pressed = Boolean(buttons & mask)
            return (
              <li
                key={label}
                data-pressed={pressed}
                className="rounded-lg border px-2 py-2.5 text-sm wrap-anywhere data-[pressed=true]:border-primary data-[pressed=true]:bg-primary/10 sm:p-3"
              >
                <div className="font-medium">{messages[label]}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {pressed ? messages.pressed : messages.released}
                </div>
                <div className="mt-2 text-xs tabular-nums">
                  {messages.presses}{" "}
                  <strong>{format.format(counts[index]!)}</strong>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold">{messages.doubleClicks}</h2>
          <p className="mt-2 text-xl tabular-nums">
            {format.format(doubleClicks)}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h2 className="text-sm font-semibold">{messages.drag}</h2>
          <p className="mt-2 text-xl tabular-nums">
            <bdi>{format.format(drag?.distance ?? 0)} px</bdi>
          </p>
          {drag && (
            <p className="text-xs text-muted-foreground">
              {drag.active ? messages.dragging : messages.dragEnded}
            </p>
          )}
        </div>
        <div className="col-span-2 rounded-xl border bg-card p-4 sm:col-span-1">
          <h2 className="text-sm font-semibold">{messages.scroll}</h2>
          <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">
                {messages.horizontal}
              </dt>
              <dd className="tabular-nums">
                {wheel ? format.format(wheel.x) : "–"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                {messages.vertical}
              </dt>
              <dd className="tabular-nums">
                {wheel ? format.format(wheel.y) : "–"}
              </dd>
            </div>
          </dl>
          {wheel && (
            <p className="mt-1 text-xs text-muted-foreground">
              {messages[wheel.unit]}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
