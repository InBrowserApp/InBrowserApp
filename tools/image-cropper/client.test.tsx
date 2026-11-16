import {
  act,
  cleanup,
  createEvent,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import ImageCropperClient from "./client"
import messages from "./messages/en.json"
import { drawImage, exportImage, loadImage } from "./client/image"

vi.mock("./client/image", () => ({
  loadImage: vi.fn(),
  exportImage: vi.fn(),
  drawImage: vi.fn(),
}))
const file = new File(["image"], "photo.png", { type: "image/png" })
const output = {
  blob: new Blob(["result"], { type: "image/png" }),
  name: "photo-cropped.png",
  width: 400,
  height: 300,
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(loadImage).mockResolvedValue({
    image: {} as ImageBitmap,
    width: 800,
    height: 600,
    dispose: vi.fn(),
  })
  vi.mocked(exportImage).mockResolvedValue(output)
  vi.mocked(drawImage).mockImplementation(() => {})
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:result")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 800,
    height: 600,
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 600,
    right: 800,
    toJSON: () => ({}),
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

async function open() {
  const view = render(<ImageCropperClient messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.chooseImage), {
    target: { files: [file] },
  })
  await waitFor(() =>
    expect(
      screen
        .getByRole("button", { name: messages.export })
        .hasAttribute("disabled")
    ).toBe(false)
  )
  return view
}

describe("image cropper UI", () => {
  it("starts with an accessible picker and disabled actions", () => {
    render(<ImageCropperClient messages={messages} />)
    expect(
      screen
        .getByRole("button", { name: messages.export })
        .hasAttribute("disabled")
    ).toBe(true)
    const click = vi.spyOn(HTMLInputElement.prototype, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.chooseImage }))
    expect(click).toHaveBeenCalledOnce()
    fireEvent.change(screen.getByLabelText(messages.chooseImage), {
      target: { files: [] },
    })
    expect(loadImage).not.toHaveBeenCalled()
  })

  it("supports drop/replace/remove, including nested drag transitions and cancelled pickers", async () => {
    const view = render(<ImageCropperClient messages={messages} />)
    const card = screen
      .getByText(messages.sourceTitle)
      .closest("[data-slot=card]")!
    fireEvent.dragOver(card)
    expect(screen.getByText(messages.dropImage)).toBeTruthy()
    const nestedLeave = createEvent.dragLeave(card)
    Object.defineProperty(nestedLeave, "relatedTarget", {
      value: screen.getByText(messages.sourceTitle),
    })
    fireEvent(card, nestedLeave)
    expect(screen.getByText(messages.dropImage)).toBeTruthy()
    fireEvent.dragLeave(card, { relatedTarget: null })
    expect(screen.queryByText(messages.dropImage)).toBeNull()
    fireEvent.drop(card, { dataTransfer: { files: [] } })
    fireEvent.drop(card, { dataTransfer: { files: [file] } })
    await screen.findByText("photo.png")
    const click = vi.spyOn(HTMLInputElement.prototype, "click")
    fireEvent.click(screen.getByRole("button", { name: messages.changeImage }))
    expect(click).toHaveBeenCalledOnce()
    fireEvent.change(screen.getByLabelText(messages.chooseImage), {
      target: { files: [] },
    })
    expect(screen.getByText("photo.png")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.clearImage }))
    expect(view.container.querySelector("canvas")).toBeNull()
  })

  it("supports precise crop coordinates, keyboard movement, all transformations and reset", async () => {
    await open()
    fireEvent.change(screen.getByLabelText(messages.width, { exact: true }), {
      target: { value: "400" },
    })
    fireEvent.change(screen.getByLabelText(messages.height, { exact: true }), {
      target: { value: "300" },
    })
    fireEvent.change(screen.getByLabelText(messages.x, { exact: true }), {
      target: { value: "100" },
    })
    fireEvent.change(screen.getByLabelText(messages.y, { exact: true }), {
      target: { value: "100" },
    })
    fireEvent.keyDown(screen.getByLabelText(messages.cropArea), {
      key: "ArrowRight",
    })
    expect((screen.getByLabelText(messages.x) as HTMLInputElement).value).toBe(
      "101"
    )
    fireEvent.click(screen.getByRole("button", { name: messages.rotateLeft }))
    expect(
      (screen.getByLabelText(messages.width) as HTMLInputElement).value
    ).toBe("600")
    fireEvent.click(screen.getByRole("button", { name: messages.rotateRight }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.flipHorizontal })
    )
    expect(
      screen
        .getByRole("button", { name: messages.flipHorizontal })
        .getAttribute("aria-pressed")
    ).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: messages.flipVertical }))
    expect(
      screen
        .getByRole("button", { name: messages.flipVertical })
        .getAttribute("aria-pressed")
    ).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: messages.reset }))
    expect(
      screen
        .getByRole("button", { name: messages.flipHorizontal })
        .getAttribute("aria-pressed")
    ).toBe("false")
    fireEvent.click(
      screen.getByRole("button", { name: messages.flipHorizontal })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.rotateRight }))
    expect(
      screen
        .getByRole("button", { name: messages.flipHorizontal })
        .getAttribute("aria-pressed")
    ).toBe("false")
    expect(
      screen
        .getByRole("button", { name: messages.flipVertical })
        .getAttribute("aria-pressed")
    ).toBe("true")
  })

  it("changes export format/quality, previews, and removes stale downloads after editing", async () => {
    await open()
    fireEvent.click(screen.getByRole("radio", { name: "JPEG" }))
    expect(screen.getByText(messages.jpegHint)).toBeTruthy()
    fireEvent.click(screen.getByRole("radio", { name: "JPEG" }))
    fireEvent.change(screen.getByLabelText(messages.quality), {
      target: { value: "80" },
    })
    fireEvent.change(screen.getByLabelText(messages.quality), {
      target: { value: "" },
    })
    fireEvent.click(screen.getByRole("radio", { name: "WebP" }))
    fireEvent.click(screen.getByRole("button", { name: messages.export }))
    const link = await screen.findByRole("link", { name: messages.download })
    expect(link.getAttribute("download")).toBe("photo-cropped.png")
    expect(screen.getByRole("img", { name: messages.resultTitle })).toBeTruthy()
    fireEvent.change(screen.getByLabelText(messages.width), {
      target: { value: "200" },
    })
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:result")
  })

  it("announces loading and processing states, and reports export failures", async () => {
    let finishLoad!: () => void
    vi.mocked(loadImage).mockReturnValueOnce(
      new Promise((resolve) => {
        finishLoad = () =>
          resolve({
            image: {} as ImageBitmap,
            width: 800,
            height: 600,
            dispose: vi.fn(),
          })
      })
    )
    render(<ImageCropperClient messages={messages} />)
    fireEvent.change(screen.getByLabelText(messages.chooseImage), {
      target: { files: [file] },
    })
    expect(screen.getByRole("status").textContent).toBe(messages.loading)
    await act(async () => finishLoad())
    let fail!: (error: Error) => void
    vi.mocked(exportImage).mockReturnValueOnce(
      new Promise((_, reject) => {
        fail = reject
      })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.export }))
    expect(
      screen
        .getByRole("button", { name: messages.processing })
        .hasAttribute("disabled")
    ).toBe(true)
    await act(async () => fail(new Error()))
    expect(screen.getByRole("alert").textContent).toContain(
      messages.exportError
    )
  })

  it("surfaces canvas preview failures", async () => {
    vi.mocked(drawImage).mockImplementationOnce(() => {
      throw new Error()
    })
    await open()
    expect(screen.getByRole("alert").textContent).toContain(
      messages.previewError
    )
  })
})
