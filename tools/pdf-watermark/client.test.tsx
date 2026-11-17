import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import { runPdfTask } from "./client/pdf-task"
import { readImage, renderText } from "./client/watermark-image"
import { usePreview } from "./client/use-preview"

vi.mock("./client/pdf-task", () => ({ runPdfTask: vi.fn() }))
vi.mock("./client/watermark-image", () => ({
  readImage: vi.fn(),
  renderText: vi.fn(),
}))
vi.mock("./client/use-preview", () => ({ usePreview: vi.fn() }))
const mark = { blob: new Blob(["png"]), width: 800, height: 200 }
const pages = [0, 90, 180, 270].map((rotation) => ({
  x: 20,
  y: 30,
  width: 550,
  height: 700,
  rotation,
}))
const file = new File(["pdf"], "report.pdf", { type: "application/pdf" })
const task = vi.mocked(runPdfTask)

beforeEach(() => {
  vi.mocked(renderText).mockResolvedValue(mark)
  vi.mocked(readImage).mockResolvedValue(mark)
  vi.mocked(usePreview).mockReturnValue({
    url: "data:image/png;base64,AA",
    error: false,
    loading: false,
  })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:local")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  task.mockImplementation(async (request) =>
    request.type === "inspect"
      ? { ok: true, pages }
      : { ok: true, bytes: new Uint8Array([37, 80, 68, 70]) }
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

async function upload() {
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
  await screen.findByText(file.name)
  await waitFor(() =>
    expect(
      (
        screen.getByRole("button", {
          name: messages.generateLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  )
}

test("previews selected and unchanged pages, exports, and invalidates stale downloads after edits", async () => {
  render(<Client messages={messages} />)
  await upload()
  fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
    target: { value: "1,3" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.nextPage }))
  expect(screen.getByText(messages.pageNotSelected)).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.previousPage }))
  expect(screen.queryByText(messages.pageNotSelected)).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: messages.generateLabel }))
  const download = await screen.findByRole("link", {
    name: messages.downloadLabel,
  })
  expect(download.getAttribute("download")).toBe("report-watermarked.pdf")
  fireEvent.blur(
    screen.getByLabelText(messages.opacityLabel, { selector: "input" })
  )
  expect(screen.getByRole("link", { name: messages.downloadLabel })).toBe(
    download
  )
  expect(task.mock.calls.at(-1)?.[0]).toMatchObject({
    type: "generate",
    layers: [
      {
        options: expect.any(Object),
        png: expect.any(ArrayBuffer),
        pages: [1, 3],
      },
    ],
  })
  fireEvent.change(
    screen.getByLabelText(messages.rotationLabel, { selector: "input" }),
    { target: { value: "45" } }
  )
  expect(
    screen.queryByRole("link", { name: messages.downloadLabel })
  ).toBeNull()
  expect(
    screen
      .getByLabelText(messages.rotationLabel, { selector: "input" })
      .getAttribute("value")
  ).toBe("45")
  fireEvent.click(screen.getByRole("button", { name: messages.removeFile }))
  expect(screen.getByText(messages.sampleLabel)).toBeDefined()
})

test("updates text style, placement, tiling, and spacing in the sample preview", async () => {
  render(<Client messages={messages} />)
  fireEvent.change(
    screen.getByLabelText(messages.opacityLabel, { selector: "input" }),
    { target: { value: "80" } }
  )
  fireEvent.change(
    screen.getByLabelText(messages.sizeLabel, { selector: "input" }),
    { target: { value: "75" } }
  )
  fireEvent.click(screen.getByText(messages.bottomRight))
  fireEvent.click(screen.getByText(messages.serifFont))
  fireEvent.change(screen.getByLabelText(messages.colorLabel), {
    target: { value: "#ff0000" },
  })
  fireEvent.click(screen.getByText(messages.tileLayout))
  fireEvent.change(
    screen.getByLabelText(messages.spacingLabel, { selector: "input" }),
    { target: { value: "40" } }
  )
  fireEvent.change(screen.getByLabelText(messages.textLabel), {
    target: { value: "内部文件" },
  })
  await waitFor(() =>
    expect(vi.mocked(renderText)).toHaveBeenLastCalledWith({
      text: "内部文件",
      font: "serif",
      color: "#ff0000",
    })
  )
})

