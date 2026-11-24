export type Messages = typeof import("./messages/en.json")
export type Labels = Omit<Messages, "article">

type Credentials = {
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string
}

export type Connection = {
  id: string
  name: string
  endpoint: string
  region: string
  pathStyle: boolean
  buckets: string[]
  remember: boolean
  credentials?: Credentials
}

type StoredObject = {
  key: string
  size?: number
  modified?: Date
}

export type Listing = {
  folders: string[]
  objects: StoredObject[]
  next?: string
}

export const storageKey = "inbrowser:s3-connections"

export function readConnections(storage: Storage): Connection[] {
  try {
    const value = JSON.parse(storage.getItem(storageKey) ?? "[]")
    return Array.isArray(value)
      ? value.filter(
          (entry) =>
            entry &&
            typeof entry.id === "string" &&
            Array.isArray(entry.buckets)
        )
      : []
  } catch {
    return []
  }
}

export function saveConnections(storage: Storage, connections: Connection[]) {
  storage.setItem(
    storageKey,
    JSON.stringify(
      connections.map((connection) =>
        connection.remember
          ? connection
          : { ...connection, credentials: undefined }
      )
    )
  )
}

export function validEndpoint(value: string) {
  try {
    const url = new URL(value)
    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    )
  } catch {
    return false
  }
}

export function bucketNames(value: string) {
  return [
    ...new Set(
      value
        .split(/[\n,]/)
        .map((name) => name.trim())
        .filter(Boolean)
    ),
  ]
}

export function folderPrefix(value: string) {
  return value && !value.endsWith("/") ? value + "/" : value
}

export function describeError(error: unknown, labels: Labels) {
  if (error instanceof TypeError) return labels.networkFailed
  if (error instanceof Error && error.cause === "unsupported-key") {
    return labels.unsupportedKey
  }
  return error instanceof Error ? error.message : labels.requestFailed
}

export function corsRule(origin: string) {
  return JSON.stringify(
    [
      {
        AllowedOrigins: [origin],
        AllowedMethods: ["GET", "HEAD", "PUT", "DELETE"],
        AllowedHeaders: ["Authorization", "*"],
        ExposeHeaders: [
          "ETag",
          "Content-Disposition",
          "Content-Encoding",
          "Cache-Control",
          "Content-Language",
          "Expires",
          "x-amz-bucket-region",
          "x-amz-request-id",
          "x-amz-storage-class",
          "x-amz-server-side-encryption",
          "x-amz-server-side-encryption-aws-kms-key-id",
          "x-amz-server-side-encryption-bucket-key-enabled",
        ],
        MaxAgeSeconds: 3600,
      },
    ],
    null,
    2
  )
}
