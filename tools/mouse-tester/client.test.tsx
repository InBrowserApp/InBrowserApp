import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import MouseTester from "./client"
import messages from "./messages/en.json"

const draw = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    draw as unknown as CanvasRenderingContext2D
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

function renderTester() {
  render(<MouseTester messages={messages} language="en" />)
  const area = screen.getByRole("region", { name: messages.testArea })
  vi.spyOn(area, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 400, 300)
  )
  return area
}

test("tracks chords, auxiliary buttons, and release states", () => {
  const area = renderTester()
  const [left, middle, right, back, forward] = screen.getAllByRole("listitem")
  expect(left?.textContent).toContain(messages.released)
  fireEvent.mouseDown(area, { button: 0, buttons: 1 })
  expect(left?.textContent).toContain(messages.pressed)
  fireEvent.mouseDown(area, { button: 2, buttons: 3 })
  expect(right?.textContent).toContain(messages.pressed)
  fireEvent.mouseUp(area, { button: 0, buttons: 2 })
  expect(left?.textContent).toContain(messages.released)
  expect(right?.textContent).toContain(messages.pressed)
  fireEvent.mouseUp(area, { button: 2, buttons: 0 })
  for (const [button, buttons] of [
    [1, 4],
    [3, 8],
    [4, 16],
  ]) {
    fireEvent.mouseDown(area, { button, buttons })
    expect(fireEvent.mouseUp(area, { button, buttons: 0 })).toBe(false)
  }
  for (const item of [left, middle, right, back, forward]) {
    expect(item?.textContent).toContain("Presses 1")
  }
  expect(fireEvent.contextMenu(area)).toBe(false)
  const auxClick = new MouseEvent("auxclick", {
    button: 1,
    cancelable: true,
    bubbles: true,
  })
  act(() => area.dispatchEvent(auxClick))
  expect(auxClick.defaultPrevented).toBe(true)
})

test("shows drag distance, pointer trail, native double clicks, and wheel axes", () => {
  const area = renderTester()
  fireEvent.mouseMove(area, { clientX: 20, clientY: 20 })
  expect(draw.stroke).toHaveBeenCalled()
  fireEvent.mouseDown(area, { button: 0, buttons: 1, clientX: 20, clientY: 20 })
  fireEvent.mouseMove(area, { buttons: 1, clientX: 50, clientY: 60 })
  expect(screen.getByText("50 px")).toBeDefined()
  expect(screen.getByText(messages.dragging)).toBeDefined()
  fireEvent.mouseUp(area, { button: 0, buttons: 0, clientX: 50, clientY: 60 })
  expect(screen.getByText(messages.dragEnded)).toBeDefined()
  fireEvent.doubleClick(area)
  expect(
    within(
      screen.getByRole("heading", { name: messages.doubleClicks })
        .parentElement!
    ).getByText("1")
  ).toBeDefined()
  const wheel = new WheelEvent("wheel", {
    deltaX: -2,
    deltaY: 5,
    deltaMode: 1,
    cancelable: true,
  })
  act(() => area.dispatchEvent(wheel))
  expect(wheel.defaultPrevented).toBe(true)
  expect(screen.getByText("-2")).toBeDefined()
  expect(screen.getByText("5")).toBeDefined()
  expect(screen.getByText(messages.lines)).toBeDefined()
  fireEvent.mouseLeave(area)
  fireEvent.click(screen.getByRole("button", { name: messages.reset }))
  expect(screen.getByText(messages.areaHint)).toBeDefined()
  expect(screen.queryByText(messages.dragEnded)).toBeNull()
  expect(screen.queryByText(messages.lines)).toBeNull()
  expect(
    screen
      .getAllByText("Presses")
      .every((element) => element.textContent === "Presses 0")
  ).toBe(true)
})
