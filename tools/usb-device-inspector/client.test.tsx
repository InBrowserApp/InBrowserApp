import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import UsbDeviceInspector from "./client"
import messages from "./messages/en.json"

function setup() {
  const device = {
    opened: false,
    vendorId: 0x1209,
    productId: 0x0042,
    productName: "Test Board",
    manufacturerName: "Workshop",
    serialNumber: "ABC",
    usbVersionMajor: 2,
    usbVersionMinor: 1,
    usbVersionSubminor: 0,
    deviceVersionMajor: 1,
    deviceVersionMinor: 2,
    deviceVersionSubminor: 3,
    deviceClass: 0,
    deviceSubclass: 0,
    deviceProtocol: 0,
    configurations: [
      {
        configurationValue: 1,
        configurationName: "Main",
        interfaces: [
          {
            interfaceNumber: 0,
            alternates: [
              {
                alternateSetting: 0,
                interfaceName: "Data",
                interfaceClass: 255,
                interfaceSubclass: 0,
                interfaceProtocol: 1,
                endpoints: [
                  {
                    endpointNumber: 2,
                    direction: "in",
                    type: "bulk",
                    packetSize: 64,
                  },
                ],
              },
              {
                alternateSetting: 1,
                interfaceName: "Idle",
                interfaceClass: 255,
                interfaceSubclass: 0,
                interfaceProtocol: 1,
                endpoints: [],
              },
            ],
          },
        ],
      },
      { configurationValue: 2, configurationName: "Secondary", interfaces: [] },
    ],
    open: vi.fn(async () => {
      device.opened = true
    }),
    close: vi.fn(async () => {
      device.opened = false
    }),
  }
  const usb = Object.assign(new EventTarget(), {
    requestDevice: vi.fn().mockResolvedValue(device),
  })
  vi.stubGlobal("navigator", { usb })
  function unplug() {
    usb.dispatchEvent(Object.assign(new Event("disconnect"), { device }))
  }
  return { device, usb, unplug }
}

function click(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

test("shows read-only descriptor metadata as soon as the device is selected", async () => {
  const { device, usb } = setup()
  render(<UsbDeviceInspector messages={messages} />)
  expect(screen.getByText(messages.chooseHint)).toBeDefined()
  click(messages.select)
  await screen.findByText("Test Board")
  expect(usb.requestDevice).toHaveBeenCalledWith({ filters: [] })
  expect(screen.getByText("0x1209")).toBeDefined()
  expect(screen.getByText("0x0042")).toBeDefined()
  expect(screen.getByText("2.1.0")).toBeDefined()
  expect(screen.getByText("IN")).toBeDefined()
  expect(screen.getByText("64")).toBeDefined()
  expect(screen.getByText(messages.noEndpoints)).toBeDefined()
  expect(screen.getByText(messages.noInterfaces)).toBeDefined()
  expect(device.open).not.toHaveBeenCalled()
  click(messages.checkAccess)
  await screen.findByText(messages.accessOk)
  expect(device.open).toHaveBeenCalledOnce()
  expect(device.close).toHaveBeenCalledOnce()
})

test("handles denied permission, chooser cancellation, and opening errors", async () => {
  const { device, usb } = setup()
  usb.requestDevice.mockRejectedValueOnce(
    new DOMException("cancelled", "NotFoundError")
  )
  usb.requestDevice.mockRejectedValueOnce(
    new DOMException("denied", "SecurityError")
  )
  usb.requestDevice.mockRejectedValueOnce(new Error("not present"))
  device.open.mockRejectedValueOnce(new Error("driver unavailable"))
  render(<UsbDeviceInspector messages={messages} />)
  await act(async () => click(messages.select))
  expect(screen.queryByRole("alert")).toBeNull()
  click(messages.select)
  await screen.findByText(messages.permissionError)
  click(messages.select)
  await screen.findByText(messages.selectionError)
  click(messages.select)
  await screen.findByText("Test Board")
  click(messages.checkAccess)
  await screen.findByText(messages.openError)
  expect(device.close).not.toHaveBeenCalled()
})

test("keeps the descriptor visible after unplugging during an access check", async () => {
  const { device, unplug } = setup()
  let finish!: () => void
  device.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<UsbDeviceInspector messages={messages} />)
  click(messages.select)
  await screen.findByText("Test Board")
  click(messages.checkAccess)
  expect(screen.getByRole("button", { name: messages.checking })).toBeDefined()
  act(unplug)
  expect(screen.getByText(messages.disconnected)).toBeDefined()
  expect(screen.getByText("0x1209")).toBeDefined()
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.select })
      .disabled
  ).toBe(true)
  await act(async () => finish())
  expect(device.close).toHaveBeenCalledOnce()
  expect(screen.queryByText(messages.accessOk)).toBeNull()
})

test("shows unsupported browsers, and tolerates missing optional descriptor fields", async () => {
  vi.stubGlobal("navigator", {})
  const unsupported = render(<UsbDeviceInspector messages={messages} />)
  expect(await screen.findByText(messages.unsupported)).toBeDefined()
  unsupported.unmount()
  const { device, usb } = setup()
  device.productName = ""
  device.serialNumber = ""
  device.configurations = []
  device.opened = true
  const unsubscribe = vi.spyOn(usb, "removeEventListener")
  const ready = render(<UsbDeviceInspector messages={messages} />)
  click(messages.select)
  await screen.findByText(messages.unnamed)
  expect(screen.queryByText(messages.serialNumber)).toBeNull()
  expect(screen.getByText(messages.noConfigurations)).toBeDefined()
  click(messages.checkAccess)
  await screen.findByText(messages.accessOk)
  expect(device.close).not.toHaveBeenCalled()
  ready.unmount()
  expect(unsubscribe).toHaveBeenCalledWith("disconnect", expect.any(Function))
})

test("reports a failed release separately from a failed open", async () => {
  const { device } = setup()
  device.close.mockRejectedValueOnce(new Error("cannot close"))
  render(<UsbDeviceInspector messages={messages} />)
  click(messages.select)
  await screen.findByText("Test Board")
  click(messages.checkAccess)
  await screen.findByText(messages.closeError)
  expect(screen.queryByText(messages.accessOk)).toBeNull()
})
