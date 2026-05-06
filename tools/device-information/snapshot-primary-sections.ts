import { detectCpuArchitecture, formatResolution } from "./core/device-info"
import {
  booleanValue,
  formatFormFactor,
  formatNumber,
  formatOrientation,
  valueEntry,
} from "./snapshot-format"

import type { SnapshotContext } from "./snapshot-context"
import type { InfoSection } from "./types"

function createBrowserSection(context: SnapshotContext): InfoSection {
  const { messages, navigatorApi } = context

  return {
    id: "browser",
    title: messages.browserSectionTitle,
    description: messages.browserSectionDescription,
    entries: [
      valueEntry("browser", messages.browserName, context.browser, messages),
      valueEntry(
        "primary-language",
        messages.primaryLanguage,
        navigatorApi.language,
        messages
      ),
      valueEntry(
        "supported-languages",
        messages.supportedLanguages,
        context.languageList,
        messages
      ),
      valueEntry(
        "cookies",
        messages.cookiesEnabled,
        booleanValue(navigatorApi.cookieEnabled, messages),
        messages
      ),
      valueEntry("platform", messages.platform, context.platform, messages),
      valueEntry(
        "client-hints",
        messages.clientHints,
        booleanValue(
          context.clientHintsAvailable,
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "user-agent",
        messages.userAgent,
        navigatorApi.userAgent,
        messages,
        { code: true }
      ),
    ],
  }
}

function createDisplaySection(context: SnapshotContext): InfoSection {
  const { messages, language } = context

  return {
    id: "display",
    title: messages.displaySectionTitle,
    description: messages.displaySectionDescription,
    entries: [
      valueEntry(
        "screen-resolution",
        messages.screenResolution,
        context.screenResolution,
        messages
      ),
      valueEntry(
        "available-resolution",
        messages.availableResolution,
        formatResolution(window.screen.availWidth, window.screen.availHeight),
        messages
      ),
      valueEntry(
        "viewport-size",
        messages.viewportSize,
        formatResolution(window.innerWidth, window.innerHeight),
        messages
      ),
      valueEntry(
        "window-size",
        messages.windowSize,
        formatResolution(window.outerWidth, window.outerHeight),
        messages
      ),
      valueEntry(
        "device-pixel-ratio",
        messages.devicePixelRatio,
        formatNumber(window.devicePixelRatio, language),
        messages
      ),
      valueEntry(
        "color-depth",
        messages.colorDepth,
        context.colorDepth
          ? `${context.colorDepth.bits} ${messages.bits}${
              context.colorDepth.hdr ? ` (${messages.hdr})` : ""
            }`
          : undefined,
        messages
      ),
      valueEntry(
        "orientation",
        messages.orientation,
        formatOrientation(window.screen.orientation?.type, messages),
        messages
      ),
      valueEntry(
        "multiple-screens",
        messages.multipleScreens,
        booleanValue(
          (window.screen as Screen & { isExtended?: boolean }).isExtended,
          messages
        ),
        messages
      ),
    ],
  }
}

function createHardwareSection(context: SnapshotContext): InfoSection {
  const { messages, language, navigatorApi, highEntropyValues, gpu } = context

  return {
    id: "hardware",
    title: messages.hardwareSectionTitle,
    description: messages.hardwareSectionDescription,
    entries: [
      valueEntry(
        "cpu-cores",
        messages.cpuCores,
        formatNumber(navigatorApi.hardwareConcurrency, language),
        messages
      ),
      valueEntry(
        "cpu-architecture",
        messages.cpuArchitecture,
        detectCpuArchitecture({
          userAgent: navigatorApi.userAgent,
          architecture: highEntropyValues?.architecture,
        }),
        messages
      ),
      valueEntry(
        "cpu-bitness",
        messages.cpuBitness,
        highEntropyValues?.bitness
          ? `${highEntropyValues.bitness}-bit`
          : undefined,
        messages
      ),
      valueEntry(
        "device-memory",
        messages.deviceMemory,
        navigatorApi.deviceMemory
          ? `${formatNumber(navigatorApi.deviceMemory, language)} GB`
          : undefined,
        messages
      ),
      valueEntry(
        "device-model",
        messages.deviceModel,
        highEntropyValues?.model,
        messages
      ),
      valueEntry(
        "form-factor",
        messages.formFactor,
        formatFormFactor(context.formFactor, messages),
        messages
      ),
      valueEntry(
        "max-touch-points",
        messages.maxTouchPoints,
        formatNumber(navigatorApi.maxTouchPoints, language),
        messages
      ),
      valueEntry("gpu-vendor", messages.gpuVendor, gpu.vendor, messages),
      valueEntry("gpu-renderer", messages.gpuRenderer, gpu.renderer, messages),
    ],
  }
}

function createPrimarySections(context: SnapshotContext) {
  return [
    createBrowserSection(context),
    createDisplaySection(context),
    createHardwareSection(context),
  ] as const
}

export { createPrimarySections }
