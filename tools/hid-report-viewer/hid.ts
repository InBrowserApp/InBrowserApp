type ReportInfo = { reportId: number }

export type HidCollection = {
  usagePage: number
  usage: number
  inputReports: ReportInfo[]
  outputReports: ReportInfo[]
  featureReports: ReportInfo[]
  children: HidCollection[]
}

export type HidDevice = EventTarget & {
  readonly opened: boolean
  readonly vendorId: number
  readonly productId: number
  readonly productName: string
  readonly collections: HidCollection[]
  open(): Promise<void>
  close(): Promise<void>
}

export type HidReportEvent = Event & { reportId: number; data: DataView }
export type HidConnectionEvent = Event & { device: HidDevice }

type Hid = EventTarget & {
  requestDevice(options: { filters: [] }): Promise<HidDevice[]>
}

export function getHid() {
  return (navigator as Navigator & { hid?: Hid }).hid
}
