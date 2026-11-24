import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import Upscaler from "./client"
import messages from "./messages/en.json"
import type { UpscaleUpdate } from "./worker-messages"

const photo = new File(["photo"], "small.photo.jpg", { type: "image/jpeg" })
const png = new Blob(["result"], { type: "image/png" })
const decode = vi.fn()
let dimensions: [number, number]

class TestWorker {
  static instances: TestWorker[] = []
  onmessage?: (event: MessageEvent<UpscaleUpdate>) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    TestWorker.instances.push(this)
  }

  send(data: UpscaleUpdate) {
    act(() => this.onmessage?.(new MessageEvent("message", { data })))
  }
}

function open() {
  const view = render(<Upscaler messages={messages} lang="en" />)
  const picker = view.container.querySelector<HTMLInputElement>("input")!
  return {
    picker,
    choose: (file: File) =>
      fireEvent.change(picker, { target: { files: [file] } }),
    run: screen.findByRole.bind(screen, "button", { name: messages.upscale }),
  }
}

beforeEach(() => {
  dimensions = [320, 240]
  decode.mockReset().mockResolvedValue(undefined)
  TestWorker.instances = []
  vi.stubGlobal("Worker", TestWorker)
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = dimensions[0]
      naturalHeight = dimensions[1]
      decode = decode
    }
  )
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) =>
    blob === png ? "blob:output" : "blob:source"
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it("waits for the upscale action, announces completion and names the matching download", async () => {
  const { choose, run } = open()
  screen.getByRole("button", { name: /Choose an image/ }).focus()
  choose(photo)
  const action = await run()
  expect(document.activeElement).toBe(action)
  expect(TestWorker.instances).toHaveLength(0)

  fireEvent.click(screen.getByRole("radio", { name: "4×" }))
  expect(screen.getByText("1,280 × 960")).toBeTruthy()
  fireEvent.click(action)
  const worker = TestWorker.instances[0]!
  expect(worker.postMessage).toHaveBeenCalledWith({ file: photo, scale: 4 })
  worker.send({ type: "loading" })
  expect(screen.getByRole("status").textContent).toBe(messages.loading)
  worker.send({ type: "progress", fraction: 0.5 })
  expect(screen.getByRole("progressbar").getAttribute("value")).toBe("0.5")
  worker.send({ type: "done", png })

  const download = screen.getByRole("link", { name: messages.download })
  expect(document.activeElement).toBe(download)
  expect(download.getAttribute("download")).toBe("small.photo-4x.png")
  expect(download.getAttribute("href")).toBe("blob:output")
  expect(screen.getByRole("status").textContent).toBe(messages.upscaled)
  fireEvent.change(screen.getByRole("slider"), { target: { value: "75" } })
  expect(screen.getByAltText(messages.original).style.clipPath).toBe(
    "inset(0 25% 0 0)"
  )
  expect(screen.getByAltText(messages.upscaled).style.clipPath).toBe(
    "inset(0 0 0 75%)"
  )

  fireEvent.click(screen.getByRole("radio", { name: "2×" }))
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
})

it("keeps the original through cancellation, a stale worker response and a failed retry", async () => {
  const { choose, run } = open()
  choose(photo)
  fireEvent.click(await run())
  const first = TestWorker.instances[0]!
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(first.terminate).toHaveBeenCalledOnce()
  first.send({ type: "done", png })
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()

  fireEvent.click(await run())
  const second = TestWorker.instances[1]!
  second.send({ type: "failed" })
  expect((await screen.findByRole("alert")).textContent).toBe(messages.failed)
  expect(second.terminate).toHaveBeenCalledOnce()
  expect(screen.getByAltText(messages.original)).toBeTruthy()
  expect(await run()).toBeTruthy()
})

it("rejects unreadable and oversized files while keeping the selected image", async () => {
  const { choose, run } = open()
  choose(photo)
  await run()

  decode.mockRejectedValueOnce(new Error("invalid image"))
  choose(new File(["broken"], "broken.jpg"))
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.invalidImage
  )
  expect(screen.getByText(photo.name)).toBeTruthy()

  dimensions = [1500, 1000]
  choose(new File(["large"], "large.jpg"))
  await screen.findByText(messages.largeImage)
  expect(screen.getByText(photo.name)).toBeTruthy()
})

it("opens the picker from the action and accepts a dropped replacement", async () => {
  const { picker, choose, run } = open()
  const entry = screen.getByRole("button", { name: /Choose an image/ })
  const openPicker = vi.spyOn(picker, "click")
  fireEvent.click(entry)
  expect(openPicker).toHaveBeenCalledOnce()
  choose(photo)
  await run()

  const replacement = new File(["replacement"], "new.png", {
    type: "image/png",
  })
  const drag = { types: ["Files"], files: [replacement] }
  const original = screen.getByAltText(messages.original)
  expect(fireEvent.dragOver(original, { dataTransfer: drag })).toBe(false)
  fireEvent.dragLeave(original)
  fireEvent.drop(original, { dataTransfer: drag })
  await screen.findByText(replacement.name)
  fireEvent.click(screen.getByRole("button", { name: messages.changeImage }))
  expect(openPicker).toHaveBeenCalledTimes(2)
  fireEvent.click(await run())
  expect(TestWorker.instances[0]!.postMessage).toHaveBeenCalledWith({
    file: replacement,
    scale: 2,
  })
})
