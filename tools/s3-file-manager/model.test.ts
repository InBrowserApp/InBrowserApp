import { beforeEach, describe, expect, it, vi } from "vitest"

import messages from "./messages/en.json"
import {
  bucketNames,
  corsRule,
  describeError,
  folderPrefix,
  readConnections,
  saveConnections,
  storageKey,
  validEndpoint,
} from "./model"

import type { Connection } from "./model"

const example: Connection = {
  id: "first",
  name: "Storage",
  endpoint: "https://s3.example.test",
  region: "us-east-1",
  pathStyle: true,
  buckets: ["archive"],
  remember: true,
  credentials: {
    accessKeyId: "EXAMPLE",
    secretAccessKey: "example-secret",
    sessionToken: "example-token",
  },
}

describe("saved connections", () => {
  beforeEach(() => localStorage.clear())

  it("saves all profiles and only persists credentials when requested", () => {
    const sessionOnly = { ...example, id: "session", remember: false }
    saveConnections(localStorage, [example, sessionOnly])

    expect(readConnections(localStorage)).toEqual([
      example,
      {
        id: "session",
        name: "Storage",
        endpoint: "https://s3.example.test",
        region: "us-east-1",
        pathStyle: true,
        buckets: ["archive"],
        remember: false,
      },
    ])
    expect(sessionOnly.credentials).toEqual(example.credentials)
  })

  it("removes previously persisted credentials when remembering is turned off", () => {
    saveConnections(localStorage, [example])
    saveConnections(localStorage, [{ ...example, remember: false }])

    expect(readConnections(localStorage)[0]).not.toHaveProperty("credentials")
    expect(localStorage.getItem(storageKey)).not.toContain("example-secret")
    expect(localStorage.getItem(storageKey)).not.toContain("example-token")
  })

  it("starts with no profiles when storage is missing, malformed, or unavailable", () => {
    expect(readConnections(localStorage)).toEqual([])
    localStorage.setItem(storageKey, "{")
    expect(readConnections(localStorage)).toEqual([])
    const getItem = vi
      .spyOn(localStorage, "getItem")
      .mockImplementationOnce(() => {
        throw new DOMException("Access denied", "SecurityError")
      })
    expect(readConnections(localStorage)).toEqual([])
    getItem.mockRestore()
  })

  it("ignores unrelated or invalid entries in otherwise valid JSON", () => {
    localStorage.setItem(storageKey, "null")
    expect(readConnections(localStorage)).toEqual([])
    localStorage.setItem(
      storageKey,
      JSON.stringify([null, {}, { id: "broken", buckets: null }, example])
    )
    expect(readConnections(localStorage)).toEqual([example])
  })
})

describe("S3 connection and navigation input", () => {
  it.each([
    "https://s3.example.test",
    "http://localhost:9000",
    "https://storage.example.test/s3",
  ])("accepts endpoint %s", (value) => {
    expect(validEndpoint(value)).toBe(true)
  })

  it.each([
    "s3.example.test",
    "ftp://storage.example.test",
    "https://user@storage.example.test",
    "https://user:password@storage.example.test",
    "https://storage.example.test/?prefix=private",
    "https://storage.example.test/#bucket",
  ])("rejects endpoint %s", (value) => {
    expect(validEndpoint(value)).toBe(false)
  })

  it("keeps bucket order and parses unique pinned names", () => {
    expect(bucketNames(" archive, assets\narchive\n  , photos ")).toEqual([
      "archive",
      "assets",
      "photos",
    ])
    expect(bucketNames(" , \n")).toEqual([])
  })

  it("adds the S3 delimiter without trimming object key prefixes", () => {
    expect(folderPrefix("")).toBe("")
    expect(folderPrefix("nested/folder/")).toBe("nested/folder/")
    expect(folderPrefix(" leading /trailing ")).toBe(" leading /trailing /")
  })
})

it("describes network/CORS errors and retains a storage service error", () => {
  expect(describeError(new TypeError("Failed to fetch"), messages)).toBe(
    messages.networkFailed
  )
  expect(describeError(new Error("Access Denied"), messages)).toBe(
    "Access Denied"
  )
  expect(describeError(undefined, messages)).toBe(messages.requestFailed)
  expect(
    describeError(new Error("a/../b", { cause: "unsupported-key" }), messages)
  ).toBe(messages.unsupportedKey)
})

it("generates a CORS rule for the page origin with the required actions and headers", () => {
  const [rule] = JSON.parse(corsRule("https://preview.example.test"))
  expect(rule.AllowedOrigins).toEqual(["https://preview.example.test"])
  expect(rule.AllowedMethods).toEqual(["GET", "HEAD", "PUT", "DELETE"])
  expect(rule.AllowedHeaders).toEqual(["Authorization", "*"])
  expect(rule.ExposeHeaders).toContain("ETag")
  expect(rule.ExposeHeaders).toContain("Content-Encoding")
})
