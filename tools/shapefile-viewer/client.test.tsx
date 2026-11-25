import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import type { readShapefiles } from "./read"

vi.mock("@workspace/ui/components/tool/offline-map", () => ({
  OfflineMap: () => null,
}))

const workers: TestWorker[] = []
class TestWorker {
  onmessage: ((event: MessageEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    workers.push(this)
  }
}

const layers: ReturnType<typeof readShapefiles> = [
  { name: "piers", features: [], placement: "empty" },
  { name: "areas", features: [], placement: "empty" },
]

function complete(worker: TestWorker) {
  act(() => worker.onmessage?.(new MessageEvent("message", { data: layers })))
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  workers.length = 0
})

test("reopening the example starts a fresh load and resets layer selection", () => {
  vi.stubGlobal("Worker", TestWorker)
  render(<Client messages={messages} lang="en" />)
  const example = screen.getByRole("button", { name: messages.example })
  fireEvent.click(example)
  const first = workers[0]!
  expect(first.postMessage).toHaveBeenCalledWith("example")
  complete(first)
  const picker = screen.getByRole<HTMLSelectElement>("combobox", {
    name: messages.layer,
  })
  fireEvent.change(picker, { target: { value: "1" } })
  expect(picker.value).toBe("1")

  fireEvent.click(example)
  expect(screen.getByRole("status").textContent).toContain(messages.loading)
  const replacement = workers[1]!
  expect(replacement.postMessage).toHaveBeenCalledWith("example")
  complete(replacement)
  expect(
    screen.getByRole<HTMLSelectElement>("combobox", { name: messages.layer })
      .value
  ).toBe("0")
})
