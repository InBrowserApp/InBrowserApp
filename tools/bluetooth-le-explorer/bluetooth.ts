export type Characteristic = EventTarget & {
  uuid: string
  properties: {
    read: boolean
    write: boolean
    writeWithoutResponse: boolean
    notify: boolean
    indicate: boolean
  }
  value?: DataView
  readValue(): Promise<DataView>
  startNotifications(): Promise<Characteristic>
  stopNotifications(): Promise<Characteristic>
}

type Service = {
  uuid: string
  getCharacteristics(): Promise<Characteristic[]>
}

type Server = {
  connect(): Promise<Server>
  disconnect(): void
  getPrimaryServices(): Promise<Service[]>
}

export type Device = EventTarget & { name?: string; gatt?: Server }

type Bluetooth = {
  requestDevice(options: {
    acceptAllDevices: true
    optionalServices: (number | string)[]
  }): Promise<Device>
}

export function getBluetooth() {
  return (navigator as Navigator & { bluetooth?: Bluetooth }).bluetooth
}
