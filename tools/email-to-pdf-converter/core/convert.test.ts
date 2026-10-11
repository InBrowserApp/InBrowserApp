// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest"
import { openEmail } from "@workspace/email"
import type { Email } from "@workspace/email"
import { renderPdf } from "@workspace/html-pdf"
import { convert } from "./convert"
import { failure } from "./errors"
import labels from "../messages/en.json"
vi.mock("@workspace/email", () => ({ openEmail: vi.fn() }))
vi.mock("@workspace/html-pdf", () => ({ renderPdf: vi.fn() }))
const email: Email = {
  format: "EML",
  subject: "Letter",
  from: "Mina",
  to: "Team",
  cc: "",
  bcc: "",
  date: "Saved date",
  html: "<p>Body</p>",
  text: "",
  attachments: [],
  notices: [],
}
const pdf = { pdf: new Blob(["%PDF"]), pages: 1 }
const file = new File(["email"], "letter.eml")
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(openEmail).mockResolvedValue(email)
  vi.mocked(renderPdf).mockResolvedValue(pdf)
})
test("renders safe saved content and returns the same PDF bytes with visible notes", async () => {
  const signal = new AbortController().signal,
    progress = vi.fn()
  const result = await convert(file, signal, progress, labels)
  expect(result.pdf).toBe(pdf.pdf)
  expect(result.notes).toContain(labels.verificationNotice)
  expect(openEmail).toHaveBeenCalledWith(file, signal)
  expect(renderPdf).toHaveBeenCalledWith(
    expect.objectContaining({ html: expect.stringContaining("Letter") }),
    signal,
    progress
  )
})
test("suppresses rendering and stale output when cancellation arrives at either async boundary", async () => {
  const first = new AbortController()
  vi.mocked(openEmail).mockImplementationOnce(async () => {
    first.abort()
    return email
  })
  await expect(
    convert(file, first.signal, vi.fn(), labels)
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(renderPdf).not.toHaveBeenCalled()
  const second = new AbortController()
  vi.mocked(renderPdf).mockImplementationOnce(async () => {
    second.abort()
    return pdf
  })
  await expect(
    convert(file, second.signal, vi.fn(), labels)
  ).rejects.toMatchObject({ name: "AbortError" })
})
test("rejects unreadable bodies before rendering", async () => {
  vi.mocked(openEmail).mockResolvedValueOnce({ ...email, notices: ["rtfOnly"] })
  await expect(
    convert(file, new AbortController().signal, vi.fn(), labels)
  ).rejects.toThrow("rtfOnly")
  expect(renderPdf).not.toHaveBeenCalled()
})
test.each([
  "invalid",
  "unsupported",
  "protected",
  "incomplete",
  "rtfOnly",
  "resource",
  "engineUnavailable",
])("keeps structured %s failures", (code) =>
  expect(failure(new Error(code.toUpperCase())).code).toBe(code)
)
test("maps resource failures without leaking raw parser errors and retains page context", () => {
  expect(failure("resourceLimit").code).toBe("resource")
  expect(failure(new RangeError("allocation failed")).code).toBe("resource")
  expect(failure("private details").code).toBe("invalid")
  expect(
    failure(Object.assign(new Error("image decode"), { page: 3 }))
  ).toEqual({ code: "unsupported", page: 3 })
  expect(
    failure(Object.assign(new Error("bad"), { page: "3" })).page
  ).toBeUndefined()
})
