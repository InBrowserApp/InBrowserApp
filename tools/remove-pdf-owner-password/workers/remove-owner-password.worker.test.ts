import { describe, expect, test } from "vitest"

import { QPDF_DECRYPT_FAILED } from "../core/remove-owner-password"
import { toWorkerErrorCode } from "./remove-owner-password.worker"

describe("remove owner password worker helpers", () => {
  test("keeps known qpdf errors stable", () => {
    expect(toWorkerErrorCode(new Error(QPDF_DECRYPT_FAILED))).toBe(
      QPDF_DECRYPT_FAILED
    )
  })

  test("maps unknown failures to a generic code", () => {
    expect(toWorkerErrorCode(new Error("boom"))).toBe("UNKNOWN_ERROR")
    expect(toWorkerErrorCode("boom")).toBe("UNKNOWN_ERROR")
  })
})
