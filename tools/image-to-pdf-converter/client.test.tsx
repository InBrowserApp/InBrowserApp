import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { imageSession } from "@workspace/raster-image"
import ImageToPdfClient from "./client"
import { SettingsCard } from "./client/settings-card"
import { UploadCard } from "./client/upload-card"
import { DEFAULT_CONVERTER_OPTIONS } from "./core/options"
import { createImagePdf } from "./core/pdf-document"
import catalog from "./messages/en.json"
import meta from "./meta/en.json"
vi.mock("@workspace/raster-image", () => ({ imageSession: vi.fn() }))
vi.mock("./core/pdf-document", async (original) => ({
  ...(await original<typeof import("./core/pdf-document")>()),
  createImagePdf: vi.fn(),
}))
const messages = { ...catalog, meta }
const m = messages
const preview = {
  bytes: new Uint8Array([1, 2]),
  mime: "image/png" as const,
  width: 192,
  height: 144,
  fullWidth: 640,
  fullHeight: 480,
  depth: 8,
  profile: false,
  delay: 0,
}
const inspect = vi.fn()
const decode = vi.fn()
const exports: Array<{
  file: string
  index: number
  rotation?: number
  quality: number
}> = []
let signals: AbortSignal[] = []
const file = (name = "scan.png") =>
  new File(["bytes"], name, { lastModified: 1 })
const input = () => screen.getByTestId("image-to-pdf-input")
const button = (name: string) => screen.getByRole("button", { name })
const add = (...files: File[]) =>
  fireEvent.change(input(), { target: { files } })
const generate = () => fireEvent.click(button(m.generateLabel))
beforeEach(() => {
  signals = []
  exports.length = 0
  inspect.mockReset().mockImplementation(async (source: File) => ({
    format: "TIFF",
    count: source.name.endsWith(".tiff") ? 3 : 1,
    kind: "page",
    poster: source.name.endsWith(".apng"),
  }))
  decode.mockReset().mockResolvedValue(preview)
  vi.mocked(imageSession)
    .mockReset()
    .mockImplementation((source, signal) => {
      signals.push(signal)
      return {
        open: vi.fn(),
        inspect: () => inspect(source),
        render: async (index, jpeg, transform) => {
          if (jpeg)
            exports.push({
              file: source.name,
              index,
              quality: jpeg.quality,
              rotation: transform?.rotation,
            })
          return decode(index, jpeg, transform)
        },
      }
    })
  vi.mocked(createImagePdf)
    .mockReset()
    .mockImplementation(async ({ images, onProgress, signal }) => {
      for (const [i, load] of images.entries()) {
        signal?.throwIfAborted()
        await load()
        onProgress?.({ completed: i + 1, total: images.length })
      }
      return new Uint8Array([37, 80, 68, 70])
    })
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => `blob:pdf-${++id}`)
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("starts empty and combines selected TIFF pages and a mixed source in displayed order", async () => {
  render(<ImageToPdfClient messages={m} />)
  expect(button(m.generateLabel)).toHaveProperty("disabled", true)
  add(file("pages.tiff"), file("photo.heic"))
  await screen.findByText("4 of 4 selected")
  expect(screen.getByText("Input size: 10 B")).toBeTruthy()
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Include pages.tiff · Page 2 of 3" })
  )
  fireEvent.click(button("Move up: photo.heic"))
  fireEvent.click(button("Move down: pages.tiff · Page 1 of 3"))
  fireEvent.click(button("Rotate 90 degrees: pages.tiff · Page 3 of 3"))
  generate()
  await screen.findByText(m.resultReadyTitle)
  expect(exports).toEqual([
    { file: "pages.tiff", index: 0, rotation: 0, quality: 82 },
    { file: "photo.heic", index: 0, rotation: 0, quality: 82 },
    { file: "pages.tiff", index: 2, rotation: 90, quality: 82 },
  ])
  expect(screen.getByRole("link", { name: m.downloadPdfLabel })).toHaveProperty(
    "download",
    "images-3-pages.pdf"
  )
  expect(signals.every((s) => s.aborted)).toBe(true)
  fireEvent.click(button(m.deselectAllLabel))
  expect(button(m.generateLabel)).toHaveProperty("disabled", true)
  expect(screen.queryByRole("link", { name: m.downloadPdfLabel })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-5")
  fireEvent.click(button(m.selectAllLabel))
  expect(screen.getByText("4 of 4 selected")).toBeTruthy()
  expect(button(m.generateLabel)).toHaveProperty("disabled", false)
})

test("keeps unreadable pages visible and blocks output until explicitly deselected", async () => {
  decode.mockRejectedValueOnce(new Error("invalid"))
  render(<ImageToPdfClient messages={m} />)
  add(file("pages.tiff"))
  await screen.findByText("3 of 3 selected")
  expect(screen.getByText(m.failures.invalid)).toBeTruthy()
  expect(screen.getByText(m.unreadableSelectionError)).toBeTruthy()
  expect(button(m.generateLabel)).toHaveProperty("disabled", true)
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Include pages.tiff · Page 1 of 3" })
  )
  generate()
  await screen.findByText(m.resultReadyTitle)
  expect(exports.map((p) => p.index)).toEqual([1, 2])
})

