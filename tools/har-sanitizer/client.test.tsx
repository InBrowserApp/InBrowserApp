import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import HarSanitizer from "./client"
import { sanitizeHar } from "./core/sanitize"
import messages from "./messages/en.json"
import type {
  SanitizeRequest,
  SanitizeResponse,
} from "./workers/sanitize.worker"

class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage!: (event: { data: SanitizeResponse }) => void
  onerror!: () => void
  terminate = vi.fn()
  postMessage = vi.fn<(request: SanitizeRequest) => void>()

  constructor() {
    FakeWorker.instances.push(this)
  }

  async finish() {
    const { file, options } = this.postMessage.mock.calls[0]![0]
    const result = sanitizeHar(await file.text(), options)
    act(() =>
      this.onmessage({
        data: result ? { status: "ready", result } : { status: "invalid" },
      })
    )
  }
}

beforeEach(() => {
  FakeWorker.instances = []
  vi.stubGlobal("Worker", FakeWorker)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

it("prepares the example and replaces the download whenever options change", async () => {
  render(<HarSanitizer lang="en" messages={messages} />)
  const parameters = screen.getByRole("checkbox", { name: messages.parameters })
  const download = () => screen.queryByRole("link", { name: messages.download })

  expect(download()).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByRole("status").textContent).toBe(messages.reading)
  const first = FakeWorker.instances[0]!
  await first.finish()
  expect(download()?.getAttribute("download")).toBe("example.sanitized.har")
  expect(
    screen.getByText(messages.maskedParameters).nextElementSibling?.textContent
  ).toBe("4")
  expect(first.terminate).toHaveBeenCalledOnce()

  fireEvent.click(parameters)
  expect(download()).toBeNull()
  const second = FakeWorker.instances[1]!
  expect(second.postMessage.mock.calls[0]![0].options).toEqual({
    parameters: false,
    bodies: true,
  })
  await second.finish()
  expect(
    screen.getByText(messages.maskedParameters).nextElementSibling?.textContent
  ).toBe("0")
  expect(download()).toBeTruthy()
})

it("recovers from an invalid file and ignores stale worker callbacks", async () => {
  const { container } = render(<HarSanitizer lang="en" messages={messages} />)
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  const picker = screen.getByRole("button", { name: new RegExp(messages.open) })
  const click = vi.spyOn(input, "click")
  fireEvent.click(picker)
  expect(click).toHaveBeenCalledOnce()

  fireEvent.change(input, { target: { files: [] } })
  fireEvent.dragOver(picker)
  fireEvent.dragLeave(picker)
  fireEvent.drop(picker, { dataTransfer: { files: [] } })
  expect(FakeWorker.instances).toHaveLength(0)

  fireEvent.change(input, { target: { files: [new File(["{}"], "bad.har")] } })
  await FakeWorker.instances[0]!.finish()
  expect(screen.getByRole("alert").textContent).toBe(messages.invalid)

  const valid = new File(['{"log":{"entries":[]}}'], "capture.JSON")
  fireEvent.drop(picker, { dataTransfer: { files: [valid] } })
  const pending = FakeWorker.instances[1]!
  fireEvent.change(input, { target: { files: [valid] } })
  expect(pending.terminate).toHaveBeenCalledOnce()
  act(() => pending.onerror())
  expect(screen.queryByRole("alert")).toBeNull()
  await FakeWorker.instances[2]!.finish()
  expect(
    screen
      .getByRole("link", { name: messages.download })
      .getAttribute("download")
  ).toBe("capture.sanitized.har")
})

it("shows a localized failure when a worker cannot start", () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("Worker unavailable")
      }
    }
  )
  render(<HarSanitizer lang="en" messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByRole("alert").textContent).toBe(messages.failed)
})
