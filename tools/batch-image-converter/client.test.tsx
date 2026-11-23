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
import { convertFile } from "./core/conversion"
import { archiveImages } from "./core/zip"
import messages from "./messages/en.json"

vi.mock("./core/conversion", async (original) => ({
  ...(await original<typeof import("./core/conversion")>()),
  convertFile: vi.fn(),
}))
vi.mock("./core/zip", () => ({ archiveImages: vi.fn() }))

const image = new File(["image"], "holiday.heic")
const broken = new File(["invalid"], "bad.tiff")
const output = {
  name: "holiday.webp",
  width: 640,
  height: 480,
  blob: new Blob(["webp"], { type: "image/webp" }),
}

beforeEach(() => {
  vi.mocked(convertFile).mockReset()
  vi.mocked(archiveImages).mockReset()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function choose(files: File[]) {
  fireEvent.change(
    screen.getByLabelText(messages.choose, { selector: "input" }),
    {
      target: { files },
    }
  )
}

test("converts a mixed selection, keeps successes, and downloads the ZIP and individual results", async () => {
  vi.mocked(convertFile)
    .mockResolvedValueOnce({ outputs: [], failure: "invalid" })
    .mockResolvedValueOnce({ outputs: [output] })
  vi.mocked(archiveImages).mockResolvedValue(new Blob(["zip"]))
  const trigger = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  render(<Client lang="en" messages={messages} />)
  expect(screen.getByRole("button", { name: messages.convert })).toHaveProperty(
    "disabled",
    true
  )
  choose([broken, image])
  fireEvent.click(screen.getByRole("radio", { name: "WebP" }))
  fireEvent.change(screen.getByRole("slider"), { target: { value: "72" } })
  fireEvent.click(screen.getByRole("button", { name: messages.convert }))
  expect(await screen.findByText(output.name)).toBeTruthy()
  expect(screen.getByText(messages.invalid)).toBeTruthy()
  expect(screen.getByText(messages.incomplete)).toBeTruthy()
  expect(vi.mocked(convertFile).mock.lastCall?.slice(0, 3)).toEqual([
    image,
    "webp",
    72,
  ])
  fireEvent.click(screen.getByRole("button", { name: "Download holiday.webp" }))
  expect(trigger.mock.contexts.at(-1)).toHaveProperty("download", output.name)
  fireEvent.click(screen.getByRole("button", { name: messages.downloadZip }))
  await waitFor(() =>
    expect(trigger.mock.contexts.at(-1)).toHaveProperty(
      "download",
      "converted-images.zip"
    )
  )
  expect(archiveImages).toHaveBeenCalledWith([output], expect.any(AbortSignal))

  fireEvent.click(screen.getByRole("button", { name: "Remove bad.tiff" }))
  expect(screen.queryByText(messages.incomplete)).toBeNull()
  expect(screen.getByText(output.name)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.clear }))
  expect(screen.queryByText(output.name)).toBeNull()
})

test("reports ZIP failures while keeping individual outputs available", async () => {
  vi.mocked(convertFile).mockResolvedValue({ outputs: [output] })
  vi.mocked(archiveImages).mockRejectedValue(new Error("out of memory"))
  render(<Client lang="en" messages={messages} />)
  choose([image])
  fireEvent.click(screen.getByRole("button", { name: messages.convert }))
  const zip = await screen.findByRole("button", { name: messages.downloadZip })
  fireEvent.click(zip)
  expect((await screen.findByRole("alert")).textContent).toBe(messages.zipError)
  expect(
    screen.getByRole("button", { name: "Download holiday.webp" })
  ).toBeTruthy()
})

test("drops several images, reports page progress, cancels and retries with PNG settings", async () => {
  vi.mocked(convertFile)
    .mockImplementationOnce(
      (_file, _format, _quality, _names, signal, progress) => {
        progress(2, 3)
        return new Promise((_resolve, reject) =>
          signal.addEventListener("abort", () => reject(signal.reason), {
            once: true,
          })
        )
      }
    )
    .mockResolvedValue({ outputs: [output] })
  render(<Client lang="en" messages={messages} />)
  const drop = screen.getByText(messages.drop)
  const dataTransfer = { files: [image, broken], dropEffect: "none" }
  fireEvent.dragOver(drop, { dataTransfer })
  fireEvent.dragLeave(drop, { relatedTarget: document.body })
  fireEvent.dragOver(drop, { dataTransfer })
  fireEvent.drop(drop, { dataTransfer })
  expect(screen.getByText(image.name)).toBeTruthy()
  expect(screen.getByText(broken.name)).toBeTruthy()
  fireEvent.click(screen.getByRole("radio", { name: "PNG" }))
  expect(screen.queryByRole("slider")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: messages.convert }))
  expect(screen.getByText("Converting file 1 of 2…")).toBeTruthy()
  expect(screen.getByText("Image 2 of 3")).toBeTruthy()
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  )
  expect(screen.getByText(image.name)).toBeTruthy()
  expect(screen.getByText(broken.name)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Remove bad.tiff" }))
  fireEvent.click(screen.getByRole("button", { name: messages.convert }))
  expect(await screen.findByText(output.name)).toBeTruthy()
  expect(vi.mocked(convertFile).mock.lastCall?.[1]).toBe("png")
})
