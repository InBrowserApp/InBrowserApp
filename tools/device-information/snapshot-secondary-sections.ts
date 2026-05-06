import { formatBytes } from "./core/device-info"
import { canUseStorage } from "./snapshot-readers"
import { booleanValue, valueEntry } from "./snapshot-format"

import type { SnapshotContext } from "./snapshot-context"
import type { InfoSection } from "./types"

function createNetworkStorageSection(context: SnapshotContext): InfoSection {
  const { messages, connection, storageEstimate } = context

  return {
    id: "network-storage",
    title: messages.networkStorageSectionTitle,
    description: messages.networkStorageSectionDescription,
    entries: [
      valueEntry(
        "connection-type",
        messages.connectionType,
        context.connectionType,
        messages
      ),
      valueEntry(
        "downlink",
        messages.downlink,
        context.downlink
          ? `${context.downlink} ${messages.megabitsPerSecond}`
          : undefined,
        messages
      ),
      valueEntry(
        "round-trip-time",
        messages.roundTripTime,
        context.rtt ? `${context.rtt} ${messages.milliseconds}` : undefined,
        messages
      ),
      valueEntry(
        "save-data",
        messages.saveData,
        booleanValue(
          connection?.saveData,
          messages,
          messages.enabled,
          messages.disabled
        ),
        messages
      ),
      valueEntry(
        "storage-quota",
        messages.storageQuota,
        storageEstimate?.quota ? formatBytes(storageEstimate.quota) : undefined,
        messages
      ),
      valueEntry(
        "storage-usage",
        messages.storageUsage,
        storageEstimate?.usage ? formatBytes(storageEstimate.usage) : undefined,
        messages
      ),
    ],
  }
}

function createCapabilitiesSection(context: SnapshotContext): InfoSection {
  const { messages, navigatorApi, gpu } = context

  return {
    id: "capabilities",
    title: messages.capabilitiesSectionTitle,
    description: messages.capabilitiesSectionDescription,
    entries: [
      valueEntry(
        "secure-context",
        messages.secureContext,
        booleanValue(window.isSecureContext, messages),
        messages
      ),
      valueEntry(
        "online-status",
        messages.onlineStatus,
        booleanValue(
          navigatorApi.onLine,
          messages,
          messages.online,
          messages.offline
        ),
        messages
      ),
      valueEntry(
        "do-not-track",
        messages.doNotTrack,
        navigatorApi.doNotTrack ?? messages.notRequested,
        messages
      ),
      valueEntry(
        "local-storage",
        messages.localStorage,
        booleanValue(
          canUseStorage("localStorage"),
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "session-storage",
        messages.sessionStorage,
        booleanValue(
          canUseStorage("sessionStorage"),
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "service-worker",
        messages.serviceWorker,
        booleanValue(
          "serviceWorker" in navigatorApi,
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "webgl",
        messages.webGl,
        booleanValue(
          gpu.webgl,
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "webgl2",
        messages.webGl2,
        booleanValue(
          gpu.webgl2,
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
      valueEntry(
        "clipboard",
        messages.clipboard,
        booleanValue(
          navigatorApi.clipboard?.writeText !== undefined,
          messages,
          messages.supported,
          messages.unsupported
        ),
        messages
      ),
    ],
  }
}

function createSecondarySections(context: SnapshotContext) {
  return [
    createNetworkStorageSection(context),
    createCapabilitiesSection(context),
  ] as const
}

export { createSecondarySections }
