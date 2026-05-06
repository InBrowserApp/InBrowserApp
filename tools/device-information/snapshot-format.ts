import type { FormFactor } from "./core/device-info"
import type { DeviceInformationMessages, InfoEntry } from "./types"

function valueEntry(
  id: string,
  label: string,
  value: string | undefined,
  messages: DeviceInformationMessages,
  options: Readonly<{ code?: boolean }> = {}
): InfoEntry {
  return {
    id,
    label,
    value: value ?? messages.unavailable,
    unavailable: value === undefined,
    code: options.code,
  }
}

function booleanValue(
  value: boolean | undefined,
  messages: DeviceInformationMessages,
  trueLabel = messages.yes,
  falseLabel = messages.no
) {
  if (value === undefined) {
    return undefined
  }

  return value ? trueLabel : falseLabel
}

function formatDateTime(value: Date, language: string) {
  return new Intl.DateTimeFormat(language, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(value)
}

function formatNumber(value: number | undefined, language: string) {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined
  }

  return new Intl.NumberFormat(language).format(value)
}

function formatOrientation(
  orientation: string | undefined,
  messages: DeviceInformationMessages
) {
  switch (orientation) {
    case "portrait-primary":
      return messages.portraitPrimary
    case "portrait-secondary":
      return messages.portraitSecondary
    case "landscape-primary":
      return messages.landscapePrimary
    case "landscape-secondary":
      return messages.landscapeSecondary
    default:
      return undefined
  }
}

function formatFormFactor(
  formFactor: FormFactor,
  messages: DeviceInformationMessages
) {
  const labels = {
    phone: messages.phone,
    tablet: messages.tablet,
    desktop: messages.desktop,
    touchDesktop: messages.touchDesktop,
    unknown: messages.unknown,
  } satisfies Record<FormFactor, string>

  return labels[formFactor] ?? formFactor
}

export {
  booleanValue,
  formatDateTime,
  formatFormFactor,
  formatNumber,
  formatOrientation,
  valueEntry,
}
