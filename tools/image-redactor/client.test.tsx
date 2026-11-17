import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ImageRedactor from "./client"
import messages from "./messages/en.json"
import { exampleSource, loadSource } from "./client/image-source"
import { exportImage, render as renderImage } from "./render"

vi.mock("./render", () => ({ render: vi.fn(), exportImage: vi.fn() }))
vi.mock("./client/image-source", () => ({
  exampleSource: vi.fn(),
  loadSource: vi.fn(),
}))
const source = {
  image: document.createElement("canvas"),
  width: 1000,
  height: 600,
  name: "example.png",
}
const file = new File(["png"], "photo.png", { type: "image/png" })

beforeEach(() => {
  vi.mocked(exampleSource).mockReturnValue(source)
  vi.mocked(loadSource).mockResolvedValue(source)
  vi.mocked(exportImage).mockResolvedValue(
    new Blob(["png"], { type: "image/png" })
  )
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private callback: ResizeObserverCallback) {}
      observe() {
        this.callback(
          [
            { contentRect: { width: 700, height: 440 } },
          ] as ResizeObserverEntry[],
          this as unknown as ResizeObserver
        )
      }
      disconnect() {}
      unobserve() {}
    }
  )
  vi.spyOn(SVGSVGElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 1000,
    height: 600,
  } as DOMRect)
  SVGSVGElement.prototype.setPointerCapture = vi.fn()
  HTMLElement.prototype.setPointerCapture = vi.fn()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

function openExample() {
  const result = render(<ImageRedactor messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.tryExample }))
  return result
}
function regions() {
  return vi.mocked(renderImage).mock.lastCall![2]
}
function regionCount(count: number) {
  return messages.regionCount.replace("{count}", String(count))
}
function draw(shape = "rectangle", start = [100, 100], end = [300, 200]) {
  fireEvent.click(
    screen.getByRole("button", {
      name: messages[shape as "rectangle" | "brush" | "ellipse"],
    })
  )
  const svg = screen.getByRole("application")
  fireEvent.pointerDown(svg, {
    button: 0,
    pointerId: 1,
    clientX: start[0],
    clientY: start[1],
  })
  fireEvent.pointerMove(svg, { pointerId: 1, clientX: end[0], clientY: end[1] })
  fireEvent.pointerUp(svg, { pointerId: 1, clientX: end[0], clientY: end[1] })
}

