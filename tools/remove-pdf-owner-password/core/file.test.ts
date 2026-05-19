import { describe, expect, test } from "vitest"

import { createOutputFileName, isPdfFile } from "./file"

describe("PDF file helpers", () => {
  test("recognizes PDFs by MIME type or extension", () => {
    expect(
      isPdfFile(new File(["x"], "report.bin", { type: "application/pdf" }))
    ).toBe(true)
    expect(isPdfFile(new File(["x"], "report.PDF", { type: "" }))).toBe(true)
    expect(
      isPdfFile(new File(["x"], "report.txt", { type: "text/plain" }))
    ).toBe(false)
  })

  test("creates stable output names", () => {
    expect(createOutputFileName("report.pdf")).toBe("report-unlocked.pdf")
    expect(createOutputFileName("REPORT.PDF")).toBe("REPORT-unlocked.pdf")
    expect(createOutputFileName("report")).toBe("report-unlocked.pdf")
    expect(createOutputFileName("")).toBe("unlocked.pdf")
    expect(createOutputFileName("   ")).toBe("unlocked.pdf")
  })
})
