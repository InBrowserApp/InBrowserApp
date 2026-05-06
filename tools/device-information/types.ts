import type { ToolMeta } from "@workspace/tool-sdk"

type DeviceInformationLocaleMessages = Readonly<{
  snapshotTitle: string
  snapshotDescription: string
  refresh: string
  refreshing: string
  copyJson: string
  copied: string
  loadingTitle: string
  loadingDescription: string
  capturedAt: string
  unavailable: string
  unknown: string
  yes: string
  no: string
  enabled: string
  disabled: string
  supported: string
  unsupported: string
  online: string
  offline: string
  phone: string
  tablet: string
  desktop: string
  touchDesktop: string
  summaryBrowser: string
  summaryPlatform: string
  summaryScreen: string
  summaryTimezone: string
  browserSectionTitle: string
  browserSectionDescription: string
  displaySectionTitle: string
  displaySectionDescription: string
  hardwareSectionTitle: string
  hardwareSectionDescription: string
  networkStorageSectionTitle: string
  networkStorageSectionDescription: string
  capabilitiesSectionTitle: string
  capabilitiesSectionDescription: string
  browserName: string
  primaryLanguage: string
  supportedLanguages: string
  cookiesEnabled: string
  platform: string
  userAgent: string
  clientHints: string
  screenResolution: string
  availableResolution: string
  viewportSize: string
  windowSize: string
  devicePixelRatio: string
  colorDepth: string
  orientation: string
  multipleScreens: string
  portraitPrimary: string
  portraitSecondary: string
  landscapePrimary: string
  landscapeSecondary: string
  bits: string
  hdr: string
  cpuCores: string
  cpuArchitecture: string
  cpuBitness: string
  deviceMemory: string
  deviceModel: string
  formFactor: string
  maxTouchPoints: string
  gpuVendor: string
  gpuRenderer: string
  connectionType: string
  downlink: string
  roundTripTime: string
  saveData: string
  storageQuota: string
  storageUsage: string
  secureContext: string
  onlineStatus: string
  doNotTrack: string
  localStorage: string
  sessionStorage: string
  serviceWorker: string
  webGl: string
  webGl2: string
  clipboard: string
  notRequested: string
  megabitsPerSecond: string
  milliseconds: string
}>

type DeviceInformationMessages = DeviceInformationLocaleMessages &
  Readonly<{
    meta: ToolMeta
  }>

type InfoEntry = Readonly<{
  id: string
  label: string
  value: string
  unavailable?: boolean
  code?: boolean
}>

type InfoSection = Readonly<{
  id: string
  title: string
  description: string
  entries: readonly InfoEntry[]
}>

type SummaryItem = Readonly<{
  id: string
  label: string
  value: string
  unavailable?: boolean
}>

type DeviceSnapshot = Readonly<{
  capturedAtIso: string
  capturedAtLabel: string
  summary: readonly SummaryItem[]
  sections: readonly InfoSection[]
}>

export type {
  DeviceInformationLocaleMessages,
  DeviceInformationMessages,
  DeviceSnapshot,
  InfoEntry,
  InfoSection,
}
