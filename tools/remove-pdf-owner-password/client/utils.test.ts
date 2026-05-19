import { describe, expect, test } from "vitest"

import { formatBytes, toDisplayErrorMessage } from "./utils"

import type { RemovePdfOwnerPasswordMessages } from "./types"

const messages = {
  genericError: "Generic",
  qpdfFailedError: "QPDF failed",
  workerUnsupportedError: "Worker unsupported",
} as RemovePdfOwnerPasswordMessages

describe("client utils", () => {
  test("formats byte sizes", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(Number.NaN)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(2 * 1024 * 1024)).toBe("2.0 MB")
  })

  test("maps worker errors to localized messages", () => {
    expect(
      toDisplayErrorMessage(new Error("WORKER_UNSUPPORTED"), messages)
    ).toBe("Worker unsupported")
    expect(
      toDisplayErrorMessage(new Error("QPDF_DECRYPT_FAILED"), messages)
    ).toBe("QPDF failed")
    expect(toDisplayErrorMessage(new Error("UNKNOWN_ERROR"), messages)).toBe(
      "QPDF failed"
    )
    expect(toDisplayErrorMessage("x", messages)).toBe("Generic")
    expect(toDisplayErrorMessage(new Error("Custom"), messages)).toBe("Custom")
  })
})
