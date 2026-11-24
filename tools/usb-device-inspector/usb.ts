export type Endpoint = {
  endpointNumber: number
  direction: "in" | "out"
  type: "bulk" | "interrupt" | "isochronous"
  packetSize: number
}

type Alternate = {
  alternateSetting: number
  interfaceName?: string
  interfaceClass: number
  interfaceSubclass: number
  interfaceProtocol: number
  endpoints: Endpoint[]
}

type UsbInterface = {
  interfaceNumber: number
  alternates: Alternate[]
}

export type Configuration = {
  configurationValue: number
  configurationName?: string
  interfaces: UsbInterface[]
}

export type Device = {
  opened: boolean
  vendorId: number
  productId: number
  productName?: string
  manufacturerName?: string
  serialNumber?: string
  usbVersionMajor: number
  usbVersionMinor: number
  usbVersionSubminor: number
  deviceVersionMajor: number
  deviceVersionMinor: number
  deviceVersionSubminor: number
  deviceClass: number
  deviceSubclass: number
  deviceProtocol: number
  configurations: Configuration[]
  open(): Promise<void>
  close(): Promise<void>
}

type Usb = EventTarget & {
  requestDevice(options: { filters: [] }): Promise<Device>
}

export type ConnectionEvent = Event & { device: Device }

export function getUsb() {
  return (navigator as Navigator & { usb?: Usb }).usb
}
