import { useRef, useState } from "react"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { watermarkPlan } from "../core/geometry"
import { defaultOptions, type Options } from "../types"
import copy from "../messages/en.json"
import meta from "../meta/en.json"
import { TransformOverlay } from "./transform-overlay"

const initial: Options = {
  ...defaultOptions("Text"),
  position: "custom",
  x: 50,
  y: 50,
}
const messages = { ...copy, meta }
const changed = vi.fn()
function Harness() {
  const [options, setOptions] = useState(initial)
  const canvas = useRef<HTMLCanvasElement>(null)
  const g = watermarkPlan(1200, 800, 4, options).geometry
  return (
    <>
      <canvas ref={canvas} />
      <TransformOverlay
        canvas={canvas}
        geometry={g}
        options={options}
        messages={messages}
        onChange={(next) => {
          setOptions(next)
          changed(next)
        }}
        hintId="hint"
      />
      <p id="hint">{copy.editHint}</p>
      <output data-testid="options">{JSON.stringify(options)}</output>
    </>
  )
}
const read = () =>
  JSON.parse(screen.getByTestId("options").textContent!) as Options
const move = () => screen.getByRole("button", { name: copy.moveWatermark })
const resize = () =>
  screen.getByRole("button", {
    name: copy.resizeWatermark.replace("{corner}", copy.bottomRight),
  })
const rotate = () => screen.getByRole("button", { name: copy.rotateWatermark })
function start(target: HTMLElement, clientX = 300, clientY = 200, extra = {}) {
  fireEvent.pointerDown(target, {
    button: 0,
    pointerId: 1,
    clientX,
    clientY,
    ...extra,
  })
}
beforeEach(() => {
  vi.spyOn(
    HTMLCanvasElement.prototype,
    "getBoundingClientRect"
  ).mockReturnValue({ left: 0, top: 0, width: 600, height: 400 } as DOMRect)
  HTMLElement.prototype.setPointerCapture = vi.fn()
  HTMLElement.prototype.hasPointerCapture = vi.fn().mockReturnValue(true)
  HTMLElement.prototype.releasePointerCapture = vi.fn()
})
afterEach(() => {
  cleanup()
  changed.mockClear()
  vi.restoreAllMocks()
})

test("maps CSS pointer movement back to image coordinates and finishes a captured drag", () => {
  render(<Harness />)
  start(move())
  fireEvent.pointerMove(move(), { pointerId: 1, clientX: 350, clientY: 225 })
  const after = watermarkPlan(1200, 800, 4, read()).geometry
  expect(after.x).toBeCloseTo(700)
  expect(after.y).toBeCloseTo(450)
  expect(move().setPointerCapture).toHaveBeenCalledWith(1)
  fireEvent.pointerUp(move(), { pointerId: 1 })
  expect(move().releasePointerCapture).toHaveBeenCalledWith(1)
  const last = read()
  fireEvent.lostPointerCapture(move(), { pointerId: 1 })
  fireEvent.pointerMove(move(), { pointerId: 1, clientX: 500, clientY: 300 })
  expect(read()).toEqual(last)
})
test.each(["pointerCancel", "lostPointerCapture", "Escape"])(
  "restores the original transform on %s",
  (event) => {
    render(<Harness />)
    start(move())
    fireEvent.pointerMove(move(), { pointerId: 1, clientX: 400, clientY: 300 })
    expect(read()).not.toEqual(initial)
    if (event === "Escape") fireEvent.keyDown(move(), { key: "Escape" })
    else if (event === "pointerCancel")
      fireEvent.pointerCancel(move(), { pointerId: 1 })
    else fireEvent.lostPointerCapture(move(), { pointerId: 1 })
    expect(read()).toEqual(initial)
  }
)
test("ignores secondary buttons, other pointers, unrelated keys, and empty canvas rectangles", () => {
  render(<Harness />)
  start(move(), 300, 200, { button: 2 })
  fireEvent.pointerMove(move(), { pointerId: 1, clientX: 400, clientY: 300 })
  expect(changed).not.toHaveBeenCalled()
  start(move())
  start(move(), 300, 200, { pointerId: 2 })
  fireEvent.pointerMove(move(), { pointerId: 2, clientX: 400, clientY: 300 })
  fireEvent.pointerCancel(move(), { pointerId: 2 })
  fireEvent.pointerUp(move(), { pointerId: 2 })
  fireEvent.keyDown(move(), { key: "ArrowLeft" })
  expect(changed).not.toHaveBeenCalled()
  fireEvent.pointerUp(move(), { pointerId: 1 })
  fireEvent.keyDown(move(), { key: "a" })
  fireEvent.keyDown(move(), { key: "Escape" })
  vi.mocked(HTMLCanvasElement.prototype.getBoundingClientRect).mockReturnValue({
    width: 0,
    height: 0,
  } as DOMRect)
  start(move())
  expect(changed).not.toHaveBeenCalled()
})
test("moves, scales, and rotates with keyboard alternatives and larger Shift steps", () => {
  render(<Harness />)
  fireEvent.keyDown(move(), { key: "ArrowRight" })
  fireEvent.keyDown(move(), { key: "ArrowDown", shiftKey: true })
  const g = watermarkPlan(1200, 800, 4, read()).geometry
  expect(g.x).toBeCloseTo(601)
  expect(g.y).toBeCloseTo(410)
  fireEvent.keyDown(resize(), { key: "ArrowRight" })
  fireEvent.keyDown(resize(), { key: "ArrowUp", shiftKey: true })
  expect(read().size).toBe(31)
  fireEvent.keyDown(rotate(), { key: "ArrowRight" })
  fireEvent.keyDown(rotate(), { key: "ArrowDown", shiftKey: true })
  expect(read().rotation).toBe(-14)
})
test("routes resizing and rotation pointer gestures to the same shared transform model", () => {
  render(<Harness />)
  start(resize())
  fireEvent.pointerMove(resize(), { pointerId: 1, clientX: 350, clientY: 230 })
  fireEvent.pointerUp(resize(), { pointerId: 1 })
  expect(read().size).toBeGreaterThan(initial.size)
  start(rotate(), 300, 100)
  fireEvent.pointerMove(rotate(), {
    pointerId: 1,
    clientX: 400,
    clientY: 200,
    shiftKey: true,
  })
  fireEvent.pointerUp(rotate(), { pointerId: 1 })
  expect(read().rotation % 15).toBe(0)
  expect(read().rotation).not.toBe(0)
})
