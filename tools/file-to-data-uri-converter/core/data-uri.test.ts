import { afterEach, describe, expect, test, vi } from "vitest"

import {
  analyzeFileToDataUri,
  formatBytes,
  parseDataUri,
  readFileAsDataUri,
} from "./data-uri"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("parseDataUri", () => {
  test("extracts the mime type and payload from a base64 data uri", () => {
    expect(parseDataUri("data:text/plain;base64,SGVsbG8=")).toEqual({
      mimeType: "text/plain",
      isBase64: true,
      payload: "SGVsbG8=",
    })
  })

  test("supports data uris without a mime type", () => {
    expect(parseDataUri("data:;base64,QUJD")).toEqual({
      mimeType: null,
      isBase64: true,
      payload: "QUJD",
    })
  })

  test("returns an empty result for invalid inputs", () => {
    expect(parseDataUri("not-a-data-uri")).toEqual({
      mimeType: null,
      isBase64: false,
      payload: "",
    })
    expect(parseDataUri("data:text/plain;base64")).toEqual({
      mimeType: null,
      isBase64: false,
      payload: "",
    })
  })
})

describe("analyzeFileToDataUri", () => {
  test("prefers the file mime type and tracks payload length", () => {
    expect(
      analyzeFileToDataUri(
        {
          name: "hello.txt",
          size: 5,
          type: "text/plain",
        },
        "data:text/plain;base64,SGVsbG8="
      )
    ).toEqual({
      fileName: "hello.txt",
      fileSize: 5,
      mimeType: "text/plain",
      dataUri: "data:text/plain;base64,SGVsbG8=",
      isBase64: true,
      payloadLength: 8,
    })
  })

  test("falls back to the parsed mime type when the file type is empty", () => {
    expect(
      analyzeFileToDataUri(
        {
          name: "logo",
          size: 12,
          type: "",
        },
        "data:image/svg+xml,%3Csvg%3E"
      ).mimeType
    ).toBe("image/svg+xml")
  })
})

describe("formatBytes", () => {
  test("formats byte values with the expected units", () => {
    expect(formatBytes(999)).toBe("999 B")
    expect(formatBytes(2048)).toBe("2.0 KB")
    expect(formatBytes(3 * 1024 * 1024)).toBe("3.0 MB")
  })
})

describe("readFileAsDataUri", () => {
  test("resolves with the FileReader result", async () => {
    class SuccessfulFileReader {
      result = "data:text/plain;base64,SGVsbG8="
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      readAsDataURL() {
        this.onload?.()
      }
    }

    vi.stubGlobal("FileReader", SuccessfulFileReader)

    await expect(readFileAsDataUri(new Blob(["hello"]))).resolves.toBe(
      "data:text/plain;base64,SGVsbG8="
    )
  })

  test("returns an empty string when FileReader finishes without a value", async () => {
    class EmptyFileReader {
      result = null
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      readAsDataURL() {
        this.onload?.()
      }
    }

    vi.stubGlobal("FileReader", EmptyFileReader)

    await expect(readFileAsDataUri(new Blob(["hello"]))).resolves.toBe("")
  })

  test("rejects when FileReader reports an error", async () => {
    class FailingFileReader {
      result = null
      onload: null | (() => void) = null
      onerror: null | (() => void) = null

      readAsDataURL() {
        this.onerror?.()
      }
    }

    vi.stubGlobal("FileReader", FailingFileReader)

    await expect(readFileAsDataUri(new Blob(["hello"]))).rejects.toThrow(
      "read-failed"
    )
  })
})
