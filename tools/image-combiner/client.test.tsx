import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import ImageCombiner from "./client"
import messages from "./messages/en.json"

const wide = new File(["image"], "wide.png", { type: "image/png" })
const tall = new File(["image"], "tall.png", { type: "image/png" })
const broken = new File(["bad"], "broken.png", { type: "image/png" })
const empty = new File(["svg"], "empty.svg", { type: "image/svg+xml" })
const text = new File(["text"], "notes.txt", { type: "text/plain" })
const fileInput = () => screen.getByLabelText(messages.addImages)
const upload = (...files: File[]) =>
  fireEvent.change(fileInput(), { target: { files } })
const downloadButton = () =>
  screen.getByRole("button", { name: messages.download })
const composite = () =>
  screen.getByRole<HTMLCanvasElement>("img", { name: messages.preview })
const changeNumber = (label: string, value: string) =>
  fireEvent.change(screen.getByRole("spinbutton", { name: label }), {
    target: { value },
  })

const context = {
  fillStyle: "",
  fillRect: vi.fn(),
  scale: vi.fn(),
  imageSmoothingQuality: "low",
  drawImage: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation((file) =>
    file instanceof File ? `blob:local/${file.name}/${id++}` : "blob:png"
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLImageElement.prototype, "decode").mockImplementation(
    async function (this: HTMLImageElement) {
      if (this.src.includes(broken.name)) throw new Error("Invalid image data")
      const landscape = this.src.includes(wide.name)
      const noPixels = this.src.includes(empty.name)
      Object.defineProperties(this, {
        naturalWidth: { value: noPixels ? 0 : landscape ? 200 : 60 },
        naturalHeight: { value: noPixels ? 0 : landscape ? 100 : 120 },
      })
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(new Blob(["PNG"], { type: "image/png" }))
  )
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function paste(...files: File[]) {
  fireEvent.paste(document.body, { clipboardData: { files } })
}

it("reads multiple images in order, reports a bad file, and releases removed sources", async () => {
  const view = render(<ImageCombiner lang="en" messages={messages} />)
  expect(screen.getByText(messages.emptyPreview)).toBeTruthy()
  upload()
  upload(wide, broken, tall, empty)

  await waitFor(() =>
    expect([composite().width, composite().height]).toEqual([268, 120])
  )
  expect(screen.getByText("wide.png")).toBeTruthy()
  expect(
    screen.getByText(messages.unreadable.replace("{name}", broken.name))
  ).toBeTruthy()
  expect(
    screen
      .getAllByRole("listitem")
      .slice(-2)
      .map((item) => item.querySelector("bdi")?.textContent)
  ).toEqual([wide.name, tall.name])
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local/broken.png/1")
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local/empty.svg/3")

  fireEvent.click(screen.getByRole("button", { name: "Move tall.png earlier" }))
  expect(context.drawImage.mock.lastCall?.slice(1)).toEqual([68, 10, 200, 100])
  fireEvent.click(screen.getByRole("button", { name: "Remove tall.png" }))
  expect([composite().width, composite().height]).toEqual([200, 100])
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local/tall.png/2")

  view.unmount()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:local/wide.png/0")
})

it("adds from the drop zone and clipboard, preserving the current composition", async () => {
  render(<ImageCombiner lang="en" messages={messages} />)
  const dropZone = screen.getByText(messages.dropOrPaste).closest("label")!
  fireEvent.dragOver(dropZone)
  expect(dropZone.dataset.dragging).toBe("true")
  fireEvent.dragLeave(dropZone)
  expect(dropZone.dataset.dragging).toBe("false")
  fireEvent.drop(dropZone, { dataTransfer: { files: [wide] } })
  await screen.findByText(wide.name)

  paste(text, tall)
  await screen.findByText(tall.name)
  expect(URL.createObjectURL).toHaveBeenCalledTimes(2)
  expect(screen.getByText(wide.name)).toBeTruthy()
})

it("keeps spacing, dimensions, and background in sync with the downloaded output", async () => {
  render(<ImageCombiner lang="en" messages={messages} />)
  upload(wide, tall)
  await screen.findByText(tall.name)

  fireEvent.click(screen.getByRole("radio", { name: messages.vertical }))
  expect([composite().width, composite().height]).toEqual([200, 228])
  fireEvent.click(screen.getByRole("radio", { name: messages.grid }))
  changeNumber(messages.columns, "2")
  fireEvent.click(screen.getByRole("checkbox", { name: messages.matchSizes }))
  changeNumber(messages.width, "80")
  changeNumber(messages.height, "80")
  changeNumber(messages.spacing, "12")
  expect([composite().width, composite().height]).toEqual([172, 80])

  fireEvent.change(
    screen.getByRole("combobox", { name: messages.background }),
    {
      target: { value: "solid" },
    }
  )
  fireEvent.change(screen.getByLabelText(messages.backgroundColor), {
    target: { value: "#dfeaff" },
  })
  expect(context.fillStyle).toBe("#dfeaff")
  expect(context.fillRect).toHaveBeenLastCalledWith(0, 0, 172, 80)

  fireEvent.click(downloadButton())
  expect(screen.getByText(messages.exporting)).toBeTruthy()
  await waitFor(() =>
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  )
  await waitFor(() =>
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:png")
  )
  expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
    expect.any(Function),
    "image/png"
  )
})

it("keeps an oversized preview usable and allows retry after the encoder fails", async () => {
  render(<ImageCombiner lang="en" messages={messages} />)
  upload(wide)
  await screen.findByText(wide.name)
  fireEvent.click(screen.getByRole("checkbox", { name: messages.matchSizes }))
  changeNumber(messages.height, "20000")
  expect(screen.getByText(messages.largeOutput)).toBeTruthy()
  expect(downloadButton().hasAttribute("disabled")).toBe(true)
  expect(composite().width).toBe(1536)

  changeNumber(messages.height, "50")
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
  fireEvent.click(downloadButton())
  expect(await screen.findByText(messages.exportFailed)).toBeTruthy()
  vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
    (callback) => callback(null)
  )
  await act(async () => {
    fireEvent.click(downloadButton())
  })
  expect(screen.getByText(messages.exportFailed)).toBeTruthy()
  changeNumber(messages.height, "60")
  expect(screen.queryByText(messages.exportFailed)).toBeNull()
  fireEvent.click(downloadButton())
  await waitFor(() =>
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce()
  )
})
