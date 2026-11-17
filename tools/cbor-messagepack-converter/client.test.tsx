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
import messages from "./messages/en.json"
import { convert, type Request } from "./core/convert"

class MockWorker {
  static instances: MockWorker[] = []
  static throw = false
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: (() => void) | null = null
  terminate = vi.fn()
  request: Request | null = null
  constructor() {
    if (MockWorker.throw) throw new Error("blocked")
    MockWorker.instances.push(this)
  }
  postMessage(request: Request) {
    this.request = request
  }
  finish(data?: unknown) {
    let reply = data
    if (!reply) {
      try {
        reply = { result: convert(this.request!) }
      } catch (error) {
        reply = { error: (error as Error).message }
      }
    }
    this.onmessage?.({ data: reply } as MessageEvent)
  }
}
const last = () => MockWorker.instances.at(-1)!
const input = () =>
  screen.getByRole("textbox", { name: /Input/ }) as HTMLTextAreaElement
const output = () =>
  screen.getByRole("textbox", { name: /Output/ }) as HTMLTextAreaElement
const convertButton = () =>
  screen.getByRole("button", { name: messages.convert })
function change(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}
function finish() {
  act(() => last().finish())
}

beforeEach(() => {
  MockWorker.instances = []
  MockWorker.throw = false
  vi.stubGlobal("Worker", MockWorker)
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn(() => "blob:result"),
      revokeObjectURL: vi.fn(),
    })
  )
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

test("encodes, copies and downloads raw binary; reverses to JSON", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  })
  render(<Client messages={messages} />)
  expect(
    screen.getByRole("combobox", { name: messages.direction })
  ).toBeTruthy()
  expect(screen.getByRole("combobox", { name: messages.format })).toBeTruthy()
  expect(
    screen.getByRole("combobox", { name: messages.representation })
  ).toBeTruthy()
  expect(output().value).toBe("")
  expect(
    screen
      .getByRole("button", { name: messages.download })
      .hasAttribute("disabled")
  ).toBe(true)
  fireEvent.click(convertButton())
  finish()
  expect(output().value).toMatch(/^a4/)
  fireEvent.click(screen.getByRole("button", { name: messages.copy }))
  await waitFor(() => expect(writeText).toHaveBeenCalled())
  vi.useFakeTimers()
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob))
  act(() => vi.advanceTimersByTime(1200))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:result")
  vi.useRealTimers()
  change(messages.direction, "decode")
  fireEvent.click(convertButton())
  finish()
  expect(JSON.parse(output().value).message).toBe("Hello, 世界")
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
})

test("switches formats, representations, examples and clears stale results", () => {
  render(<Client messages={messages} />)
  change(messages.format, "msgpack")
  change(messages.representation, "base64url")
  fireEvent.click(convertButton())
  finish()
  expect(output().value).toMatch(/^[\w-]+$/)
  fireEvent.change(input(), { target: { value: "null" } })
  expect(output().value).toBe("")
  change(messages.direction, "decode")
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  fireEvent.click(convertButton())
  finish()
  expect(JSON.parse(output().value)).toEqual({ ok: true, message: "Hello" })
  fireEvent.click(screen.getByRole("button", { name: messages.clear }))
  expect(input().value).toBe("")
  change(messages.direction, "encode")
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(input().value).toContain("世界")
})

test("typed results enable extended JSON on reversal", () => {
  render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("checkbox", { name: messages.extended }))
  fireEvent.change(input(), {
    target: { value: '{"$integer":"9007199254740993"}' },
  })
  fireEvent.click(convertButton())
  finish()
  change(messages.direction, "decode")
  fireEvent.click(convertButton())
  finish()
  expect(screen.getByText(messages.typedOutput)).toBeTruthy()
  change(messages.direction, "encode")
  expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(true)
})

test("cancels, ignores stale worker messages and handles invalid input", () => {
  render(<Client messages={messages} />)
  fireEvent.click(convertButton())
  const old = last()
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(old.terminate).toHaveBeenCalled()
  act(() => {
    old.finish()
    old.onerror?.()
  })
  expect(output().value).toBe("")
  fireEvent.change(input(), { target: { value: "{" } })
  fireEvent.click(convertButton())
  finish()
  expect(screen.getByRole("alert").textContent).toContain(messages.invalid)
  fireEvent.change(input(), { target: { value: "true" } })
  expect(screen.queryByRole("alert")).toBeNull()
})

test("worker failures, timeout and constructor failure are recoverable", () => {
  vi.useFakeTimers()
  render(<Client messages={messages} />)
  fireEvent.click(convertButton())
  act(() => last().finish({}))
  expect(screen.getByRole("alert").textContent).toContain(messages.workerError)
  fireEvent.click(convertButton())
  act(() => last().onerror?.())
  expect(screen.getByRole("alert").textContent).toContain(messages.workerError)
  fireEvent.click(convertButton())
  act(() => vi.advanceTimersByTime(10000))
  expect(screen.getByRole("alert").textContent).toContain(messages.timeoutError)
  MockWorker.throw = true
  fireEvent.click(convertButton())
  expect(screen.getByRole("alert").textContent).toContain(messages.workerError)
})

test("imports JSON and raw binary; handles cancelled, oversized, unreadable and stale files", async () => {
  render(<Client messages={messages} />)
  const fileInput = screen.getByLabelText(messages.import) as HTMLInputElement
  fireEvent.click(screen.getByRole("button", { name: messages.import }))
  fireEvent.change(fileInput, { target: { files: [] } })
  fireEvent.change(fileInput, {
    target: { files: [{ size: 4, text: async () => "true" }] },
  })
  await waitFor(() => expect(input().value).toBe("true"))
  fireEvent.change(fileInput, {
    target: { files: [{ size: 1024 * 1024 + 1 }] },
  })
  expect(screen.getByRole("alert").textContent).toContain(messages.sizeError)
  fireEvent.change(fileInput, {
    target: {
      files: [
        {
          size: 4,
          text: async () => {
            throw new Error("read")
          },
        },
      ],
    },
  })
  await waitFor(() =>
    expect(screen.getByRole("alert").textContent).toContain(messages.fileError)
  )
  let resolve!: (text: string) => void
  fireEvent.change(fileInput, {
    target: {
      files: [
        {
          size: 4,
          text: () =>
            new Promise<string>((done) => {
              resolve = done
            }),
        },
      ],
    },
  })
  fireEvent.change(input(), { target: { value: "false" } })
  await act(async () => resolve("null"))
  expect(input().value).toBe("false")
  let reject!: (error: Error) => void
  fireEvent.change(fileInput, {
    target: {
      files: [
        {
          size: 4,
          text: () =>
            new Promise<string>((_, fail) => {
              reject = fail
            }),
        },
      ],
    },
  })
  fireEvent.change(input(), { target: { value: "null" } })
  await act(async () => reject(new Error("stale")))
  expect(screen.queryByRole("alert")).toBeNull()
  change(messages.direction, "decode")
  fireEvent.change(fileInput, {
    target: {
      files: [
        { size: 1, arrayBuffer: async () => new Uint8Array([0xf5]).buffer },
      ],
    },
  })
  await waitFor(() => expect(input().value).toBe("f5"))
  fireEvent.click(convertButton())
  finish()
  expect(output().value).toBe("true")
  change(messages.format, "msgpack")
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  fireEvent.click(convertButton())
  finish()
  expect(output().value).toContain("Hello")
})
