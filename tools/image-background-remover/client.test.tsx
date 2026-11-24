import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import Client from "./client"
import messages from "./messages/en.json"
import type { WorkerUpdate } from "./worker-messages"

const photo = new File(["photo"], "product.final.jpg", { type: "image/jpeg" })
const nextPhoto = new File(["other"], "portrait.webp", { type: "image/webp" })
const png = new Blob(["png"], { type: "image/png" })
const ready: WorkerUpdate = { type: "ready", png, width: 800, height: 600 }

class TestWorker {
  static instances: TestWorker[] = []
  onmessage: ((event: MessageEvent<WorkerUpdate>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    TestWorker.instances.push(this)
  }

  send(data: WorkerUpdate) {
    act(() => this.onmessage?.(new MessageEvent("message", { data })))
  }
}

function open() {
  const view = render(<Client messages={messages} />)
  const picker = view.container.querySelector<HTMLInputElement>("input")!
  return {
    ...view,
    choose: (file: File) =>
      fireEvent.change(picker, { target: { files: [file] } }),
    cancelPicker: () => fireEvent.change(picker, { target: { files: [] } }),
  }
}

beforeEach(() => {
  TestWorker.instances = []
  vi.stubGlobal("Worker", TestWorker)
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) =>
    blob === png ? "blob:cutout" : "blob:source"
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("image background remover", () => {
  it("processes a selected photo automatically and exports the matching PNG", () => {
    const { choose, cancelPicker, unmount } = open()
    cancelPicker()
    expect(TestWorker.instances).toHaveLength(0)

    choose(photo)
    const worker = TestWorker.instances[0]!
    expect(worker.postMessage).toHaveBeenCalledWith(photo)
    worker.send({ type: "preparing" })
    expect(screen.getByRole("status").textContent).toBe(messages.preparing)
    worker.send({ type: "processing" })
    expect(screen.getByRole("status").textContent).toBe(messages.processing)
    worker.send(ready)
    expect(screen.getByText("800 × 600 px")).toBeTruthy()
    const download = screen.getByRole("link", { name: messages.download })
    expect(download.getAttribute("href")).toBe("blob:cutout")
    expect(download.getAttribute("download")).toBe(
      "product.final-no-background.png"
    )

    const compare = screen.getByRole("button", { name: messages.original })
    fireEvent.click(compare)
    expect(compare.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(screen.getByRole("button", { name: messages.result }))
    expect(compare.getAttribute("aria-pressed")).toBe("false")

    choose(nextPhoto)
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cutout")
    expect(TestWorker.instances).toHaveLength(1)
    expect(worker.postMessage).toHaveBeenLastCalledWith(nextPhoto)
    unmount()
    expect(worker.terminate).toHaveBeenCalledOnce()
  })

  it("cancels a superseded job and ignores an old completion", () => {
    const { choose } = open()
    choose(photo)
    const first = TestWorker.instances[0]!
    choose(nextPhoto)
    expect(first.terminate).toHaveBeenCalledOnce()
    expect(TestWorker.instances[1]!.postMessage).toHaveBeenCalledWith(nextPhoto)
    first.send(ready)
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  })

  it("preserves the photo and retries with a fresh worker after a load failure", () => {
    const { choose } = open()
    choose(photo)
    const first = TestWorker.instances[0]!
    first.send({ type: "modelFailed" })
    expect(screen.getByRole("alert").textContent).toBe(messages.modelFailed)
    expect(screen.getByAltText(messages.original)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    expect(first.terminate).toHaveBeenCalledOnce()
    expect(TestWorker.instances[1]!.postMessage).toHaveBeenCalledWith(photo)
    const changeImage = screen.getByRole("button", {
      name: messages.changeImage,
    })
    expect(document.activeElement).toBe(changeImage)
  })

  it("accepts a dropped image and recovers from a file that fails to decode", () => {
    const { choose } = open()
    const entry = screen.getByRole("button", { name: /Choose image/ })
    const dataTransfer = {
      files: [photo],
      types: ["Files"],
      dropEffect: "none",
    }
    fireEvent.dragEnter(entry, { dataTransfer })
    expect(fireEvent.dragOver(entry, { dataTransfer })).toBe(false)
    fireEvent.dragLeave(entry, { dataTransfer })
    fireEvent.drop(entry, { dataTransfer })
    const worker = TestWorker.instances[0]!
    expect(worker.postMessage).toHaveBeenCalledWith(photo)

    worker.send({ type: "invalidImage" })
    expect(screen.getByRole("alert").textContent).toBe(messages.invalidImage)
    expect(screen.queryByAltText(messages.original)).toBeNull()
    expect(screen.queryByRole("button", { name: messages.retry })).toBeNull()
    choose(nextPhoto)
    expect(worker.postMessage).toHaveBeenLastCalledWith(nextPhoto)
  })

  it("shows a recovery action when the worker cannot start", () => {
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw new Error("Worker unavailable")
        }
      }
    )
    const { choose } = open()
    choose(photo)
    expect(screen.getByRole("alert").textContent).toBe(
      messages.processingFailed
    )
    expect(screen.getByRole("button", { name: messages.retry })).toBeTruthy()
  })

  it("shows a recovery action when the worker module fails to load", () => {
    const { choose } = open()
    choose(photo)
    const worker = TestWorker.instances[0]!
    act(() => worker.onerror?.(new ErrorEvent("error")))
    expect(screen.getByRole("alert").textContent).toBe(
      messages.processingFailed
    )
  })
})
