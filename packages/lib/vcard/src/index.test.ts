import { expect, test } from "vitest"
import { writeVcards } from "./index"

test("writes structured names and escapes editable contact details", () => {
  const result = writeVcards([
    {
      fullName: "Taylor Morgan",
      firstName: "Taylor",
      lastName: "Morgan",
      phone: "+1 202 555 0100",
      email: "taylor@example.com",
      company: "Examples, Inc.",
      jobTitle: "Lead; events",
      website: "example.com",
      address: "12 Example St; Level 2",
      notes: "One\rTwo\r\nThree\nFour\\Five",
    },
    { lastName: "Pérez", website: "http://example.com" },
  ])

  expect(result).toBe(
    [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Morgan;Taylor;;;",
      "FN:Taylor Morgan",
      "TEL:+1 202 555 0100",
      "EMAIL:taylor@example.com",
      "ORG:Examples\\, Inc.",
      "TITLE:Lead\\; events",
      "URL:https://example.com",
      "ADR:;;12 Example St\\; Level 2;;;;",
      "NOTE:One\\nTwo\\nThree\\nFour\\\\Five",
      "END:VCARD",
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Pérez;;;;",
      "FN:Pérez",
      "URL:http://example.com",
      "END:VCARD",
      "",
    ].join("\r\n")
  )
})

test("folds by UTF-8 byte length without splitting emoji or Han characters", () => {
  const name = "李😀".repeat(20)
  const result = writeVcards([{ firstName: name }])
  const lines = result.split("\r\n")

  expect(lines.some((line) => line.startsWith(" "))).toBe(true)
  for (const line of lines) {
    expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    expect(line).not.toMatch(/[\uD800-\uDBFF]$/u)
    expect(line).not.toMatch(/^ ?[\uDC00-\uDFFF]/u)
  }
  expect(result.replace(/\r\n /g, "")).toContain(`\r\nFN:${name}\r\n`)
})
