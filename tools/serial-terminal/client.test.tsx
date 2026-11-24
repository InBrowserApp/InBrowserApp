import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import SerialTerminal from "./client"
import messages from "./messages/en.json"

function setUpPort() {
  let receiver!: ReadableStreamDefaultController<Uint8Array>
  const write = vi.fn()
  const port = {
    readable: new ReadableStream<Uint8Array>({
      start(controller) {
        receiver = controller
      },
    }),
    writable: new WritableStream<Uint8Array>({ write }),
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  }
  const requestPort = vi.fn().mockResolvedValue(port)
  vi.stubGlobal("navigator", { serial: { requestPort } })
  return { port, receiver, write, requestPort }
}

function renderTerminal() {
  return render(<SerialTerminal language="en" messages={messages} />)
}

function connect() {
  fireEvent.click(screen.getByRole("button", { name: messages.connect }))
}

async function waitConnected() {
  await screen.findByText(messages.connected)
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("shows a useful state when the current browser has no serial API", async () => {
  vi.stubGlobal("navigator", {})
  renderTerminal()
  await screen.findByText(messages.unsupported)
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.connect })
      .disabled
  ).toBe(true)
})

test("opens a selected port, sends text, streams UTF-8, and exports hex", async () => {
  const { port, receiver, write } = setUpPort()
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn().mockReturnValue("blob:serial-log"),
    revokeObjectURL: vi.fn(),
  })
  const download = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  renderTerminal()
  const baud = screen.getByLabelText(messages.baudRate)
  fireEvent.change(baud, { target: { value: "0" } })
  expect(screen.getByText(messages.invalidBaud)).toBeDefined()
  fireEvent.change(baud, { target: { value: "9600" } })
  connect()
  await waitConnected()
  expect(port.open).toHaveBeenCalledWith({ baudRate: 9600 })

  fireEvent.change(screen.getByLabelText(messages.lineEnding), {
    target: { value: "crlf" },
  })
  fireEvent.change(screen.getByLabelText(messages.input), {
    target: { value: "AT" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.send }))
  await waitFor(() =>
    expect(write).toHaveBeenCalledWith(
      Uint8Array.of(65, 84, 13, 10),
      expect.anything()
    )
  )

  receiver.enqueue(Uint8Array.of(0xc3))
  receiver.enqueue(Uint8Array.of(0xa9))
  await screen.findByText("é")
  fireEvent.click(screen.getByRole("button", { name: messages.pauseScroll }))
  expect(
    screen.getByRole("button", { name: messages.resumeScroll })
  ).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.resumeScroll }))
  fireEvent.change(screen.getByLabelText(messages.displayMode), {
    target: { value: "hex" },
  })
  expect(screen.getByText("41 54 0D 0A")).toBeDefined()
  expect(screen.getByText("C3 A9")).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.download }))
  expect(download).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole("button", { name: messages.clear }))
  expect(screen.getByText(messages.awaitingData)).toBeDefined()

  fireEvent.click(screen.getByRole("button", { name: messages.disconnect }))
  await screen.findByText(messages.disconnected)
  expect(port.close).toHaveBeenCalledOnce()
  expect(port.readable.locked).toBe(false)
  expect(port.writable.locked).toBe(false)
})

test("validates hex and handles a failed write and device removal", async () => {
  const { receiver, write, port } = setUpPort()
  write.mockRejectedValueOnce(new Error("write failed"))
  renderTerminal()
  connect()
  await waitConnected()
  fireEvent.change(screen.getByLabelText(messages.sendMode), {
    target: { value: "hex" },
  })
  fireEvent.change(screen.getByLabelText(messages.input), {
    target: { value: "A" },
  })
  expect(screen.getByText(messages.invalidHex)).toBeDefined()
  fireEvent.change(screen.getByLabelText(messages.input), {
    target: { value: "A0" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.send }))
  await screen.findByText(messages.writeError)
  expect(write.mock.calls[0]?.[0]).toEqual(Uint8Array.of(0xa0))
  receiver.error(new Error("unplugged"))
  await screen.findByText(messages.readError)
  await screen.findByText(messages.disconnected)
  expect(port.close).toHaveBeenCalledOnce()
})

test("picker cancellation allows retry and open errors explain what happened", async () => {
  const { requestPort, port } = setUpPort()
  requestPort.mockRejectedValueOnce(
    new DOMException("cancelled", "NotFoundError")
  )
  port.open.mockRejectedValueOnce(new DOMException("busy", "NetworkError"))
  renderTerminal()
  await act(async () => connect())
  expect(screen.queryByRole("alert")).toBeNull()
  connect()
  await screen.findByText(messages.connectionError)
})

test("keeps a recent log and releases the port on unmount", async () => {
  const { port, receiver } = setUpPort()
  const { unmount } = renderTerminal()
  connect()
  await waitConnected()
  receiver.enqueue(new Uint8Array(401 * 4096).fill(66))
  await screen.findByText(messages.retention)
  unmount()
  await waitFor(() => expect(port.close).toHaveBeenCalledOnce())
})