test("validates page ranges inline and supports an image watermark", async () => {
  render(<Client messages={messages} />)
  await upload()
  for (const [value, error] of [
    ["1,1", messages.rangeDuplicate],
    ["99", messages.rangeBounds],
    ["3-1", messages.rangeInvalid],
  ]) {
    fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
      target: { value },
    })
    expect(screen.getByText(error!)).toBeDefined()
    expect(
      (
        screen.getByRole("button", {
          name: messages.generateLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  }
  fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
    target: { value: "" },
  })
  fireEvent.click(screen.getByText(messages.imageType))
  await waitFor(() =>
    expect(screen.queryByText(messages.preparingLabel)).toBeNull()
  )
  expect(screen.queryByText(messages.pageNotSelected)).toBeNull()
  expect(
    (
      screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true)
  const image = new File(["png"], "logo.png", { type: "image/png" })
  fireEvent.change(screen.getByLabelText(messages.chooseImage), {
    target: { files: [image] },
  })
  await waitFor(() => expect(readImage).toHaveBeenCalledWith(image))
  await waitFor(() =>
    expect(
      (
        screen.getByRole("button", {
          name: messages.generateLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  )
  fireEvent.click(screen.getByRole("button", { name: messages.generateLabel }))
  await screen.findByRole("link", { name: messages.downloadLabel })
  expect(task.mock.calls.at(-1)?.[0]).toMatchObject({
    type: "generate",
    layers: [
      {
        options: expect.objectContaining({ kind: "image" }),
        png: expect.any(ArrayBuffer),
        pages: [1, 2, 3, 4],
      },
    ],
  })
})

test("reports malformed PDFs, encryption, and generation failures without a download", async () => {
  render(<Client messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [new File([""], "x.txt")] },
  })
  expect(screen.getByText(messages.unsupportedPdf)).toBeDefined()
  task.mockRejectedValueOnce(new Error("encryptedError"))
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
  await screen.findByText(messages.encryptedError)
  task.mockRejectedValueOnce("unrecognized error")
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
  await screen.findByText(messages.readError)
  await upload()
  task.mockRejectedValueOnce(new Error("generateError"))
  fireEvent.click(screen.getByRole("button", { name: messages.generateLabel }))
  await screen.findByText(messages.generateError)
  expect(
    screen.queryByRole("link", { name: messages.downloadLabel })
  ).toBeNull()
})

test("ignores stale file inspection after removal and allows dropping a new PDF", async () => {
  let resolve!: (value: Awaited<ReturnType<typeof runPdfTask>>) => void
  task.mockImplementationOnce(
    () =>
      new Promise((r) => {
        resolve = r
      })
  )
  render(<Client messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [] },
  })
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
  await waitFor(() => expect(task).toHaveBeenCalled())
  fireEvent.click(screen.getByRole("button", { name: messages.removeFile }))
  resolve({ ok: true, pages })
  await waitFor(() => expect(screen.queryByText(file.name)).toBeNull())
  const drop = screen.getByText(messages.dropPdf).closest('[data-slot="card"]')!
  fireEvent.dragOver(drop)
  fireEvent.dragLeave(drop)
  fireEvent.drop(drop, { dataTransfer: { files: [file] } })
  await screen.findByText(file.name)
})

test("shows watermark validation and preview failures explicitly", async () => {
  vi.mocked(renderText).mockRejectedValue(new Error("textError"))
  vi.mocked(usePreview).mockReturnValue({
    url: "",
    error: true,
    loading: false,
  })
  render(<Client messages={messages} />)
  await screen.findByText(messages.textError)
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
  await screen.findByText(file.name)
  expect(screen.getByText(messages.previewError)).toBeDefined()
  fireEvent.click(screen.getByText(messages.imageType))
  vi.mocked(readImage).mockRejectedValueOnce(new Error("imageError"))
  fireEvent.change(screen.getByLabelText(messages.chooseImage), {
    target: { files: [new File([""], "bad.png")] },
  })
  await screen.findByText(messages.imageError)
  expect(screen.getByRole("img", { name: messages.imageError })).toBeDefined()
})

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}
function field(name: string, value: string) {
  fireEvent.change(screen.getByLabelText(name, { selector: "input" }), {
    target: { value },
  })
}
function layerButtons() {
  return screen.getAllByRole("button", { name: /^Watermark \d/ })
}

