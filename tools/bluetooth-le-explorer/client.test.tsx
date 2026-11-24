import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import BluetoothExplorer from "./client"
import messages from "./messages/en.json"

const serviceUuid = "0000180f-0000-1000-8000-00805f9b34fb"
const characteristicUuid = "00002a19-0000-1000-8000-00805f9b34fb"
const text = (input: string) =>
  new DataView(new TextEncoder().encode(input).buffer)

function setUpDevice() {
  const characteristic = Object.assign(new EventTarget(), {
    uuid: characteristicUuid,
    properties: {
      read: true,
      write: true,
      writeWithoutResponse: false,
      notify: true,
      indicate: false,
    },
    value: undefined as DataView | undefined,
    readValue: vi.fn().mockResolvedValue(text("ok")),
    startNotifications: vi.fn().mockResolvedValue(undefined),
    stopNotifications: vi.fn().mockResolvedValue(undefined),
  })
  const server = {
    connect: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn(),
    getPrimaryServices: vi
      .fn()
      .mockResolvedValue([
        { uuid: serviceUuid, getCharacteristics: async () => [characteristic] },
      ]),
  }
  const device = Object.assign(new EventTarget(), {
    name: "BLE Sensor",
    gatt: server,
  })
  const requestDevice = vi.fn().mockResolvedValue(device)
  vi.stubGlobal("navigator", { bluetooth: { requestDevice } })
  return { requestDevice, device, server, characteristic }
}

function renderExplorer() {
  return render(<BluetoothExplorer messages={messages} />)
}

function actionName(name: string) {
  return [messages.read, messages.subscribe, messages.unsubscribe].includes(
    name
  )
    ? `${name} ${characteristicUuid}`
    : name
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name: actionName(name) }))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("validates service UUIDs, browses a device, and reads data", async () => {
  const { requestDevice, characteristic, server } = setUpDevice()
  renderExplorer()
  const input = screen.getByLabelText(messages.additionalServices)
  fireEvent.change(input, { target: { value: "GGGG" } })
  expect(screen.getByText(messages.invalidUuid)).toBeDefined()
  fireEvent.change(input, { target: { value: "FAB0" } })
  click(messages.connect)
  await screen.findByText("BLE Sensor")
  expect(requestDevice).toHaveBeenCalledWith({
    acceptAllDevices: true,
    optionalServices: expect.arrayContaining([0x180f, 0xfab0]),
  })
  expect(screen.getByText(serviceUuid)).toBeDefined()
  click(messages.read)
  await screen.findByText("6F 6B")
  expect(screen.getByText("ok")).toBeDefined()
  expect(characteristic.readValue).toHaveBeenCalledOnce()
  click(messages.disconnect)
  expect(server.disconnect).toHaveBeenCalledOnce()
  expect(screen.queryByText("BLE Sensor")).toBeNull()
})

test("subscribes to updates, exports them, stops the subscription, and clears the log", async () => {
  const { characteristic, device, server } = setUpDevice()
  const createObjectURL = vi.fn().mockReturnValue("blob:bluetooth-log")
  vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() })
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {})
  renderExplorer()
  click(messages.connect)
  await screen.findByText("BLE Sensor")
  click(messages.subscribe)
  await screen.findByRole("button", { name: actionName(messages.unsubscribe) })
  expect(
    screen.queryByRole("button", { name: actionName(messages.read) })
  ).toBeNull()
  act(() => {
    characteristic.value = text("24")
    characteristic.dispatchEvent(new Event("characteristicvaluechanged"))
  })
  expect(screen.getAllByText("32 34")).toHaveLength(2)
  click(messages.download)
  const exported = createObjectURL.mock.calls[0]?.[0] as Blob
  const records = JSON.parse(await exported.text())
  expect(records).toEqual([
    expect.objectContaining({
      uuid: characteristicUuid,
      hex: "32 34",
      text: "24",
      time: expect.any(String),
    }),
  ])
  click(messages.unsubscribe)
  await screen.findByRole("button", { name: actionName(messages.subscribe) })
  expect(characteristic.stopNotifications).toHaveBeenCalledOnce()
  act(() => device.dispatchEvent(new Event("gattserverdisconnected")))
  expect(server.disconnect).toHaveBeenCalledOnce()
  expect(screen.getByText("32 34")).toBeDefined()
  click(messages.clear)
  expect(screen.getByText(messages.noNotifications)).toBeDefined()
})

test("shows a setup message for a browser without Web Bluetooth", async () => {
  vi.stubGlobal("navigator", {})
  renderExplorer()
  expect(await screen.findByText(messages.unsupported)).toBeDefined()
})

test("allows retry after cancellation and explains connection errors", async () => {
  const { requestDevice, server } = setUpDevice()
  requestDevice.mockRejectedValueOnce(
    new DOMException("cancelled", "NotFoundError")
  )
  server.connect.mockRejectedValueOnce(
    new DOMException("not connected", "NetworkError")
  )
  renderExplorer()
  await act(async () => click(messages.connect))
  expect(screen.queryByRole("alert")).toBeNull()
  click(messages.connect)
  await screen.findByText(messages.connectionError)
})

test("recovers from failed GATT operations and releases subscriptions on unmount", async () => {
  const { characteristic, server } = setUpDevice()
  characteristic.readValue.mockRejectedValueOnce(new DOMException("busy"))
  characteristic.startNotifications.mockRejectedValueOnce(
    new DOMException("busy")
  )
  const { unmount } = renderExplorer()
  click(messages.connect)
  await screen.findByText("BLE Sensor")
  click(messages.read)
  await screen.findByText(messages.operationError)
  click(messages.subscribe)
  await screen.findByText(messages.operationError)
  click(messages.subscribe)
  await screen.findByRole("button", { name: actionName(messages.unsubscribe) })
  unmount()
  expect(server.disconnect).toHaveBeenCalledOnce()
})

test("explains a connection with no authorized services", async () => {
  const { server, device } = setUpDevice()
  device.name = ""
  server.getPrimaryServices.mockResolvedValue([])
  renderExplorer()
  click(messages.connect)
  await screen.findByText(messages.unnamedDevice)
  await waitFor(() =>
    expect(screen.getByText(messages.emptyServices)).toBeDefined()
  )
})

test("can reconnect as soon as a device disconnects during a pending read", async () => {
  const { characteristic, device, requestDevice } = setUpDevice()
  let finishRead!: (value: DataView) => void
  characteristic.readValue.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishRead = resolve
      })
  )
  renderExplorer()
  click(messages.connect)
  await screen.findByText("BLE Sensor")
  click(messages.read)
  act(() => device.dispatchEvent(new Event("gattserverdisconnected")))
  click(messages.connect)
  await screen.findByText("BLE Sensor")
  expect(requestDevice).toHaveBeenCalledTimes(2)
  await act(async () => finishRead(text("stale")))
  expect(screen.queryByText("stale")).toBeNull()
})

test("does not report a stale service discovery failure after a device disconnects", async () => {
  const { device, server } = setUpDevice()
  let failDiscovery!: (error: Error) => void
  server.getPrimaryServices.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        failDiscovery = reject
      })
  )
  renderExplorer()
  await act(async () => click(messages.connect))
  expect(server.getPrimaryServices).toHaveBeenCalledOnce()
  act(() => device.dispatchEvent(new Event("gattserverdisconnected")))
  await act(async () => failDiscovery(new Error("disconnected")))
  expect(screen.queryByRole("alert")).toBeNull()
  click(messages.connect)
  await screen.findByText("BLE Sensor")
})
