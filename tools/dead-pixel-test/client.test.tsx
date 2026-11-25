import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import DeadPixelTest from "./client"
import messages from "./messages/en.json"

function launch(dir: "ltr" | "rtl" = "ltr") {
  const { container } = render(
    <div dir={dir}>
      <DeadPixelTest messages={messages} />
    </div>
  )
  return {
    dialog: container.querySelector("dialog")!,
    start: screen.getByRole("button", { name: messages.fullscreen }),
  }
}

function useMockFullscreen() {
  let active: Element | null = null
  const request = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const exit = vi.fn<() => Promise<void>>().mockResolvedValue(undefined)
  Object.defineProperty(Element.prototype, "requestFullscreen", {
    configurable: true,
    value: request,
  })
  Object.defineProperties(document, {
    fullscreenElement: { configurable: true, get: () => active },
    exitFullscreen: { configurable: true, value: exit },
  })
  function change(next: Element | null) {
    active = next
    act(() => document.dispatchEvent(new Event("fullscreenchange")))
  }
  return { request, exit, change }
}

function selected(color: string) {
  const button = within(
    screen.getByRole("group", { name: messages.testColors })
  ).getByRole("button", { name: color })
  return button.getAttribute("aria-pressed")
}

afterEach(() => {
  cleanup()
  Reflect.deleteProperty(Element.prototype, "requestFullscreen")
  Reflect.deleteProperty(document, "fullscreenElement")
  Reflect.deleteProperty(document, "exitFullscreen")
})

describe("DeadPixelTest", () => {
  it("lets you choose a pure color and click or use arrows to cycle the test", () => {
    const { start, dialog } = launch()
    expect(selected(messages.white)).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: messages.next }))
    expect(selected(messages.black)).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: messages.red }))
    expect(selected(messages.red)).toBe("true")

    fireEvent.click(start)
    expect(dialog.open).toBe(true)
    const fullscreen = within(dialog)
    const [next, canvas] = fullscreen.getAllByRole("button", {
      name: messages.next,
    })
    expect(canvas?.parentElement?.style.backgroundColor).toBe("#ff0000")
    fireEvent.keyDown(dialog, { key: "ArrowRight" })
    expect(fullscreen.getByText(messages.green)).toBeTruthy()
    expect(canvas?.parentElement?.style.backgroundColor).toBe("#00ff00")
    fireEvent.keyDown(dialog, { key: "ArrowUp" })
    expect(fullscreen.getByText(messages.red)).toBeTruthy()
    fireEvent.keyDown(dialog, { key: "Tab" })
    fireEvent.click(canvas!)
    expect(fullscreen.getByText(messages.green)).toBeTruthy()
    fireEvent.click(next!)
    expect(fullscreen.getByText(messages.blue)).toBeTruthy()
    fireEvent.keyDown(dialog, { key: "ArrowDown" })
    expect(fullscreen.getByText(messages.white)).toBeTruthy()
    fireEvent.click(fullscreen.getByRole("button", { name: messages.previous }))
    expect(fullscreen.getByText(messages.blue)).toBeTruthy()
  })

  it("hides the toolbar for edge inspection and reveals it without changing the test color", () => {
    const { start, dialog } = launch()
    fireEvent.click(start)
    const fullscreen = within(dialog)
    fireEvent.click(
      fullscreen.getByRole("button", { name: messages.hideControls })
    )
    expect(fullscreen.queryByRole("button", { name: messages.exit })).toBeNull()
    const show = fullscreen.getByRole("button", { name: messages.showControls })
    expect(document.activeElement).toBe(show)
    fireEvent.click(show)
    expect(fullscreen.getByText(messages.white)).toBeTruthy()
    fireEvent.click(fullscreen.getByRole("button", { name: messages.exit }))
    expect(dialog.open).toBe(false)
  })

  it("uses the mirrored horizontal directions in right-to-left layouts", () => {
    const { start, dialog } = launch("rtl")
    fireEvent.click(start)
    const fullscreen = within(dialog)

    fireEvent.keyDown(dialog, { key: "ArrowLeft" })
    expect(fullscreen.getByText(messages.black)).toBeTruthy()
    fireEvent.keyDown(dialog, { key: "ArrowRight" })
    expect(fullscreen.getByText(messages.white)).toBeTruthy()
  })

  it("uses native fullscreen when available and closes the dialog on browser exit", () => {
    const { request, exit, change } = useMockFullscreen()
    const { start, dialog } = launch()
    fireEvent.click(start)
    expect(request).toHaveBeenCalledOnce()
    change(dialog.firstElementChild)
    change(null)
    expect(dialog.open).toBe(false)
    fireEvent.click(start)
    change(dialog.firstElementChild)
    fireEvent.click(within(dialog).getByRole("button", { name: messages.exit }))
    expect(exit).toHaveBeenCalledOnce()
    expect(dialog.open).toBe(true)
    change(null)
    expect(dialog.open).toBe(false)
  })

  it("exits native fullscreen before closing the dialog on Escape", () => {
    const { exit, change } = useMockFullscreen()
    const { start, dialog } = launch()
    fireEvent.click(start)
    change(dialog.firstElementChild)
    const cancelled = fireEvent(
      dialog,
      new Event("cancel", { cancelable: true })
    )
    expect(cancelled).toBe(false)
    expect(exit).toHaveBeenCalledOnce()
    expect(dialog.open).toBe(true)
    change(null)
    expect(dialog.open).toBe(false)
  })

  it("keeps the viewport test usable when native fullscreen is blocked", async () => {
    const { request } = useMockFullscreen()
    request.mockRejectedValueOnce(new DOMException("Blocked"))
    const { start, dialog } = launch()
    await act(async () => fireEvent.click(start))
    expect(dialog.open).toBe(true)
    fireEvent.click(within(dialog).getByRole("button", { name: messages.exit }))
    expect(dialog.open).toBe(false)
  })
})