test("keeps independent page ranges and stacking order through copy, delete, undo, and redo", async () => {
  const { container } = render(<Client messages={messages} />)
  await upload()
  field(messages.pageRangeLabel, "1,3")
  click(messages.addText)
  fireEvent.change(screen.getByLabelText(messages.textLabel), {
    target: { value: "APPROVED" },
  })
  field(messages.pageRangeLabel, "2,4")
  await waitFor(() =>
    expect(
      (
        screen.getByRole("button", {
          name: messages.generateLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  )
  click(messages.duplicateLayer)
  expect(layerButtons()).toHaveLength(3)
  field(messages.xPosition, "99.7")
  field(messages.yPosition, "88.3")
  click(messages.deleteLayer)
  expect(layerButtons()).toHaveLength(2)
  expect(
    (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
  ).toBe("APPROVED")
  click(messages.undo)
  expect(layerButtons()).toHaveLength(3)
  click(messages.redo)
  expect(layerButtons()).toHaveLength(2)
  click(messages.sendBackward)
  expect(layerButtons().map((button) => button.textContent)).toEqual([
    "Watermark 2CONFIDENTIAL",
    "Watermark 1APPROVED",
  ])
  click(messages.bringForward)
  click(messages.generateLabel)
  await screen.findByRole("link", { name: messages.downloadLabel })
  expect(task.mock.calls.at(-1)?.[0]).toMatchObject({
    type: "generate",
    layers: [{ pages: [1, 3] }, { pages: [2, 4] }],
  })
  fireEvent.click(layerButtons()[0]!)
  expect(
    screen.queryByRole("link", { name: messages.downloadLabel })
  ).not.toBeNull()
  expect(screen.getByText(messages.selectedLayerNotOnPage)).toBeDefined()
  click(messages.showLayerPage)
  await waitFor(() =>
    expect(container.querySelectorAll("[data-watermark-layer]")).toHaveLength(1)
  )
  expect(screen.queryByText(messages.selectedLayerNotOnPage)).toBeNull()
  field(messages.pageRangeLabel, "99")
  fireEvent.click(layerButtons()[1]!)
  expect(screen.getByRole("img", { name: messages.rangeBounds })).toBeDefined()
  expect(
    (
      screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true)
})

test("adds image layers only after file selection and supports removing all layers with recovery", async () => {
  const { container } = render(<Client messages={messages} />)
  await upload()
  const input = screen.getByLabelText(messages.addImage, { selector: "input" })
  const choose = vi.spyOn(input as HTMLInputElement, "click")
  click(messages.addImage)
  expect(choose).toHaveBeenCalledOnce()
  fireEvent.change(input, { target: { files: [] } })
  expect(layerButtons()).toHaveLength(1)
  const image = new File(["png"], "brand.png", { type: "image/png" })
  fireEvent.change(input, { target: { files: [image] } })
  await waitFor(() => expect(readImage).toHaveBeenCalledWith(image))
  click(messages.generateLabel)
  await screen.findByRole("link", { name: messages.downloadLabel })
  expect(task.mock.calls.at(-1)?.[0]).toMatchObject({
    layers: [expect.anything(), { options: { kind: "image" } }],
  })
  click(messages.deleteLayer)
  click(messages.deleteLayer)
  expect(screen.getByText(messages.emptyLayers)).toBeDefined()
  expect(screen.queryByText(messages.settingsTitle)).toBeNull()
  expect(container.querySelectorAll("[data-layer-id]")).toHaveLength(0)
  click(messages.undo)
  expect(layerButtons()).toHaveLength(1)
  click(messages.addText)
  for (let index = 2; index < 10; index++) click(messages.addText)
  expect(layerButtons()).toHaveLength(10)
  expect(
    (
      screen.getByRole("button", {
        name: messages.addText,
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true)
  expect(
    (
      screen.getByRole("button", {
        name: messages.duplicateLayer,
      }) as HTMLButtonElement
    ).disabled
  ).toBe(true)
})

test("supports keyboard editing, accurate numeric positions, history shortcuts, and returning to the canvas", async () => {
  const { container } = render(<Client messages={messages} />)
  await upload()
  const hit = () =>
    container.querySelector<HTMLButtonElement>('[data-layer-id="initial"]')!
  const read = (name: string) =>
    Number(
      (screen.getByLabelText(name, { selector: "input" }) as HTMLInputElement)
        .value
    )
  fireEvent.keyDown(hit(), { key: "ArrowRight" })
  expect(read(messages.xPosition)).toBe(51)
  fireEvent.keyDown(hit(), { key: "ArrowLeft", shiftKey: true })
  fireEvent.keyDown(hit(), { key: "ArrowDown", shiftKey: true })
  fireEvent.keyDown(hit(), { key: "ArrowUp" })
  expect(read(messages.xPosition)).toBe(46)
  expect(read(messages.yPosition)).toBe(54)
  fireEvent.keyDown(hit(), { key: "+", shiftKey: true })
  fireEvent.keyDown(hit(), { key: "-" })
  expect(read(messages.sizeLabel)).toBe(54)
  fireEvent.keyDown(hit(), { key: "[", shiftKey: true })
  fireEvent.keyDown(hit(), { key: "]" })
  expect(read(messages.rotationLabel)).toBe(-47)
  fireEvent.keyDown(hit(), { key: "Enter" })
  field(messages.xPosition, "33.35")
  fireEvent.blur(
    screen.getByLabelText(messages.xPosition, { selector: "input" })
  )
  expect(read(messages.xPosition)).toBe(33.4)
  field(messages.yPosition, "25.6")
  fireEvent.keyDown(
    screen.getByLabelText(messages.yPosition, { selector: "input" }),
    { key: "z", ctrlKey: true }
  )
  expect(read(messages.yPosition)).toBe(25.6)
  fireEvent.keyDown(hit(), { key: "z", ctrlKey: true })
  expect(read(messages.yPosition)).toBe(54)
  fireEvent.keyDown(hit(), { key: "z", metaKey: true, shiftKey: true })
  expect(read(messages.yPosition)).toBe(25.6)
  const scroll = vi.fn()
  container.querySelector(".scroll-mt-6")!.scrollIntoView = scroll
  click(messages.backToPreview)
  expect(scroll).toHaveBeenCalledWith({ block: "start" })
  expect(document.activeElement).toBe(hit())
  click(messages.addText)
  await waitFor(() =>
    expect(container.querySelectorAll("[data-layer-id]")).toHaveLength(2)
  )
  fireEvent.keyDown(hit(), { key: "Delete" })
  expect(layerButtons()).toHaveLength(1)
  expect(container.querySelector('[data-layer-id="initial"]')).toBeNull()
  fireEvent.keyDown(
    container.querySelector<HTMLButtonElement>("[data-layer-id]")!,
    { key: "Backspace" }
  )
  expect(screen.getByText(messages.emptyLayers)).toBeDefined()
  fireEvent.keyDown(screen.getByRole("group", { name: messages.layersTitle }), {
    key: "z",
    ctrlKey: true,
  })
  expect(layerButtons()).toHaveLength(1)
})

test("converts a preset into custom coordinates without moving it", async () => {
  render(<Client messages={messages} />)
  await upload()
  fireEvent.click(screen.getByText(messages.bottomRight))
  click(messages.customPosition)
  expect(
    Number(
      (
        screen.getByLabelText(messages.xPosition, {
          selector: "input",
        }) as HTMLInputElement
      ).value
    )
  ).toBeGreaterThan(50)
  field(messages.yPosition, "10.5")
  fireEvent.click(screen.getByText(messages.center))
  expect(
    screen.queryByLabelText(messages.xPosition, { selector: "input" })
  ).toBeNull()
})
