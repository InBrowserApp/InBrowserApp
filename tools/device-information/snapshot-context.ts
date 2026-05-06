import type { ColorDepth, FormFactor } from "./core/device-info"
import type {
  GpuInfo,
  NavigatorWithDeviceApis,
  NetworkConnection,
  UserAgentHighEntropyValues,
} from "./snapshot-readers"
import type { DeviceInformationMessages } from "./types"

type SnapshotContext = Readonly<{
  messages: DeviceInformationMessages
  language: string
  navigatorApi: NavigatorWithDeviceApis
  highEntropyValues?: UserAgentHighEntropyValues
  storageEstimate?: StorageEstimate
  gpu: GpuInfo
  connection?: NetworkConnection
  browser?: string
  platform?: string
  screenResolution?: string
  timezoneLabel?: string
  colorDepth?: ColorDepth
  formFactor: FormFactor
  languageList?: string
  connectionType?: string
  downlink?: string
  rtt?: string
  clientHintsAvailable: boolean
}>

export type { SnapshotContext }
