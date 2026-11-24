import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import HidReportViewer from "./client"
import messages from "./messages/en.json"

function setup() {
  const child = {
    usagePage: 9,
    usage: 2,
    inputReports: [],
    outputReports: [],
    featureReports: [],
    children: [],
  }
  const device = Object.assign(new EventTarget(), {
    opened: false,
    vendorId: 1725,
    productId: 10,
    productName: "Test Dial",
    collections: [
      {
        usagePage: 1,
        usage: 4,
        inputReports: [{ reportId: 1 }],
        outputReports: [{ reportId: 2 }],
        featureReports: [],
        children: [child],
      },
    ],
    open: vi.fn(async () => {
      device.opened = true
    }),
    close: vi.fn(async () => {
      device.opened = false
    }),
  })
  const hid = Object.assign(new EventTarget(), {
    requestDevice: vi.fn().mockResolvedValue([device]),
  })
  vi.stubGlobal("navigator", { hid })
  function input(reportId: number, ...bytes: number[]) {
    const data = new DataView(Uint8Array.of(...bytes).buffer)
    device.dispatchEvent(
      Object.assign(new Event("inputreport"), { reportId, data })
    )
  }
  return { device, hid, input }
}

function renderViewer() {
  return render(<HidReportViewer language="en" messages={messages} />)
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("discovers and opens the chosen device, then displays IDs and nested collections", async () => {
  const { device, hid } = setup()
  renderViewer()
  click(messages.connect)
  await screen.findByText("Test Dial")
  expect(hid.requestDevice).toHaveBeenCalledWith({ filters: [] })
  expect(device.open).toHaveBeenCalledOnce()
  expect(screen.getByText("0x06BD")).toBeDefined()
  expect(screen.getByText("0x0009")).toBeDefined()
  expect(screen.getAllByText(messages.feature)).toHaveLength(2)
  click(messages.disconnect)
  await screen.findByText(messages.disconnected)
  expect(device.close).toHaveBeenCalledOnce()
})

test("compares by report ID, pauses, clears, and keeps reports after unplugging", async () => {
  const { device, hid, input } = setup()
  const { container } = renderViewer()
  click(messages.connect)
  await screen.findByText(messages.waiting)
  act(() => {
    input(1, 1, 2)
    input(2, 6, 0)
    input(1, 1, 3)
  })
  await waitFor(() =>
    expect(container.querySelector('[data-changed="true"]')?.textContent).toBe(
      `03 ${messages.changed}`
    )
  )
  click(messages.pause)
  act(() => input(1, 55))
  expect(screen.queryByText("37")).toBeNull()
  click(messages.resume)
  act(() => input(1))
  await screen.findByText(messages.emptyReport)
  act(() =>
    hid.dispatchEvent(Object.assign(new Event("disconnect"), { device }))
  )
  await screen.findByText(messages.disconnected)
  expect(screen.getByText(messages.emptyReport)).toBeDefined()
  click(messages.clear)
  expect(screen.getByText(messages.startHint)).toBeDefined()
})

test("explains unsupported browsers and empty collections", async () => {
  vi.stubGlobal("navigator", {})
  const { unmount } = renderViewer()
  await screen.findByText(messages.unsupported)
  unmount()
  const { device } = setup()
  device.productName = ""
  device.collections = []
  renderViewer()
  click(messages.connect)
  await screen.findByText(messages.unnamed)
  expect(screen.getByText(messages.noCollections)).toBeDefined()
})

test("allows retry after chooser cancellation and handles open failures", async () => {
  const { device, hid } = setup()
  hid.requestDevice.mockResolvedValueOnce([])
  hid.requestDevice.mockRejectedValueOnce(
    new DOMException("cancelled", "NotFoundError")
  )
  device.open.mockRejectedValueOnce(
    new DOMException("failed", "NotAllowedError")
  )
  renderViewer()
  await act(async () => click(messages.connect))
  await act(async () => click(messages.connect))
  expect(screen.queryByRole("alert")).toBeNull()
  click(messages.connect)
  await screen.findByText(messages.connectionError)
})

test("bounds fast report bursts and releases listeners and the device on unmount", async () => {
  const { device, input } = setup()
  const removeListener = vi.spyOn(device, "removeEventListener")
  const { unmount } = renderViewer()
  click(messages.connect)
  await screen.findByText("Test Dial")
  act(() => {
    for (let index = 0; index < 90; index++) input(1, index)
  })
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(80))
  unmount()
  expect(removeListener).toHaveBeenCalledWith(
    "inputreport",
    expect.any(Function)
  )
  expect(device.close).toHaveBeenCalledOnce()
})

test("allows switching between interfaces returned by one chooser", async () => {
  const { device, hid, input } = setup()
  const second = Object.assign(new EventTarget(), {
    ...device,
    productName: "Second interface",
    open: vi.fn(),
    close: vi.fn(),
  })
  hid.requestDevice.mockResolvedValue([device, second])
  renderViewer()
  click(messages.connect)
  await screen.findByText("Test Dial")
  act(() => input(1, 1))
  await screen.findByText("01")
  fireEvent.change(screen.getByRole("combobox", { name: "HID" }), {
    target: { value: "1" },
  })
  await screen.findByText("Second interface")
  expect(hid.requestDevice).toHaveBeenCalledOnce()
  expect(device.close).toHaveBeenCalledOnce()
  expect(second.open).toHaveBeenCalledOnce()
  expect(screen.getByText(messages.waiting)).toBeDefined()
})
