import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import KeyboardTester from "./client"
import messages from "./messages/en.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function startTest() {
  const start = screen.getByRole("button", { name: messages.start })
  const board = screen.getByRole("group", { name: messages.layout })
  fireEvent.click(start)
  expect(document.activeElement).toBe(board)
  return { board, start }
}

function cap(board: HTMLElement, code: string) {
  return within(board).getByTitle(code).dataset.state
}

function output(label: string) {
  return screen.getByText(label).nextElementSibling?.textContent
}

test("highlights physical positions and tracks the current combination and peak", () => {
  render(<KeyboardTester language="en" messages={messages} />)
  const { board } = startTest()

  fireEvent.keyDown(board, { code: "KeyQ", key: "a" })
  fireEvent.keyDown(board, { code: "ShiftRight", key: "Shift" })
  fireEvent.keyDown(board, { code: "NumpadEnter", key: "Enter" })
  expect(cap(board, "KeyQ")).toBe("held")
  expect(cap(board, "KeyA")).toBe("untested")
  expect(cap(board, "ShiftRight")).toBe("held")
  expect(cap(board, "ShiftLeft")).toBe("untested")
  expect(cap(board, "Enter")).toBe("untested")
  expect(output(messages.combination)).toBe("Shift+Q+Enter")
  expect(output(messages.held)).toBe("3")
  expect(output(messages.peak)).toBe("3")
  expect(output(messages.lastKey)).toBe("EnterNumpadEnter")

  fireEvent.keyDown(board, { code: "KeyQ", key: "A", repeat: true })
  fireEvent.keyDown(board, { code: "KeyQ", key: "A" })
  expect(output(messages.lastKey)).toBe("EnterNumpadEnter")
  fireEvent.keyUp(board, { code: "KeyQ", key: "A" })
  expect(cap(board, "KeyQ")).toBe("tested")
  expect(output(messages.held)).toBe("2")
  expect(output(messages.peak)).toBe("3")
  expect(output(messages.tested)).toBe("3")
})

test("retains tested keys when focus leaves and resets the session in one step", () => {
  render(<KeyboardTester language="en" messages={messages} />)
  const { board, start } = startTest()

  fireEvent.keyDown(board, { code: "Space", key: " " })
  expect(output(messages.lastKey)).toBe("SpaceSpace")
  fireEvent(window, new Event("blur"))
  expect(cap(board, "Space")).toBe("tested")
  expect(output(messages.held)).toBe("0")

  fireEvent.keyDown(board, { code: "Escape", key: "Escape" })
  expect(document.activeElement).toBe(start)
  expect(cap(board, "Escape")).toBe("tested")
  expect(output(messages.held)).toBe("0")
  expect(output(messages.tested)).toBe("2")

  fireEvent.keyDown(start, { code: "KeyZ", key: "z" })
  expect(cap(board, "KeyZ")).toBe("untested")

  fireEvent.click(screen.getByRole("button", { name: messages.reset }))
  expect(document.activeElement).toBe(board)
  expect(cap(board, "Space")).toBe("untested")
  expect(output(messages.tested)).toBe("0")
  expect(output(messages.peak)).toBe("0")
  expect(output(messages.lastKey)).toBe("—")
})

test("keeps navigation keys available and handles off-layout and keyup-only inputs", () => {
  render(<KeyboardTester language="en" messages={messages} />)
  const { board } = startTest()

  expect(fireEvent.keyDown(board, { code: "Tab", key: "Tab" })).toBe(true)
  expect(
    fireEvent.keyDown(board, { code: "ArrowLeft", key: "ArrowLeft" })
  ).toBe(true)
  expect(
    fireEvent.keyDown(board, { code: "ArrowRight", key: "ArrowRight" })
  ).toBe(true)
  act(() => board.blur())

  const { board: activeBoard } = startTest()
  fireEvent.keyUp(activeBoard, { code: "Tab", key: "Tab" })
  expect(output(messages.held)).toBe("0")

  fireEvent.keyUp(activeBoard, { code: "PrintScreen", key: "PrintScreen" })
  expect(cap(activeBoard, "PrintScreen")).toBe("tested")
  expect(output(messages.held)).toBe("0")

  fireEvent.keyDown(activeBoard, { code: "IntlBackslash", key: "§" })
  expect(output(messages.combination)).toBe("§")
  fireEvent.keyUp(activeBoard, { code: "IntlBackslash", key: "§" })
  fireEvent.keyDown(activeBoard, { key: "AudioVolumeUp" })
  expect(output(messages.lastKey)).toBe("AudioVolumeUp—")
  fireEvent.keyUp(activeBoard, { key: "AudioVolumeUp" })
  fireEvent.keyDown(activeBoard, { code: "Unidentified", key: "Dead" })
  expect(output(messages.combination)).toBe("Dead")
})

test("clears non-modifiers with missing release events after the last Command key is released on macOS", () => {
  vi.spyOn(navigator, "platform", "get").mockReturnValue("MacIntel")
  render(<KeyboardTester language="en" messages={messages} />)
  const { board } = startTest()

  fireEvent.keyDown(board, { code: "ShiftLeft", key: "Shift" })
  fireEvent.keyDown(board, { code: "MetaLeft", key: "Meta", metaKey: true })
  fireEvent.keyDown(board, { code: "MetaRight", key: "Meta", metaKey: true })
  fireEvent.keyDown(board, { code: "KeyA", key: "A", metaKey: true })
  fireEvent.keyUp(board, { code: "MetaRight", key: "Meta", metaKey: true })
  expect(cap(board, "KeyA")).toBe("held")
  fireEvent.keyUp(board, { code: "MetaLeft", key: "Meta" })

  expect(cap(board, "KeyA")).toBe("tested")
  expect(cap(board, "ShiftLeft")).toBe("held")
  expect(output(messages.held)).toBe("1")
  expect(output(messages.peak)).toBe("4")
})
