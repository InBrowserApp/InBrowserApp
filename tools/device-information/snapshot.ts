import {
  classifyFormFactor,
  describeColorDepth,
  detectBrowser,
  formatResolution,
  formatTimezone,
  normalizeConnectionType,
} from "./core/device-info"
import { formatDateTime, formatNumber, valueEntry } from "./snapshot-format"
import { createPrimarySections } from "./snapshot-primary-sections"
import {
  getConnection,
  readGpuInfo,
  readHighEntropyValues,
  readStorageEstimate,
  type NavigatorWithDeviceApis,
} from "./snapshot-readers"
import { createSecondarySections } from "./snapshot-secondary-sections"

import type { SnapshotContext } from "./snapshot-context"
import type { DeviceInformationMessages, DeviceSnapshot } from "./types"

async function captureDeviceSnapshot(
  messages: DeviceInformationMessages,
  language: string
): Promise<DeviceSnapshot> {
  const navigatorApi = window.navigator as NavigatorWithDeviceApis
  const now = new Date()
  const highEntropyValues = await readHighEntropyValues(navigatorApi)
  const storageEstimate = await readStorageEstimate(navigatorApi)
  const gpu = readGpuInfo()
  const connection = getConnection(navigatorApi)
  const screenResolution = formatResolution(
    window.screen.width,
    window.screen.height
  )
  const context: SnapshotContext = {
    messages,
    language,
    navigatorApi,
    highEntropyValues,
    storageEstimate,
    gpu,
    connection,
    browser: detectBrowser({
      userAgent: navigatorApi.userAgent,
      brands: navigatorApi.userAgentData?.brands,
    }),
    platform: navigatorApi.userAgentData?.platform ?? navigatorApi.platform,
    screenResolution,
    timezoneLabel: formatTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      -new Date().getTimezoneOffset()
    ),
    colorDepth: describeColorDepth(window.screen.colorDepth),
    formFactor: classifyFormFactor({
      explicitFormFactor: highEntropyValues?.formFactor,
      mobile: navigatorApi.userAgentData?.mobile,
      maxTouchPoints: navigatorApi.maxTouchPoints,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    }),
    languageList:
      navigatorApi.languages.length > 0
        ? navigatorApi.languages.join(", ")
        : undefined,
    connectionType: normalizeConnectionType(
      connection?.effectiveType,
      connection?.type
    ),
    downlink: formatNumber(connection?.downlink, language),
    rtt: formatNumber(connection?.rtt, language),
    clientHintsAvailable: navigatorApi.userAgentData !== undefined,
  }

  return {
    capturedAtIso: now.toISOString(),
    capturedAtLabel: formatDateTime(now, language),
    summary: [
      valueEntry("browser", messages.summaryBrowser, context.browser, messages),
      valueEntry(
        "platform",
        messages.summaryPlatform,
        context.platform,
        messages
      ),
      valueEntry(
        "screen",
        messages.summaryScreen,
        context.screenResolution,
        messages
      ),
      valueEntry(
        "timezone",
        messages.summaryTimezone,
        context.timezoneLabel,
        messages
      ),
    ],
    sections: [
      ...createPrimarySections(context),
      ...createSecondarySections(context),
    ],
  }
}

function serializeSnapshot(snapshot: DeviceSnapshot) {
  return JSON.stringify(
    {
      capturedAt: snapshot.capturedAtIso,
      summary: snapshot.summary,
      sections: snapshot.sections,
    },
    null,
    2
  )
}

export { captureDeviceSnapshot, serializeSnapshot }
