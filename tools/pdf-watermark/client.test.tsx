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
  expect(task.mock.calls.at(-1)?.[0]).toMatchObject({
    type: "generate",
    pages: [1, 3],
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
    pages: [1, 2, 3, 4],
    options: { kind: "image" },
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
})