test("preserves PDF settings and invalidates output immediately when settings change", async () => {
  render(<ImageToPdfClient messages={m} />)
  add(file())
  await screen.findByText("scan.png")
  fireEvent.click(screen.getByText(m.landscapeOrientation))
  fireEvent.click(screen.getByText(m.coverFit))
  fireEvent.click(screen.getByText(m.bestQuality))
  fireEvent.change(screen.getByRole("spinbutton", { name: m.marginLabel }), {
    target: { value: "25" },
  })
  generate()
  await screen.findByText(m.resultReadyTitle)
  expect(exports[0]!.quality).toBe(92)
  expect(vi.mocked(createImagePdf).mock.calls[0]![0].options).toMatchObject({
    fitMode: "cover",
    marginMm: 25,
    pageOrientation: "landscape",
    qualityPreset: "best",
  })
  fireEvent.click(screen.getByText(m.portraitOrientation))
  expect(screen.queryByRole("link", { name: m.downloadPdfLabel })).toBeNull()
})

test("adds via drop/paste, rejects duplicates and releases removed and cleared thumbnails", async () => {
  render(<ImageToPdfClient messages={m} />)
  const first = file()
  fireEvent.drop(screen.getByLabelText(m.addImagesLabel), {
    dataTransfer: { files: [first] },
  })
  await screen.findByText("scan.png")
  fireEvent.paste(window, { clipboardData: { files: [file("other.png")] } })
  await screen.findByText("other.png")
  add(first)
  await screen.findByText(m.duplicateFileError)
  expect(inspect).toHaveBeenCalledTimes(2)
  fireEvent.click(button("Remove image: scan.png"))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-1")
  fireEvent.click(button(m.clearAllLabel))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-2")
  expect(screen.getByText(m.emptyQueueTitle)).toBeTruthy()
  add()
  fireEvent.paste(window)
  expect(inspect).toHaveBeenCalledTimes(2)
})

test("cancels an atomic add batch, retains old pages and discards late thumbnails", async () => {
  render(<ImageToPdfClient messages={m} />)
  add(file())
  await screen.findByText("scan.png")
  let finish!: (value: typeof preview) => void
  decode.mockResolvedValueOnce(preview).mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  add(file("new.tiff"))
  await screen.findByText("Reading new.tiff: 1 of 3")
  fireEvent.paste(window, { clipboardData: { files: [file("ignored.png")] } })
  expect(signals).toHaveLength(2)
  fireEvent.click(button(m.cancelLabel))
  expect(signals[1]!.aborted).toBe(true)
  add(file("replacement.png"))
  await screen.findByText("replacement.png")
  await act(async () => finish(preview))
  expect(screen.queryByText("new.tiff · Page 1 of 3")).toBeNull()
  expect(screen.getByText("2 of 2 selected")).toBeTruthy()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-2")
})

test("cancels PDF generation, ignores late completion and permits another generation", async () => {
  let finish!: (bytes: Uint8Array) => void
  vi.mocked(createImagePdf).mockImplementationOnce(({ onProgress }) => {
    onProgress?.({ completed: 1, total: 1 })
    return new Promise((resolve) => {
      finish = resolve
    })
  })
  render(<ImageToPdfClient messages={m} />)
  add(file())
  await screen.findByText("scan.png")
  generate()
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
    "100"
  )
  fireEvent.paste(window, { clipboardData: { files: [file("ignored.png")] } })
  expect(inspect).toHaveBeenCalledTimes(1)
  fireEvent.click(button(m.cancelLabel))
  await act(async () => finish(new Uint8Array([1])))
  expect(screen.queryByRole("link", { name: m.downloadPdfLabel })).toBeNull()
  generate()
  await screen.findByText(m.resultReadyTitle)
})