describe("image redactor workspace", () => {
  it("has an accessible empty state and loads from picker, drop, and paste", async () => {
    render(<ImageRedactor messages={messages} />)
    expect(
      (
        screen.getByRole("button", {
          name: messages.download,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    const input = screen.getByLabelText(messages.chooseImage)
    const click = vi.spyOn(input, "click")
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(messages.uploadTitle) })
    )
    expect(click).toHaveBeenCalled()
    fireEvent.change(input, { target: { files: [file] } })
    await screen.findByRole("application")
    fireEvent.click(screen.getByRole("button", { name: messages.changeImage }))
    expect(click).toHaveBeenCalledTimes(2)
    fireEvent.change(input, { target: { files: [] } })
    const group = screen.getByRole("group", { name: "" })
    fireEvent.dragOver(group)
    fireEvent.dragLeave(group, { relatedTarget: group })
    fireEvent.dragLeave(group, { relatedTarget: null })
    fireEvent.drop(group, { dataTransfer: { files: [file] } })
    await waitFor(() => expect(loadSource).toHaveBeenCalledTimes(2))
    fireEvent.paste(window, { clipboardData: { files: [file] } })
    await waitFor(() => expect(loadSource).toHaveBeenCalledTimes(3))
    fireEvent.paste(input, { clipboardData: { files: [file] } })
    fireEvent.paste(window, { clipboardData: { files: [] } })
    fireEvent.paste(window)
    expect(loadSource).toHaveBeenCalledTimes(3)
  })
  it("draws all shapes and makes clear, delete, undo, and redo available", () => {
    openExample()
    draw()
    expect(screen.getByText(regionCount(1))).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.blur }))
    expect(
      screen.getByRole("slider", { name: messages.blurRadius })
    ).toBeTruthy()
    draw("ellipse", [350, 100], [450, 200])
    fireEvent.click(screen.getByRole("button", { name: messages.pixelate }))
    draw("brush", [500, 300], [600, 400])
    expect(
      screen.getByRole("slider", { name: messages.brushSize })
    ).toBeTruthy()
    expect(screen.getByText(regionCount(3))).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.undo }))
    expect(screen.getByText(regionCount(2))).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.redo }))
    expect(screen.getByText(regionCount(3))).toBeTruthy()
    fireEvent.click(
      screen.getAllByRole("button", { name: messages.deleteSelected })[0]!
    )
    expect(screen.getByText(regionCount(2))).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.clearAll }))
    expect(screen.getByText(regionCount(0))).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.undo }))
    expect(screen.getByText(regionCount(2))).toBeTruthy()
  })
  it("offers keyboard editing, focusable handles, zoom, and format options", async () => {
    openExample()
    draw()
    fireEvent.click(screen.getByRole("button", { name: messages.select }))
    const svg = screen.getByRole("application")
    fireEvent.keyDown(svg, { key: "ArrowRight", shiftKey: true })
    fireEvent.keyDown(svg, { key: "ArrowDown" })
    const rotate = screen.getByRole("button", { name: messages.rotateHandle })
    fireEvent.keyDown(rotate, { key: "ArrowRight", shiftKey: true })
    fireEvent.keyDown(rotate, { key: "ArrowLeft" })
    fireEvent.keyDown(rotate, { key: "a" })
    const resize = screen.getByRole("button", { name: messages.resizeHandle })
    fireEvent.keyDown(resize, { key: "Enter" })
    fireEvent.keyDown(resize, { key: "ArrowUp", shiftKey: true })
    fireEvent.keyDown(svg, { key: "z", ctrlKey: true })
    fireEvent.keyDown(svg, { key: "z", metaKey: true, shiftKey: true })
    fireEvent.keyDown(svg, { key: "z", ctrlKey: true })
    fireEvent.keyDown(svg, { key: "y", ctrlKey: true })
    fireEvent.keyDown(svg, { key: "Escape" })
    fireEvent.keyDown(svg, { key: "b" })
    fireEvent.keyDown(svg, { key: "r" })
    fireEvent.keyDown(svg, { key: "e" })
    fireEvent.keyDown(svg, { key: "v" })
    fireEvent.keyDown(svg, { key: "a", altKey: true })
    for (let i = 0; i < 5; i++)
      fireEvent.click(screen.getByRole("button", { name: messages.zoomOut }))
    for (let i = 0; i < 16; i++)
      fireEvent.click(screen.getByRole("button", { name: messages.zoomIn }))
    fireEvent.click(screen.getByRole("button", { name: messages.fit }))
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    await waitFor(() => expect(exportImage).toHaveBeenCalled())
    fireEvent.click(screen.getByRole("combobox", { name: messages.format }))
    fireEvent.click(screen.getByRole("option", { name: "JPEG" }))
    expect(screen.getByRole("slider", { name: messages.quality })).toBeTruthy()
    fireEvent.keyDown(screen.getByRole("slider", { name: messages.quality }), {
      key: "ArrowRight",
    })
    expect(
      screen
        .getByRole("button", { name: messages.brush })
        .getAttribute("aria-pressed")
    ).toBe("false")
  })
  it("shows load and export errors inline", async () => {
    render(<ImageRedactor messages={messages} />)
    vi.mocked(loadSource).mockRejectedValueOnce(new Error("invalid"))
    fireEvent.change(screen.getByLabelText(messages.chooseImage), {
      target: { files: [file] },
    })
    expect(screen.getByText(messages.loading)).toBeTruthy()
    expect(await screen.findByRole("alert")).toBeTruthy()
    expect(screen.getByText(messages.imageError)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.tryExample }))
    vi.mocked(exportImage).mockRejectedValueOnce(new Error("encode"))
    fireEvent.click(screen.getByRole("button", { name: messages.download }))
    expect(await screen.findByText(messages.exportError)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.copy }))
    expect(
      await screen.findByRole("button", { name: messages.copied })
    ).toBeTruthy()
    await act(async () => {})
  })
  it("moves, resizes, rotates, and cancels pointer gestures without adding history", () => {
    openExample()
    draw()
    fireEvent.click(screen.getByRole("button", { name: messages.select }))
    const svg = screen.getByRole("application")
    const pointer = (
      type: "pointerDown" | "pointerMove" | "pointerUp",
      x: number,
      y: number,
      extra = {}
    ) =>
      fireEvent[type](svg, {
        button: 0,
        pointerId: 1,
        clientX: x,
        clientY: y,
        ...extra,
      })
    pointer("pointerDown", 150, 150, { button: 2 })
    pointer("pointerMove", 180, 180)
    pointer("pointerDown", 150, 150)
    pointer("pointerDown", 150, 150, { pointerId: 2 })
    pointer("pointerMove", 180, 180, { pointerId: 2 })
    pointer("pointerMove", 180, 180)
    pointer("pointerUp", 180, 180, { pointerId: 2 })
    pointer("pointerUp", 180, 180)
    expect(screen.getByText(regionCount(1))).toBeTruthy()
    let resize = screen.getByRole("button", { name: messages.resizeHandle })
    fireEvent.pointerDown(resize, {
      button: 0,
      pointerId: 1,
      clientX: 330,
      clientY: 230,
    })
    pointer("pointerMove", 380, 260)
    pointer("pointerUp", 380, 260)
    const rotate = screen.getByRole("button", { name: messages.rotateHandle })
    fireEvent.pointerDown(rotate, {
      button: 0,
      pointerId: 1,
      clientX: 255,
      clientY: 100,
    })
    pointer("pointerMove", 400, 200, { shiftKey: true })
    pointer("pointerUp", 400, 200)
    expect(
      screen
        .getByRole("slider", { name: messages.rotation })
        .getAttribute("aria-valuenow")
    ).not.toBe("0")
    pointer("pointerDown", 250, 180)
    pointer("pointerMove", 270, 200)
    fireEvent.pointerCancel(svg)
    pointer("pointerMove", 280, 200)
    pointer("pointerUp", 280, 200)
    pointer("pointerDown", 900, 500)
    expect(
      screen.queryByRole("button", { name: messages.resizeHandle })
    ).toBeNull()
    draw("rectangle", [700, 500], [701, 501])
    expect(screen.getByText(regionCount(1))).toBeTruthy()
    draw("brush", [800, 500], [800, 500])
    expect(screen.getByText(regionCount(2))).toBeTruthy()
    fireEvent.keyDown(svg, { key: "Delete" })
    expect(screen.getByText(regionCount(1))).toBeTruthy()
    draw("ellipse", [500, 400], [600, 500])
    fireEvent.click(screen.getByRole("button", { name: messages.select }))
    resize = screen.getByRole("button", { name: messages.resizeHandle })
    fireEvent.pointerDown(resize, {
      button: 0,
      pointerId: 1,
      clientX: 600,
      clientY: 500,
    })
    fireEvent.keyDown(svg, { key: "Escape" })
    pointer("pointerUp", 620, 520)
    expect(screen.getByText(regionCount(2))).toBeTruthy()
  })
  it("updates color, effect size, brush size, and rotation with labeled controls", () => {
    openExample()
    fireEvent.change(screen.getByLabelText(messages.color), {
      target: { value: "#ff0000" },
    })
    fireEvent.blur(screen.getByLabelText(messages.color))
    draw()
    fireEvent.change(screen.getByLabelText(messages.color), {
      target: { value: "#00ff00" },
    })
    fireEvent.blur(screen.getByLabelText(messages.color))
    fireEvent.click(screen.getByRole("button", { name: messages.blur }))
    fireEvent.keyDown(
      screen.getByRole("slider", { name: messages.blurRadius }),
      {
        key: "ArrowRight",
      }
    )
    fireEvent.keyDown(screen.getByRole("slider", { name: messages.rotation }), {
      key: "ArrowRight",
    })
    draw("brush")
    fireEvent.keyDown(
      screen.getByRole("slider", { name: messages.brushSize }),
      { key: "ArrowRight" }
    )
    fireEvent.keyDown(screen.getByLabelText(messages.chooseImage), { key: "b" })
    expect(
      screen
        .getByRole("button", { name: messages.brush })
        .getAttribute("aria-pressed")
    ).toBe("true")
  })
  it("clears selection for drawing tools consistently from buttons and shortcuts", () => {
    openExample()
    draw()
    const svg = screen.getByRole("application")
    expect(
      screen.queryByRole("button", { name: messages.resizeHandle })
    ).toBeNull()
    fireEvent.keyDown(svg, { key: "v" })
    expect(
      screen.getByRole("button", { name: messages.resizeHandle })
    ).toBeTruthy()
    fireEvent.keyDown(svg, { key: "b" })
    expect(screen.getByText(messages.noSelection)).toBeTruthy()
    expect(
      screen.queryByRole("button", { name: messages.resizeHandle })
    ).toBeNull()
    fireEvent.click(screen.getByRole("button", { name: messages.blur }))
    expect(regions()[0]!.effect).toBe("solid")
    fireEvent.keyDown(svg, { key: "Enter" })
    expect(regions()[1]!.shape).toBe("brush")
    expect(regions()[1]!.effect).toBe("blur")
    fireEvent.click(screen.getByRole("button", { name: messages.rectangle }))
    expect(screen.getByText(messages.noSelection)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.pixelate }))
    expect(regions()[1]!.effect).toBe("blur")
  })
  it("creates, cycles, moves, and deletes regions entirely from the keyboard", () => {
    openExample()
    const svg = screen.getByRole("application")
    expect(screen.getByText(messages.canvasKeyboardHint)).toBeTruthy()
    fireEvent.keyDown(svg, { key: "Enter" })
    expect(regions()[0]!.shape).toBe("rectangle")
    expect(
      screen
        .getByRole("button", { name: messages.select })
        .getAttribute("aria-pressed")
    ).toBe("true")
    fireEvent.keyDown(svg, { key: "e" })
    fireEvent.keyDown(svg, { key: "Enter" })
    const second = regions()[1]!
    expect(second.shape).toBe("ellipse")
    fireEvent.keyDown(svg, { key: "[" })
    fireEvent.keyDown(svg, { key: "ArrowRight", shiftKey: true })
    expect(regions()[0]!.x).toBe(source.width * 0.375 + 10)
    expect(regions()[1]).toBe(second)
    fireEvent.keyDown(svg, { key: "]" })
    fireEvent.keyDown(svg, { key: "Delete" })
    expect(regions()).toHaveLength(1)
    expect(regions()[0]!.shape).toBe("rectangle")
    fireEvent.keyDown(svg, { key: "z", ctrlKey: true })
    expect(regions()).toHaveLength(2)
    expect(fireEvent.keyDown(svg, { key: "Tab" })).toBe(true)
  })
  it("leaves prevented keys and custom form controls to their own handlers", () => {
    openExample()
    const svg = screen.getByRole("application")
    fireEvent.keyDown(svg, { key: "Enter" })
    svg.addEventListener("keydown", (event) => event.preventDefault(), {
      once: true,
    })
    fireEvent.keyDown(svg, { key: "b" })
    const format = screen.getByRole("combobox", { name: messages.format })
    fireEvent.keyDown(format, { key: "e" })
    fireEvent.keyDown(format, { key: "Delete" })
    expect(
      screen
        .getByRole("button", { name: messages.select })
        .getAttribute("aria-pressed")
    ).toBe("true")
    expect(regions()).toHaveLength(1)
    fireEvent.click(format)
    const option = screen.getByRole("option", { name: "PNG" })
    fireEvent.keyDown(option, { key: "r" })
    fireEvent.keyDown(option, { key: "Delete" })
    fireEvent.keyDown(option, { key: "Escape" })
    expect(
      screen
        .getByRole("button", { name: messages.select })
        .getAttribute("aria-pressed")
    ).toBe("true")
    expect(regions()).toHaveLength(1)
  })
  it.each(["mouse", "touch"])(
    "pans with %s without changing regions or history",
    (pointerType) => {
      openExample()
      const svg = screen.getByRole("application")
      fireEvent.keyDown(svg, { key: "Enter" })
      const before = regions()
      fireEvent.keyDown(svg, { key: "h" })
      expect(
        screen
          .getByRole("button", { name: messages.pan })
          .getAttribute("aria-pressed")
      ).toBe("true")
      const viewport = svg.parentElement!.parentElement!.parentElement!
      viewport.scrollLeft = 120
      viewport.scrollTop = 80
      fireEvent.pointerDown(svg, {
        button: 0,
        pointerId: 1,
        pointerType,
        clientX: 200,
        clientY: 150,
      })
      fireEvent.pointerMove(viewport, {
        pointerId: 2,
        pointerType,
        clientX: 100,
        clientY: 90,
      })
      expect(viewport.scrollLeft).toBe(120)
      fireEvent.pointerMove(viewport, {
        pointerId: 1,
        pointerType,
        clientX: 100,
        clientY: 90,
      })
      expect(viewport.scrollLeft).toBe(220)
      expect(viewport.scrollTop).toBe(140)
      fireEvent.pointerUp(viewport, { pointerId: 1, pointerType })
      fireEvent.pointerMove(viewport, {
        pointerId: 1,
        pointerType,
        clientX: 0,
        clientY: 0,
      })
      expect(viewport.scrollLeft).toBe(220)
      fireEvent.pointerDown(viewport, {
        button: 0,
        pointerId: 3,
        pointerType,
        clientX: 200,
        clientY: 150,
      })
      fireEvent.pointerCancel(viewport, { pointerId: 3, pointerType })
      fireEvent.pointerMove(viewport, {
        pointerId: 3,
        pointerType,
        clientX: 0,
        clientY: 0,
      })
      expect(viewport.scrollLeft).toBe(220)
      expect(regions()).toBe(before)
      fireEvent.click(screen.getByRole("button", { name: messages.undo }))
      expect(regions()).toHaveLength(0)
    }
  )
  it("uses pointer positions outside the image when rotating and moving edge regions", () => {
    openExample()
    draw("rectangle", [100, 5], [300, 35])
    fireEvent.click(screen.getByRole("button", { name: messages.select }))
    const svg = screen.getByRole("application")
    fireEvent.pointerDown(
      screen.getByRole("button", { name: messages.rotateHandle }),
      {
        button: 0,
        pointerId: 1,
        clientX: 200,
        clientY: -25,
      }
    )
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: 100, clientY: -80 })
    fireEvent.pointerUp(svg, { pointerId: 1, clientX: 100, clientY: -80 })
    expect(regions()[0]!.rotation).toBe(-45)
    fireEvent.pointerDown(svg, {
      button: 0,
      pointerId: 1,
      clientX: 200,
      clientY: 20,
    })
    fireEvent.pointerMove(svg, { pointerId: 1, clientX: -100, clientY: -80 })
    fireEvent.pointerUp(svg, { pointerId: 1, clientX: -100, clientY: -80 })
    expect(regions()[0]!.x).toBe(-200)
    expect(regions()[0]!.y).toBe(-95)
  })
})
