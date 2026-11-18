import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import { createZip } from "./zip"

vi.mock("./zip", () => ({ createZip: vi.fn() }))

const createArchive = vi.mocked(createZip)
const file = new File(["video"], "sample.mp4", { type: "video/mp4" })
let seeking: "complete" | "hold" | "error"
let drawImage: ReturnType<typeof vi.fn>
const revokeUrl = vi.fn()

beforeEach(() => {
  seeking = "complete"
  drawImage = vi.fn()
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(() => `blob:test-${++id}`)
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(revokeUrl)
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage,
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback, mime) => callback(new Blob(["image"], { type: mime }))
  )
  createArchive.mockResolvedValue(
    new Blob(["zip"], { type: "application/zip" })
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.resetAllMocks()
})

function ready(video: HTMLVideoElement, duration = 6, width = 640) {
  let time = 0
  Object.defineProperties(video, {
    duration: { value: duration },
    videoWidth: { value: width },
    videoHeight: { value: 360 },
    currentTime: {
      get: () => time,
      set: (value: number) => {
        time = value
        if (seeking !== "hold") {
          const event = seeking === "error" ? "error" : "seeked"
          seeking = "complete"
          queueMicrotask(() => fireEvent(video, new Event(event)))
        }
      },
    },
    seeking: { value: false, configurable: true },
  })
  fireEvent.loadedData(video)
  return video
}

function open() {
  const { container, unmount } = render(<Client messages={m} language="en" />)
  const input = container.querySelector("input[type=file]")!
  const choose = (selected = file) =>
    fireEvent.change(input, { target: { files: [selected] } })
  const video = () => container.querySelector("video")!
  return { input, choose, video, unmount }
}

it("previews, captures, names, and downloads frames and ZIP from one tool", async () => {
  const { input, choose, video, unmount } = open()
  const picker = vi.spyOn(input as HTMLInputElement, "click")
  fireEvent.click(screen.getByRole("button", { name: /Choose a video/ }))
  expect(picker).toHaveBeenCalledOnce()
  choose()
  expect(screen.getByText(m.loading).getAttribute("role")).toBe("status")
  ready(video()).currentTime = 2
  fireEvent.click(screen.getByRole("button", { name: m.useCurrentTime }))
  expect(screen.getByText("Frames to extract: 2")).toBeTruthy()
  fireEvent.change(screen.getByLabelText(m.format), {
    target: { value: "image/png" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  const link = await screen.findByRole("link", {
    name: "Download frame at 00:02.000",
  })
  expect(link.getAttribute("download")).toBe("sample-00-02.000.png")
  expect(screen.getAllByRole("img")).toHaveLength(2)
  expect(drawImage).toHaveBeenCalledWith(video(), 0, 0, 640, 360)

  const download = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  fireEvent.click(screen.getByRole("button", { name: m.downloadZip }))
  expect(
    await screen.findByRole("button", { name: m.preparingZip })
  ).toBeTruthy()
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect(
    createArchive.mock.calls[0]?.[0].map((frame) => frame.blob.type)
  ).toEqual(["image/png", "image/png"])
  unmount()
  expect(revokeUrl).toHaveBeenCalledWith("blob:test-1")

  const current = open()
  current.choose()
  const change = vi.spyOn(current.input as HTMLInputElement, "click")
  fireEvent.click(screen.getByRole("button", { name: m.changeVideo }))
  expect(change).toHaveBeenCalledOnce()
})

it("validates settings at submit, keeps the video and allows a corrected interval", async () => {
  const { choose, video } = open()
  choose()
  ready(video())
  fireEvent.change(screen.getByRole("textbox", { name: m.timestamps }), {
    target: { value: "07:00" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(screen.getByRole("alert").textContent).toContain("00:06.000")
  fireEvent.click(screen.getByRole("radio", { name: m.interval }))
  fireEvent.change(screen.getByLabelText(m.intervalSeconds), {
    target: { value: "0.001" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(screen.getByRole("alert").textContent).toContain("120")
  fireEvent.change(screen.getByLabelText(m.intervalSeconds), {
    target: { value: "2" },
  })
  fireEvent.change(screen.getByLabelText(m.startSeconds), {
    target: { value: "1" },
  })
  fireEvent.change(screen.getByLabelText(m.endSeconds), {
    target: { value: "3" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(
    await screen.findByRole("link", { name: "Download frame at 00:03.000" })
  ).toBeTruthy()

  createArchive.mockRejectedValueOnce(new Error("zip failed"))
  fireEvent.click(screen.getByRole("button", { name: m.downloadZip }))
  expect(await screen.findByText(m.zipError)).toBeTruthy()
  expect(screen.getAllByRole("img")).toHaveLength(2)
})

it("can cancel while decoding, and discards gallery when a video is replaced", async () => {
  const { choose, video } = open()
  choose()
  ready(video())
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(
    await screen.findByRole("link", { name: "Download frame at 00:00.000" })
  ).toBeTruthy()
  seeking = "hold"
  fireEvent.change(screen.getByRole("textbox", { name: m.timestamps }), {
    target: { value: "3" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(screen.getByRole("progressbar")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  await waitFor(() => expect(screen.queryByRole("progressbar")).toBeNull())
  expect(screen.getAllByRole("img")).toHaveLength(1)

  choose(new File(["next"], "next.webm"))
  expect(screen.queryByRole("link", { name: /Download frame/ })).toBeNull()
  expect(revokeUrl).toHaveBeenCalledWith("blob:test-1")
  ready(video(), Infinity, 0)
  expect(screen.getByRole("alert").textContent).toBe(m.videoError)
})

it("accepts a dropped video and retries after an encoding failure", async () => {
  const { video } = open()
  const dropzone = screen.getByRole("button", {
    name: /Choose a video/,
  }).parentElement!
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(file)
  fireEvent.dragEnter(dropzone, { dataTransfer })
  fireEvent.dragOver(dropzone, { dataTransfer })
  fireEvent.dragLeave(dropzone, { dataTransfer })
  fireEvent.drop(dropzone, { dataTransfer })
  const element = ready(video())
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementationOnce(
    (callback) => callback(null)
  )
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(await screen.findByText(m.extractError)).toBeTruthy()
  fireEvent.change(screen.getByRole("textbox", { name: m.timestamps }), {
    target: { value: "6" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(
    await screen.findByRole("link", { name: "Download frame at 00:06.000" })
  ).toBeTruthy()

  seeking = "error"
  fireEvent.click(screen.getByRole("button", { name: m.extract }))
  expect(await screen.findByText(m.videoError)).toBeTruthy()
  expect(element.currentTime).toBe(0)
})
