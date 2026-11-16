import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import { download, loadImage } from "./browser"
import { exportImages } from "./export"
import { drawWatermark } from "./render"
import copy from "./messages/en.json"
import meta from "./meta/en.json"
import { defaultOptions, type ImageSource } from "./types"

vi.mock("./browser", () => ({ loadImage: vi.fn(), download: vi.fn() }))
vi.mock("./export", () => ({ exportImages: vi.fn() }))
vi.mock("./render", () => ({ drawWatermark: vi.fn() }))
const messages = { ...copy, meta }
const close = vi.fn()
const source: ImageSource = {
  image: {} as ImageBitmap,
  width: 640,
  height: 480,
  close,
}
const one = new File(["one"], "one.png", { type: "image/png" })
const two = new File(["two"], "two.jpg", { type: "image/jpeg" })
const bad = new File(["bad"], "bad.svg", { type: "image/svg+xml" })
const result = {
  blob: new Blob(["export"], { type: "image/png" }),
  name: "result.png",
}
function add(files: File[]) {
  fireEvent.change(screen.getByLabelText(copy.chooseImages), {
    target: { files },
  })
}
async function ready() {
  await waitFor(() =>
    expect(
      (screen.getByText(copy.downloadImage) as HTMLButtonElement).disabled
    ).toBe(false)
  )
}
async function choose(label: string, value: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "Enter",
  })
  fireEvent.click(await screen.findByRole("option", { name: value }))
}
beforeEach(() => {
  vi.mocked(loadImage).mockResolvedValue({ ...source })
  vi.mocked(exportImages).mockImplementation(
    async (_files, _logo, _options, _zip, progress) => {
      progress(1)
      return result
    }
  )
  vi.spyOn(HTMLElement.prototype, "scrollIntoView").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.restoreAllMocks()
})

