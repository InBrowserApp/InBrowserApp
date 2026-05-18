import { describe, expect, test } from "vitest"

import { PAGE_RANGE_ERROR } from "../core/page-range"
import {
  formatBytes,
  formatMessage,
  getRangeErrorMessage,
  isEncryptedPdfError,
  resolvePdfErrorMessage,
} from "./utils"

import type { PdfPageNumberAdderMessages } from "./types"

const messages = {
  encryptedPdfError: "encrypted",
  rangeDescending: "descending",
  rangeDuplicate: "duplicate",
  rangeInvalidToken: "invalid",
  rangeOutOfBounds: "bounds",
} as PdfPageNumberAdderMessages

describe("client utilities", () => {
  test("formats bytes and message templates", () => {
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(2048)).toBe("2.00 KB")
    expect(formatBytes(10 * 1024 * 1024)).toBe("10.0 MB")
    expect(
      formatMessage("{count} pages in {name}", {
        count: 2,
        name: "file.pdf",
      })
    ).toBe("2 pages in file.pdf")
  })

  test("maps range and PDF errors", () => {
    expect(getRangeErrorMessage(PAGE_RANGE_ERROR.OutOfBounds, messages)).toBe(
      "bounds"
    )
    expect(
      getRangeErrorMessage(PAGE_RANGE_ERROR.DescendingRange, messages)
    ).toBe("descending")
    expect(getRangeErrorMessage(PAGE_RANGE_ERROR.DuplicatePage, messages)).toBe(
      "duplicate"
    )
    expect(getRangeErrorMessage(PAGE_RANGE_ERROR.InvalidToken, messages)).toBe(
      "invalid"
    )

    const encryptedError = new Error("secret")
    encryptedError.name = "EncryptedPDFError"

    expect(isEncryptedPdfError(encryptedError)).toBe(true)
    expect(resolvePdfErrorMessage(encryptedError, messages, "fallback")).toBe(
      "encrypted"
    )
    expect(resolvePdfErrorMessage(new Error("bad"), messages, "fallback")).toBe(
      "bad"
    )
    expect(resolvePdfErrorMessage(null, messages, "fallback")).toBe("fallback")
  })
})
