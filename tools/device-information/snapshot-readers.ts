import type { BrowserBrand } from "./core/device-info"

type UserAgentHighEntropyValues = Readonly<{
  architecture?: string
  bitness?: string
  model?: string
  platformVersion?: string
  fullVersionList?: readonly BrowserBrand[]
  wow64?: boolean
  formFactor?: string
}>

type UserAgentData = Readonly<{
  brands?: readonly BrowserBrand[]
  mobile?: boolean
  platform?: string
  getHighEntropyValues?: (
    hints: readonly string[]
  ) => Promise<UserAgentHighEntropyValues>
}>

type NetworkConnection = Readonly<{
  effectiveType?: string
  type?: string
  downlink?: number
  rtt?: number
  saveData?: boolean
}>

type NavigatorWithDeviceApis = Navigator &
  Readonly<{
    connection?: NetworkConnection
    mozConnection?: NetworkConnection
    webkitConnection?: NetworkConnection
    deviceMemory?: number
    userAgentData?: UserAgentData
  }>

type GpuInfo = Readonly<{
  vendor?: string
  renderer?: string
  webgl: boolean
  webgl2: boolean
}>

const HIGH_ENTROPY_HINTS = [
  "architecture",
  "bitness",
  "model",
  "platformVersion",
  "fullVersionList",
  "wow64",
  "formFactor",
] as const

async function readHighEntropyValues(navigatorApi: NavigatorWithDeviceApis) {
  try {
    return await navigatorApi.userAgentData?.getHighEntropyValues?.(
      HIGH_ENTROPY_HINTS
    )
  } catch {
    return undefined
  }
}

async function readStorageEstimate(navigatorApi: NavigatorWithDeviceApis) {
  try {
    return await navigatorApi.storage?.estimate?.()
  } catch {
    return undefined
  }
}

function readGpuInfo(): GpuInfo {
  try {
    const canvas = document.createElement("canvas")
    const webgl =
      canvas.getContext("webgl") ??
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null)
    const webgl2 = canvas.getContext("webgl2")
    const debugInfo = webgl?.getExtension("WEBGL_debug_renderer_info")

    return {
      webgl: webgl !== null,
      webgl2: webgl2 !== null,
      vendor:
        webgl && debugInfo
          ? String(webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL))
          : undefined,
      renderer:
        webgl && debugInfo
          ? String(webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL))
          : undefined,
    }
  } catch {
    return {
      webgl: false,
      webgl2: false,
    }
  }
}

function readWindowStorage(name: "localStorage" | "sessionStorage") {
  try {
    return window[name]
  } catch {
    return undefined
  }
}

function canUseStorage(name: "localStorage" | "sessionStorage") {
  const storage = readWindowStorage(name)

  if (storage === undefined) {
    return false
  }

  try {
    const key = "device-information-storage-check"
    storage.setItem(key, "1")
    storage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function getConnection(navigatorApi: NavigatorWithDeviceApis) {
  return (
    navigatorApi.connection ??
    navigatorApi.mozConnection ??
    navigatorApi.webkitConnection
  )
}

export {
  canUseStorage,
  getConnection,
  readGpuInfo,
  readHighEntropyValues,
  readStorageEstimate,
}
export type {
  GpuInfo,
  NavigatorWithDeviceApis,
  NetworkConnection,
  UserAgentHighEntropyValues,
}
