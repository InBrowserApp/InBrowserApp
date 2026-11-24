import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import MidiMonitor from "./client"
import messages from "./messages/en.json"

function createPort(id: string, name: string) {
  return Object.assign(new EventTarget(), {
    id,
    name,
    state: "connected",
    open: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
  })
}

function setup() {
  const port = createPort("keys", "Studio Keys")
  const access = Object.assign(new EventTarget(), {
    inputs: new Map([[port.id, port]]),
  })
  const requestMIDIAccess = vi.fn().mockResolvedValue(access)
  vi.stubGlobal("navigator", { requestMIDIAccess })
  return { port, access, requestMIDIAccess }
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

function send(port: EventTarget, ...bytes: number[]) {
  port.dispatchEvent(
    Object.assign(new Event("midimessage"), { data: Uint8Array.of(...bytes) })
  )
}

function renderMonitor() {
  return render(<MidiMonitor language="en" messages={messages} />)
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("enables ordinary MIDI input and displays decoded messages, held notes, and clock", async () => {
  const { port, requestMIDIAccess } = setup()
  const { container } = renderMonitor()
  click(messages.enable)
  await screen.findByRole("option", { name: "Studio Keys" })
  expect(requestMIDIAccess).toHaveBeenCalledWith({ sysex: false })
  expect(document.activeElement).toBe(
    screen.getByRole("combobox", { name: messages.input })
  )
  expect(port.open).toHaveBeenCalledOnce()
  act(() => {
    send(port, 0x90, 60, 100)
    send(port, 0xb0, 64, 127)
    send(port, 0xe0, 0, 64)
    send(port, 0xf8)
    send(port, 0xf8)
  })
  await screen.findByText("90 3C 64")
  expect(
    container.querySelector('[title="C4"][data-active="true"]')
  ).toBeDefined()
  expect(screen.getByText("CC 64 · 127")).toBeDefined()
  expect(screen.getByText(messages.pitchBend)).toBeDefined()
  expect(screen.getByText(messages.clockPulses).textContent).toContain("2")
  act(() => send(port, 0x90, 60, 0))
  await screen.findByText(messages.noteOff)
  expect(container.querySelector('[title="C4"][data-active="true"]')).toBeNull()
  fireEvent.change(screen.getByRole("combobox", { name: messages.octave }), {
    target: { value: "9" },
  })
  expect(container.querySelector('[title="G9"]')).not.toBeNull()
  click(messages.clear)
  expect(screen.getByText(messages.emptyLog)).toBeDefined()
  expect(screen.getByText(messages.clockPulses).textContent).toContain("0")
})

test("changes inputs safely and preserves the last log when the input unplugs", async () => {
  const { access, port } = setup()
  const pads = createPort("pads", "Pads")
  access.inputs.set(pads.id, pads)
  renderMonitor()
  click(messages.enable)
  await screen.findByRole("option", { name: "Pads" })
  act(() => send(port, 0x90, 38, 22))
  await screen.findByText("90 26 16")
  fireEvent.change(screen.getByRole("combobox", { name: messages.input }), {
    target: { value: "pads" },
  })
  await waitFor(() => expect(port.close).toHaveBeenCalledOnce())
  expect(screen.queryByText("90 26 16")).toBeNull()
  act(() => {
    send(port, 0x91, 38, 22)
    send(pads, 0x92, 39, 22)
  })
  await screen.findByText("92 27 16")
  expect(screen.queryByText("91 26 16")).toBeNull()
  act(() => {
    access.inputs.clear()
    access.dispatchEvent(new Event("statechange"))
  })
  await screen.findByText(messages.noInputs)
  expect(screen.getByText("92 27 16")).toBeDefined()
  expect(screen.getByText(messages.none)).toBeDefined()
  await waitFor(() => expect(pads.close).toHaveBeenCalledOnce())
})

test("supports retry after MIDI access and input failures", async () => {
  const { port, requestMIDIAccess } = setup()
  requestMIDIAccess.mockRejectedValueOnce(new DOMException("denied"))
  port.open.mockRejectedValueOnce(new DOMException("busy"))
  renderMonitor()
  click(messages.enable)
  await screen.findByText(messages.accessError)
  click(messages.enable)
  await screen.findByText(messages.inputError)
  fireEvent.change(screen.getByRole("combobox", { name: messages.input }), {
    target: { value: port.id },
  })
  expect(screen.queryByRole("alert")).toBeNull()
  await act(async () => send(port, 0xb0, 7, 16))
  await screen.findByText("B0 07 10")
})

test("shows unsupported browsers and bounds noisy input logs", async () => {
  vi.stubGlobal("navigator", {})
  const unsupported = renderMonitor()
  await screen.findByText(messages.unsupported)
  unsupported.unmount()
  const { port } = setup()
  renderMonitor()
  click(messages.enable)
  await screen.findByRole("option", { name: "Studio Keys" })
  act(() => {
    for (let i = 0; i < 105; i++) send(port, 0xb0, 7, i)
    send(port, 0xfa)
  })
  const log = await screen.findByRole("region", { name: messages.log })
  expect(within(log).getAllByRole("listitem")).toHaveLength(100)
  expect(within(log).getByText(messages.other)).toBeDefined()
})

test("waits for a previous close before reopening the same MIDI port", async () => {
  const { port, access } = setup()
  const second = createPort("pads", "Pads")
  access.inputs.set(second.id, second)
  let finishClose!: () => void
  port.close.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finishClose = resolve
      })
  )
  renderMonitor()
  click(messages.enable)
  const input = await screen.findByRole("combobox", { name: messages.input })
  fireEvent.change(input, { target: { value: second.id } })
  await waitFor(() => expect(port.close).toHaveBeenCalledOnce())
  fireEvent.change(input, { target: { value: port.id } })
  expect(port.open).toHaveBeenCalledOnce()
  await act(async () => finishClose())
  expect(port.open).toHaveBeenCalledTimes(2)
  act(() => send(port, 0x90, 60, 64))
  await screen.findByText("90 3C 40")
})

test("preserves focus when permission is granted without an input", async () => {
  const { access } = setup()
  access.inputs.clear()
  renderMonitor()
  click(messages.enable)
  await screen.findByText(messages.noInputs)
  expect(document.activeElement).toBe(screen.getByRole("status"))
})
