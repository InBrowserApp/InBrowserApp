import { RotateCw } from "@workspace/ui/icons"
import { customPosition } from "../core/transform"
import { visibleSize, watermarkLayout } from "../core/layout"
import { useTransform } from "./use-transform"
import type { KeyboardEvent, RefObject } from "react"
import type { Messages, Options, PageGeometry, PreparedLayer } from "../types"

function EditableWatermark({
  item,
  name,
  geometry,
  frame,
  selected,
  index,
  messages: m,
  onSelect,
  onChange,
  onStart,
  onEnd,
  onDelete,
  disabled,
}: Readonly<{
  item: PreparedLayer
  name: string
  geometry: PageGeometry
  frame: RefObject<HTMLDivElement | null>
  selected: boolean
  index: number
  messages: Messages
  disabled: boolean
  onSelect: () => void
  onChange: (options: Options) => void
  onStart: () => void
  onEnd: (cancel?: boolean) => void
  onDelete: () => void
}>) {
  const options = item.layer.options
  const aspect = item.mark!.width / item.mark!.height
  const size = visibleSize(geometry)
  const layout = watermarkLayout(geometry, aspect, options)
  const center = {
    x: layout.centers[0]!.x,
    y: size.height - layout.centers[0]!.y,
  }
  const angle = (options.rotation * Math.PI) / 180
  const cos = Math.cos(angle),
    sin = Math.sin(angle)
  const transform = useTransform({
    frame,
    geometry,
    aspect,
    options,
    onChange,
    onStart,
    onEnd,
    onSelect,
    disabled,
  })
  const box = {
    left: `${(center.x / size.width) * 100}%`,
    top: `${(center.y / size.height) * 100}%`,
    width: `${(layout.markWidth / size.width) * 100}%`,
    height: `${(layout.markHeight / size.height) * 100}%`,
    transform: `translate(-50%, -50%) rotate(${options.rotation}deg)`,
  }
  function key(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    const step = event.shiftKey ? 5 : 1
    const current = customPosition(geometry, aspect, options)
    let next = current
    if (event.key === "ArrowLeft")
      next = { ...current, x: Math.max(0, current.x - step) }
    else if (event.key === "ArrowRight")
      next = { ...current, x: Math.min(100, current.x + step) }
    else if (event.key === "ArrowUp")
      next = { ...current, y: Math.max(0, current.y - step) }
    else if (event.key === "ArrowDown")
      next = { ...current, y: Math.min(100, current.y + step) }
    else if (["+", "="].includes(event.key))
      next = { ...current, size: Math.min(100, current.size + step) }
    else if (["-", "_"].includes(event.key))
      next = { ...current, size: Math.max(1, current.size - step) }
    else if (["[", "{"].includes(event.key))
      next = {
        ...current,
        rotation: Math.max(-180, current.rotation - step * 3),
      }
    else if (["]", "}"].includes(event.key))
      next = {
        ...current,
        rotation: Math.min(180, current.rotation + step * 3),
      }
    else if (["Delete", "Backspace"].includes(event.key)) {
      event.preventDefault()
      onDelete()
      return
    } else return
    event.preventDefault()
    onSelect()
    onChange(next)
  }
  const corners = [
    { x: -1, y: -1, label: m.topLeft },
    { x: 1, y: -1, label: m.topRight },
    { x: -1, y: 1, label: m.bottomLeft },
    { x: 1, y: 1, label: m.bottomRight },
  ]
  const handleClass =
    "absolute z-30 flex size-8 -translate-x-1/2 -translate-y-1/2 touch-none items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:pointer-events-none"
  return (
    <>
      <button
        type="button"
        disabled={disabled}
        data-layer-id={item.layer.id}
        aria-label={m.moveWatermark.replace("{name}", name)}
        aria-pressed={selected}
        aria-describedby="watermark-keyboard-help"
        className="absolute cursor-move touch-none border-0 bg-transparent p-0 outline-none hover:ring-1 hover:ring-blue-600/60 focus-visible:ring-2 focus-visible:ring-blue-600"
        style={{ ...box, zIndex: index + 1 }}
        onClick={onSelect}
        onKeyDown={key}
        {...transform.handlers("move")}
      />
      {selected ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-20 border-2 border-blue-600"
            style={box}
          />
          {transform.guides.x ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 z-20 border-l border-dashed border-sky-500"
            />
          ) : null}
          {transform.guides.y ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 z-20 border-t border-dashed border-sky-500"
            />
          ) : null}
          {corners.map((corner) => {
            const x =
              center.x +
              (cos * corner.x * layout.markWidth) / 2 -
              (sin * corner.y * layout.markHeight) / 2
            const y =
              center.y +
              (sin * corner.x * layout.markWidth) / 2 +
              (cos * corner.y * layout.markHeight) / 2
            const direction = Math.round(
              Math.atan2(y - center.y, x - center.x) / (Math.PI / 4)
            )
            return (
              <button
                key={corner.label}
                type="button"
                disabled={disabled}
                className={handleClass}
                data-transform="resize"
                data-corner={`${corner.x},${corner.y}`}
                aria-label={`${m.resizeWatermark.replace("{name}", name)} · ${corner.label}`}
                onKeyDown={key}
                style={{
                  cursor: [
                    "ew-resize",
                    "nwse-resize",
                    "ns-resize",
                    "nesw-resize",
                  ][(direction + 4) % 4],
                  left: `clamp(16px, ${(x / size.width) * 100}%, calc(100% - 16px))`,
                  top: `clamp(16px, ${(y / size.height) * 100}%, calc(100% - 16px))`,
                }}
                {...transform.handlers("resize", corner)}
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-sm border-2 border-blue-600 bg-white shadow-sm"
                />
              </button>
            )
          })}
          <button
            type="button"
            disabled={disabled}
            className={`${handleClass} cursor-grab rounded-full border border-blue-600 bg-white text-blue-700 shadow-sm active:cursor-grabbing`}
            data-transform="rotate"
            aria-label={m.rotateWatermark.replace("{name}", name)}
            onKeyDown={key}
            style={{
              left: `clamp(16px, calc(${((center.x + (sin * layout.markHeight) / 2) / size.width) * 100}% + ${sin * 30}px), calc(100% - 16px))`,
              top: `clamp(16px, calc(${((center.y - (cos * layout.markHeight) / 2) / size.height) * 100}% - ${cos * 30}px), calc(100% - 16px))`,
            }}
            {...transform.handlers("rotate")}
          >
            <RotateCw aria-hidden="true" className="size-4" />
          </button>
        </>
      ) : null}
    </>
  )
}

export { EditableWatermark }
