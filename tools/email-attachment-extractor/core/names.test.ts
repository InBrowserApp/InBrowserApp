import { expect, test } from "vitest"
import { safeNames } from "./names"

test("makes flat download names without traversal, control characters or reserved devices", () => {
  const names = safeNames([
    "../dir\\bad:name?.bin",
    "CON.txt",
    "Lpt¹",
    "..",
    "",
    "\u202Eevil\u0000.exe",
    "ending. ",
    ".hidden",
    "世界.txt",
  ])
  expect(names).toEqual([
    "_dir_bad_name_.bin",
    "_CON.txt",
    "_Lpt¹",
    "attachment-4",
    "attachment-5",
    "_evil_.exe",
    "ending",
    "hidden",
    "世界.txt",
  ])
})
test("keeps every payload distinct through case, Unicode normalization and suffix collisions", () => {
  expect(
    safeNames([
      "Report.txt",
      "report.txt",
      "REPORT.TXT",
      "report (2).txt",
      "README",
      "readme",
      "é.txt",
      "e\u0301.txt",
    ])
  ).toEqual([
    "Report.txt",
    "report (2).txt",
    "REPORT (3).TXT",
    "report (2) (2).txt",
    "README",
    "readme (2)",
    "é.txt",
    "é (2).txt",
  ])
})
