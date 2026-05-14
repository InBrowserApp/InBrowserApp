import { isValidBase64, isValidHex, type SaltFormat } from "../core/scrypt"

function getInvalidSaltFormat(
  saltText: string,
  selectedFile: File | null,
  saltFormat: SaltFormat
) {
  if (selectedFile || saltText.trim().length === 0) {
    return ""
  }

  if (saltFormat === "hex" && !isValidHex(saltText)) {
    return "hex"
  }

  if (saltFormat === "base64" && !isValidBase64(saltText)) {
    return "base64"
  }

  return ""
}

function persistSetting(key: string, value: string) {
  /* v8 ignore next */
  if (typeof window === "undefined") return

  window.localStorage.setItem(key, value)
}

function formatMemoryUsage(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KiB`
  }

  return `${formatNumber(bytes / (1024 * 1024))} MiB`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value)
}

export { formatMemoryUsage, getInvalidSaltFormat, persistSetting }
