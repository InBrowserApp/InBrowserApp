import { useRef } from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { DEFAULT_OPTIONS } from "../types"
import { useTransform } from "./use-transform"

const change = vi.fn(),
  start = vi.fn(),
  end = vi.fn(),
  select = vi.fn()
const rect = {
  x: 0,
  y: 0,
  left: 0,
  top: 0,
  right: 600,
  bottom: 800,
  width: 600,
  height: 800,
  toJSON: () => ({}),
}
const geometry = { width: 600, height: 800, x: 20, y: 30, rotation: 0 }
const pointer = {
  pointerId: 1,
  button: 0,
  isPrimary: true,
  clientX: 300,
  clientY: 400,
}

function Harness({ disabled = false, missing = false, rotation = 0 } = {}) {
  const frame = useRef<HTMLDivElement>(null)
  const transform = useTransform({
    frame,
    geometry: { ...geometry, rotation },
    aspect: 4,
    options: { ...DEFAULT_OPTIONS, rotation: 0 },
    onChange: change,
    onStart: start,
    onEnd: end,
    onSelect: select,
    disabled,
  })
  return (
    <div ref={missing ? undefined : frame}>
      {(["move", "resize", "rotate"] as const).map((kind) => (
        <button key={kind} {...transform.handlers(kind)}>
          {kind}
        </button>
      ))}
    </div>
  )
}
function down(button: HTMLElement, extra = {}) {
  fireEvent.pointerDown(button, { ...pointer, ...extra })
}
function move(button: HTMLElement, extra = {}) {
  fireEvent.pointerMove(button, {
    ...pointer,
    clientX: 360,
    clientY: 440,
    ...extra,
  })
}

beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(rect)
  vi.stubGlobal(
    "PointerEvent",
    class extends MouseEvent {
      pointerId: number
      isPrimary: boolean
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init)
        this.pointerId = init.pointerId ?? 1
        this.isPrimary = init.isPrimary ?? true
      }
    }
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test("captures one pointer, ignores other contacts, and commits a drag as one edit", () => {
  render(<Harness />)
  const button = screen.getByText("move")
  button.setPointerCapture = vi.fn()
  button.hasPointerCapture = vi.fn(() => true)
  button.releasePointerCapture = vi.fn()
  down(button)
  expect(select).toHaveBeenCalledOnce()
  expect(start).toHaveBeenCalledOnce()
  expect(button.setPointerCapture).toHaveBeenCalledWith(1)
  down(button, { pointerId: 2 })
  move(button, { pointerId: 2 })
  fireEvent.pointerCancel(button, { pointerId: 2 })
  fireEvent.pointerUp(button, { pointerId: 2 })
  expect(change).not.toHaveBeenCalled()
  expect(end).not.toHaveBeenCalled()
  move(button)
  expect(change).toHaveBeenLastCalledWith(
    expect.objectContaining({ position: "custom", x: 60, y: 55 })
  )
  fireEvent.pointerUp(button, pointer)
  expect(end).toHaveBeenCalledWith(false)
  expect(button.releasePointerCapture).toHaveBeenCalledWith(1)
  move(button)
  fireEvent.lostPointerCapture(button, pointer)
  expect(end).toHaveBeenCalledOnce()
})

test("cancels gestures on Escape, pointer cancellation, lost capture, or unmount", () => {
  const view = render(<Harness rotation={90} />)
  const button = screen.getByText("resize")
  down(button)
  move(button)
  expect(change.mock.calls.at(-1)?.[0].size).not.toBe(50)
  fireEvent.keyDown(window, { key: "Enter" })
  expect(end).not.toHaveBeenCalled()
  fireEvent.keyDown(window, { key: "Escape" })
  expect(end).toHaveBeenLastCalledWith(true)
  down(button)
  fireEvent.pointerCancel(button, pointer)
  expect(end).toHaveBeenCalledTimes(2)
  down(button)
  fireEvent.lostPointerCapture(button, pointer)
  expect(end).toHaveBeenCalledTimes(3)
  const rotate = screen.getByText("rotate")
  down(rotate, { clientY: 300 })
  move(rotate, { shiftKey: true })
  expect(change.mock.calls.at(-1)?.[0].rotation % 15).toBe(0)
  view.unmount()
  expect(end).toHaveBeenCalledTimes(4)
  expect(end).toHaveBeenLastCalledWith(true)
})

test("does not start gestures for disabled controls, non-primary contacts, or unavailable canvas geometry", () => {
  const view = render(<Harness disabled />)
  down(screen.getByText("move"))
  view.rerender(<Harness />)
  down(screen.getByText("move"), { button: 2 })
  down(screen.getByText("move"), { isPrimary: false })
  vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValueOnce({
    ...rect,
    width: 0,
  })
  down(screen.getByText("move"))
  view.rerender(<Harness missing />)
  down(screen.getByText("move"))
  expect(start).not.toHaveBeenCalled()
  expect(change).not.toHaveBeenCalled()
})