test("clear and unmount abort in-flight operations and never restore stale output", async () => {
  const view = render(<ImageToPdfClient messages={m} />)
  add(file())
  await screen.findByText("scan.png")
  let finish!: (value: typeof preview) => void
  decode.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  generate()
  await waitFor(() => expect(signals).toHaveLength(2))
  fireEvent.click(button(m.clearAllLabel))
  expect(signals[1]!.aborted).toBe(true)
  await act(async () => finish(preview))
  expect(screen.getByText(m.emptyQueueTitle)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.downloadPdfLabel })).toBeNull()
  add(file("again.png"))
  await screen.findByText("again.png")
  decode.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  add(file("late.png"))
  await waitFor(() => expect(signals).toHaveLength(4))
  view.unmount()
  expect(signals[3]!.aborted).toBe(true)
  await act(async () => finish(preview))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf-2")
})

test("identifies failed sources and failed exports before any PDF is offered", async () => {
  render(<ImageToPdfClient messages={m} />)
  inspect.mockRejectedValueOnce(new Error("unsupported"))
  add(file("notes.txt"))
  await screen.findByText(m.failures.unsupported)
  fireEvent.click(button("Remove image: notes.txt"))
  add(file("animation.apng"), file("other.png"))
  await screen.findByText("animation.apng · APNG poster only")
  expect(screen.getByText(m.framesNote)).toBeTruthy()
  decode.mockRejectedValueOnce(new Error("resourceLimit"))
  generate()
  await screen.findByText(m.unreadableSelectionError)
  expect(screen.getByRole("alert").textContent).toContain("animation.apng")
  expect(screen.queryByRole("link", { name: m.downloadPdfLabel })).toBeNull()
  fireEvent.click(button("Remove image: animation.apng · APNG poster only"))
  vi.mocked(createImagePdf).mockRejectedValueOnce(new Error("save failed"))
  generate()
  await screen.findByText(m.generateFailedError)
})

test("upload interactions prevent navigation even while disabled", () => {
  const selected = vi.fn()
  const click = vi
    .spyOn(HTMLInputElement.prototype, "click")
    .mockImplementation(() => {})
  const view = render(
    <UploadCard
      disabled={false}
      inputId="upload"
      isAddingImages={false}
      messages={m}
      onFilesSelected={selected}
    />
  )
  const target = screen.getByLabelText(m.addImagesLabel)
  const dataTransfer = { files: [file()], dropEffect: "none" }
  fireEvent.dragOver(target, { dataTransfer })
  fireEvent.dragLeave(target)
  fireEvent.drop(target, { dataTransfer })
  fireEvent.click(button(m.changeImagesLabel))
  expect(click).toHaveBeenCalledOnce()
  expect(selected).toHaveBeenCalledOnce()
  view.rerender(
    <UploadCard
      disabled
      inputId="upload"
      isAddingImages
      messages={m}
      onFilesSelected={selected}
    />
  )
  expect(fireEvent.drop(target, { dataTransfer })).toBe(false)
  expect(fireEvent.dragOver(target, { dataTransfer })).toBe(false)
  expect(selected).toHaveBeenCalledOnce()
})

test("settings retain existing quality, portrait and cover controls", () => {
  const change = vi.fn()
  render(
    <SettingsCard
      canGenerate
      disabled={false}
      isGenerating={false}
      messages={m}
      onGenerate={vi.fn()}
      onOptionsChange={change}
      options={DEFAULT_CONVERTER_OPTIONS}
    />
  )
  fireEvent.click(screen.getByText(m.portraitOrientation))
  fireEvent.click(screen.getByText(m.coverFit))
  fireEvent.click(screen.getByText(m.smallQuality))
  expect(change.mock.calls.map(([o]) => o)).toEqual([
    { ...DEFAULT_CONVERTER_OPTIONS, pageOrientation: "portrait" },
    { ...DEFAULT_CONVERTER_OPTIONS, fitMode: "cover" },
    { ...DEFAULT_CONVERTER_OPTIONS, qualityPreset: "small" },
  ])
})
