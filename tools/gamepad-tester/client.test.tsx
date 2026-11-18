import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import GamepadTester from "./client"
import messages from "./messages/en.json"

let pads: (Gamepad | null)[]
let pending: FrameRequestCallback | undefined

beforeEach(() => {
  pads = []
  pending = undefined
  vi.stubGlobal("navigator", { getGamepads: () => pads })
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    pending = callback
    return 1
  })
  vi.stubGlobal("cancelAnimationFrame", () => {
    pending = undefined
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function frame(time = 0) {
  const callback = pending
  expect(callback).toBeDefined()
  pending = undefined
  act(() => callback?.(time))
}

type MockGamepad = Omit<Gamepad, "axes" | "buttons"> & {
  axes: number[]
  buttons: { pressed: boolean; touched: boolean; value: number }[]
}

function makeGamepad(overrides: Partial<MockGamepad> = {}): MockGamepad {
  return {
    id: "Test gamepad",
    index: 0,
    connected: true,
    mapping: "standard",
    axes: [0, 0, 0, 0],
    buttons: Array.from({ length: 18 }, () => ({
      pressed: false,
      touched: false,
      value: 0,
    })),
    timestamp: 0,
    vibrationActuator: null as unknown as GamepadHapticActuator,
    ...overrides,
  }
}

function show() {
  return render(<GamepadTester language="en" messages={messages} />)
}

test("waits for input, shows live button and axis values, and clears on disconnect", () => {
  show()
  pads = [null]
  frame()
  expect(screen.getByText(messages.connect)).toBeTruthy()

  const pad = makeGamepad({ index: 1 })
  pads = [null, pad]
  frame()
  expect(screen.getByText(pad.id)).toBeTruthy()
  expect(screen.getByText("Button 17")).toBeTruthy()

  pad.axes[0] = -0.3
  pad.axes[1] = 0.4
  Object.assign(pad.buttons[0]!, { pressed: true, value: 1 })
  pad.buttons[6]!.value = 0.42
  frame(16)
  const left = within(screen.getByText(messages.leftStick).closest("figure")!)
  expect(left.getByText("-0.300")).toBeTruthy()
  expect(left.getByText("0.400")).toBeTruthy()
  expect(left.getByText("0.500")).toBeTruthy()
  const face = within(screen.getByText("Face ↓").closest("li")!)
  expect(face.getByText("100%")).toBeTruthy()
  expect(face.getByText(messages.pressed)).toBeTruthy()
  const trigger = within(screen.getByText(messages.leftTrigger).closest("li")!)
  expect(trigger.getByText("42%")).toBeTruthy()

  pads = [null, makeGamepad({ index: 1, connected: false })]
  frame(32)
  expect(screen.getByText(messages.waiting)).toBeTruthy()
  expect(screen.queryByText("42%")).toBeNull()
})

test("samples independent average and peak offsets and can be run again", () => {
  const pad = makeGamepad({ axes: [0, 0.06, 0, 0] })
  pads = [pad]
  show()
  frame()

  const start = screen.getByRole("button", { name: messages.check })
  fireEvent.click(start)
  expect(screen.getByText(messages.checking)).toBeTruthy()
  expect(start.getAttribute("aria-disabled")).toBe("true")

  frame(10)
  pad.axes[1] = 0.12
  pad.axes[2] = -0.03
  frame(1510)
  fireEvent.click(start)
  frame(3010)
  expect(screen.getByText(messages.checkComplete)).toBeTruthy()
  const left = within(screen.getByText(messages.leftStick).closest("figure")!)
  const right = within(screen.getByText(messages.rightStick).closest("figure")!)
  expect(left.getByText(messages.average).nextElementSibling?.textContent).toBe(
    "0.100"
  )
  expect(left.getByText(messages.peak).nextElementSibling?.textContent).toBe(
    "0.120"
  )
  expect(
    right.getByText(messages.average).nextElementSibling?.textContent
  ).toBe("0.020")
  expect(right.getByText(messages.peak).nextElementSibling?.textContent).toBe(
    "0.030"
  )

  fireEvent.click(start)
  expect(screen.getByText(messages.checking)).toBeTruthy()
  expect(screen.queryByText(messages.average)).toBeNull()
})

test("switches controllers, shows numbered inputs for a custom mapping, and falls back on unplug", () => {
  pads = [
    makeGamepad({ axes: [0, 0, 0, 0, 0.25] }),
    null,
    makeGamepad({
      index: 2,
      id: "Arcade stick",
      mapping: "",
      axes: [0.7],
      buttons: [{ pressed: false, touched: false, value: 0.36 }],
    }),
  ]
  show()
  frame()

  expect(screen.getByText("Axis 4")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.check }))
  fireEvent.change(
    screen.getByRole("combobox", { name: messages.controller }),
    {
      target: { value: "2" },
    }
  )
  expect(screen.getByText(messages.rawHint)).toBeTruthy()
  expect(screen.getByText("Axis 0")).toBeTruthy()
  expect(screen.getByText("0.700")).toBeTruthy()
  expect(screen.getByText("Button 0")).toBeTruthy()
  expect(screen.getByText("36%")).toBeTruthy()
  expect(screen.queryByRole("button", { name: messages.check })).toBeNull()

  pads[2] = null
  frame(3500)
  expect(screen.getByText(messages.checkHelp)).toBeTruthy()
  expect(screen.getByText("Test gamepad")).toBeTruthy()
})

test("interrupts a rest check when the tab is hidden and allows a retry", () => {
  const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(false)
  pads = [makeGamepad()]
  show()
  frame()

  const start = screen.getByRole("button", { name: messages.check })
  fireEvent.click(start)
  frame(10)
  hidden.mockReturnValue(true)
  fireEvent(document, new Event("visibilitychange"))
  expect(pending).toBeUndefined()
  expect(screen.getByText(messages.checkInterrupted)).toBeTruthy()

  hidden.mockReturnValue(false)
  fireEvent(document, new Event("visibilitychange"))
  fireEvent.click(start)
  frame(10000)
  frame(13000)
  expect(screen.getByText(messages.checkComplete)).toBeTruthy()
})

test("handles a connected device that reports no inputs", () => {
  pads = [makeGamepad({ id: "", mapping: "", axes: [], buttons: [] })]
  show()
  frame()

  expect(screen.getByText(messages.controller)).toBeTruthy()
  expect(screen.getByText(messages.noInputs)).toBeTruthy()
})

test("shows recovery instructions when the API is absent", () => {
  vi.stubGlobal("navigator", {})
  show()

  expect(screen.getByText(messages.unavailableHelp)).toBeTruthy()
})

test("shows recovery instructions when the API is blocked", () => {
  vi.stubGlobal("navigator", {
    getGamepads() {
      throw new DOMException("Blocked by Permissions Policy", "SecurityError")
    },
  })
  show()
  frame()

  expect(screen.getByText(messages.unavailable)).toBeTruthy()
  expect(pending).toBeUndefined()
})
