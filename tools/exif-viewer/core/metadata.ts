type MetadataRecord = Record<string, unknown>
type MetadataGroupId = "basic" | "camera" | "gps" | "advanced"

type MetadataEntry = Readonly<{
  key: string
  value: unknown
  displayValue: string
}>

type MetadataGroup = Readonly<{
  id: MetadataGroupId
  entries: MetadataEntry[]
}>

type MapUrls = Readonly<{
  googleMaps: string
  amap: string
}>

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/gif",
  "image/heic",
  "image/heif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
])

const SUPPORTED_IMAGE_EXTENSIONS = /\.(gif|heic|heif|jpe?g|png|tiff?|webp)$/i

const basicFields = [
  "ImageWidth",
  "ImageHeight",
  "ExifImageWidth",
  "ExifImageHeight",
  "Orientation",
  "XResolution",
  "YResolution",
  "ResolutionUnit",
  "Software",
  "ModifyDate",
  "Artist",
  "Copyright",
  "ColorSpace",
  "BitsPerSample",
  "Compression",
  "FileType",
  "MIMEType",
] as const

const cameraFields = [
  "Make",
  "Model",
  "LensModel",
  "LensMake",
  "LensInfo",
  "ExposureTime",
  "FNumber",
  "ISO",
  "ISOSpeedRatings",
  "FocalLength",
  "FocalLengthIn35mmFormat",
  "Flash",
  "WhiteBalance",
  "MeteringMode",
  "ExposureProgram",
  "ExposureCompensation",
  "ExposureBiasValue",
  "DateTimeOriginal",
  "CreateDate",
  "DateTimeDigitized",
  "ShutterSpeedValue",
  "ApertureValue",
  "MaxApertureValue",
  "SceneCaptureType",
  "DigitalZoomRatio",
  "Contrast",
  "Saturation",
  "Sharpness",
] as const

const gpsFields = [
  "latitude",
  "longitude",
  "GPSLatitude",
  "GPSLongitude",
  "GPSLatitudeRef",
  "GPSLongitudeRef",
  "GPSAltitude",
  "GPSAltitudeRef",
  "GPSImgDirection",
  "GPSImgDirectionRef",
  "GPSSpeed",
  "GPSSpeedRef",
  "GPSDateStamp",
  "GPSTimeStamp",
] as const

function isSupportedImageFile(file: Pick<File, "name" | "type">) {
  return (
    SUPPORTED_IMAGE_TYPES.has(file.type) ||
    SUPPORTED_IMAGE_EXTENSIONS.test(file.name)
  )
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ["KB", "MB", "GB"] as const
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value >= 10 ? value.toFixed(1) : value.toFixed(2)} ${
    units[unitIndex]
  }`
}

function isBinaryValue(value: unknown): value is ArrayBuffer | Uint8Array {
  return value instanceof ArrayBuffer || value instanceof Uint8Array
}

function getBinaryLength(value: ArrayBuffer | Uint8Array) {
  return value instanceof Uint8Array ? value.byteLength : value.byteLength
}

function sanitizeMetadataValue(value: unknown): unknown {
  if (value === undefined) {
    return undefined
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (isBinaryValue(value)) {
    return `[Binary data: ${getBinaryLength(value)} bytes]`
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeMetadataValue)
  }

  if (value && typeof value === "object") {
    return sanitizeMetadataRecord(value as MetadataRecord)
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return String(value)
  }

  return value
}

function sanitizeMetadataRecord(data: MetadataRecord): MetadataRecord {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, sanitizeMetadataValue(value)])
  )
}

function formatMetadataValue(value: unknown): string {
  const sanitized = sanitizeMetadataValue(value)

  if (sanitized === null || sanitized === undefined) {
    return "-"
  }

  if (Array.isArray(sanitized)) {
    return sanitized.map(formatMetadataValue).join(", ")
  }

  if (typeof sanitized === "object") {
    return JSON.stringify(sanitized)
  }

  if (typeof sanitized === "number") {
    return Number.isInteger(sanitized)
      ? String(sanitized)
      : sanitized.toFixed(4).replace(/\.?0+$/, "")
  }

  return String(sanitized)
}

function normalizeMetadata(data: MetadataRecord | null | undefined) {
  if (!data) {
    return {}
  }

  return sanitizeMetadataRecord(data)
}

function pickEntries(data: MetadataRecord, fields: readonly string[]) {
  return fields
    .filter((field) => data[field] !== undefined)
    .map((field) => ({
      key: field,
      value: data[field],
      displayValue: formatMetadataValue(data[field]),
    }))
}

function groupMetadata(data: MetadataRecord): MetadataGroup[] {
  const usedFields = new Set<string>([
    ...basicFields,
    ...cameraFields,
    ...gpsFields,
  ])
  const advancedEntries = Object.entries(data)
    .filter(([key, value]) => !usedFields.has(key) && value !== undefined)
    .map(([key, value]) => ({
      key,
      value,
      displayValue: formatMetadataValue(value),
    }))

  return [
    { id: "basic", entries: pickEntries(data, basicFields) },
    { id: "camera", entries: pickEntries(data, cameraFields) },
    { id: "gps", entries: pickEntries(data, gpsFields) },
    { id: "advanced", entries: advancedEntries },
  ]
}

function getMetadataFieldCount(groups: readonly MetadataGroup[]) {
  return groups.reduce((count, group) => count + group.entries.length, 0)
}

function getVisibleMetadataGroups(groups: readonly MetadataGroup[]) {
  return groups.filter((group) => group.entries.length > 0)
}

function getGpsCoordinates(data: MetadataRecord) {
  const latitude = data.latitude
  const longitude = data.longitude

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return { latitude, longitude }
}

function createMapUrls(latitude: number, longitude: number): MapUrls {
  const coords = `${latitude},${longitude}`

  return {
    googleMaps: `https://www.google.com/maps?q=${coords}`,
    amap: `https://uri.amap.com/marker?position=${longitude},${latitude}`,
  }
}

function metadataToJson(data: MetadataRecord) {
  return JSON.stringify(sanitizeMetadataRecord(data), null, 2)
}

export {
  createMapUrls,
  formatBytes,
  formatMetadataValue,
  getGpsCoordinates,
  getMetadataFieldCount,
  getVisibleMetadataGroups,
  groupMetadata,
  isSupportedImageFile,
  metadataToJson,
  normalizeMetadata,
}
export type { MetadataGroup, MetadataGroupId, MetadataRecord }