test("starts empty, rejects invalid files, accepts a drop, and supports removing and clearing", async () => {
  render(<Client messages={messages} />)
  expect(screen.getByText(copy.emptyTitle)).toBeTruthy()
  expect(
    (screen.getByText(copy.downloadZip) as HTMLButtonElement).disabled
  ).toBe(true)
  add([bad])
  expect(screen.getByRole("alert").textContent).toContain(copy.invalidFile)
  const zone = screen.getByRole("button", { name: copy.chooseImages })
  const transfer = { files: [one, two], dropEffect: "" }
  fireEvent.dragOver(zone, { dataTransfer: transfer })
  fireEvent.drop(zone, { dataTransfer: transfer })
  await ready()
  expect(screen.queryByRole("alert")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "two.jpg" }))
  await ready()
  expect(loadImage).toHaveBeenCalledWith(two)
  fireEvent.click(screen.getByRole("button", { name: "Remove two.jpg" }))
  await ready()
  expect(screen.queryByRole("button", { name: "two.jpg" })).toBeNull()
  fireEvent.click(screen.getByText(copy.clearAll))
  expect(screen.getByText(copy.emptyTitle)).toBeTruthy()
  expect(close).toHaveBeenCalled()
})
test("previews edits, switches original view, and exports the selected image or the full batch", async () => {
  render(<Client messages={messages} />)
  add([one, two])
  await ready()
  fireEvent.change(screen.getByLabelText(copy.textLabel), {
    target: { value: "© Studio\n2026" },
  })
  fireEvent.click(screen.getByText(copy.original))
  await waitFor(() =>
    expect(drawWatermark).toHaveBeenLastCalledWith(
      expect.any(HTMLCanvasElement),
      expect.any(Object),
      null,
      expect.objectContaining({ text: "© Studio\n2026" }),
      1200,
      true
    )
  )
  fireEvent.click(screen.getByText(copy.watermarked))
  fireEvent.click(screen.getByText(copy.downloadImage))
  await waitFor(() =>
    expect(download).toHaveBeenCalledWith(result.blob, result.name)
  )
  expect(exportImages).toHaveBeenLastCalledWith(
    [one],
    null,
    expect.objectContaining({ text: "© Studio\n2026" }),
    false,
    expect.any(Function)
  )
  expect(screen.getByRole("status").textContent).toBe(copy.exportSuccess)
  fireEvent.click(screen.getByText(copy.downloadZip))
  await waitFor(() =>
    expect(exportImages).toHaveBeenLastCalledWith(
      [one, two],
      null,
      expect.any(Object),
      true,
      expect.any(Function)
    )
  )
})
test("requires text or a valid logo, retains valid selection after a rejected logo, and resets options", async () => {
  render(<Client messages={messages} />)
  add([one])
  await ready()
  fireEvent.change(screen.getByLabelText(copy.textLabel), {
    target: { value: "   " },
  })
  expect(
    (screen.getByText(copy.downloadImage) as HTMLButtonElement).disabled
  ).toBe(true)
  fireEvent.click(screen.getByText(copy.imageType))
  expect(screen.getByRole("status").textContent).toBe("")
  fireEvent.change(screen.getByLabelText(copy.logoLabel), {
    target: { files: [bad] },
  })
  expect(screen.getByRole("alert").textContent).toContain(copy.invalidFile)
  fireEvent.change(screen.getByLabelText(copy.logoLabel), {
    target: { files: [two] },
  })
  await ready()
  expect(screen.queryByRole("alert")).toBeNull()
  fireEvent.click(screen.getByText(copy.downloadImage))
  await waitFor(() =>
    expect(exportImages).toHaveBeenCalledWith(
      [one],
      two,
      expect.objectContaining({ kind: "image" }),
      false,
      expect.any(Function)
    )
  )
  fireEvent.change(screen.getByLabelText(copy.logoLabel), {
    target: { files: [] },
  })
  expect(screen.getByRole("status").textContent).toBe("")
  await waitFor(() =>
    expect(
      (screen.getByText(copy.downloadImage) as HTMLButtonElement).disabled
    ).toBe(true)
  )
  fireEvent.click(screen.getByText(copy.reset))
  expect(
    (screen.getByLabelText(copy.textLabel) as HTMLTextAreaElement).value
  ).toBe(copy.defaultText)
})
test("reports decoding and export errors and blocks repeated exports while busy", async () => {
  vi.mocked(loadImage).mockRejectedValueOnce(new Error("decode"))
  render(<Client messages={messages} />)
  add([one])
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(copy.imageError)
  )
  fireEvent.click(screen.getByText(copy.clearAll))
  add([two])
  await ready()
  let reject!: (reason: Error) => void
  vi.mocked(exportImages).mockImplementation(
    (_files, _logo, _options, _zip, progress) => {
      progress(1)
      return new Promise((_resolve, fail) => {
        reject = fail
      })
    }
  )
  fireEvent.click(screen.getByText(copy.downloadZip))
  await waitFor(() =>
    expect(screen.getByRole("status").textContent).toBe("Exporting 1 / 1…")
  )
  expect(
    (screen.getByText(copy.downloadZip).closest("button") as HTMLButtonElement)
      .disabled
  ).toBe(true)
  await act(async () => reject(new Error("encode")))
  expect(screen.getByRole("alert").textContent).toContain(copy.exportError)
  expect(screen.getByRole("status").textContent).toBe("")
})
test(
  "supports keyboard controls for font, placement, output format, and numeric settings",
  { timeout: 15000 },
  async () => {
    render(<Client messages={messages} />)
    add([one])
    await ready()
    await choose(copy.fontLabel, copy.fontSerif)
    await choose(copy.positionLabel, copy.topLeft)
    fireEvent.change(screen.getByLabelText(copy.colorLabel), {
      target: { value: "#123456" },
    })
    for (const label of [
      copy.sizeLabel,
      copy.opacityLabel,
      copy.rotationLabel,
      copy.marginLabel,
    ]) {
      fireEvent.keyDown(screen.getByRole("slider", { name: label }), {
        key: "ArrowRight",
      })
    }
    fireEvent.click(screen.getByText(copy.tiled))
    fireEvent.keyDown(screen.getByRole("slider", { name: copy.spacingLabel }), {
      key: "ArrowRight",
    })
    await choose(copy.formatLabel, "JPEG")
    fireEvent.keyDown(screen.getByRole("slider", { name: copy.qualityLabel }), {
      key: "ArrowRight",
    })
    fireEvent.click(screen.getByText(copy.downloadImage))
    await waitFor(() =>
      expect(exportImages).toHaveBeenCalledWith(
        [one],
        null,
        {
          ...defaultOptions(copy.defaultText),
          font: "serif",
          position: "topLeft",
          color: "#123456",
          size: 36,
          opacity: 56,
          rotation: 1,
          margin: 5,
          tiled: true,
          spacing: 13,
          format: "image/jpeg",
          quality: 93,
        },
        false,
        expect.any(Function)
      )
    )
  }
)
test("closes an image that finishes loading after the user clears the batch", async () => {
  let resolve!: (source: ImageSource) => void
  vi.mocked(loadImage).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={messages} />)
  add([one])
  expect(screen.getByText(copy.loading)).toBeTruthy()
  fireEvent.click(screen.getByText(copy.clearAll))
  await act(async () => resolve(source))
  expect(close).toHaveBeenCalledOnce()
  expect(screen.getByText(copy.emptyTitle)).toBeTruthy()
})

test("shows a recoverable preview error if the browser cannot allocate a canvas", async () => {
  vi.mocked(drawWatermark).mockImplementation(() => {
    throw new Error("CANVAS_UNAVAILABLE")
  })
  render(<Client messages={messages} />)
  add([one])
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(copy.imageError)
  )
  vi.mocked(drawWatermark).mockImplementation(() => {})
  fireEvent.change(screen.getByLabelText(copy.textLabel), {
    target: { value: "Try again" },
  })
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
})
