// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest"
import { openEmail } from "@workspace/email"
import type { Email } from "@workspace/email"
import { exportWebDocument } from "@workspace/web-document/export"
import { convert } from "./convert"
import { failure } from "./errors"
import m from "../messages/en.json"

vi.mock("@workspace/email", () => ({ openEmail: vi.fn() }))
vi.mock("@workspace/web-document/export", () => ({
  exportWebDocument: vi.fn(),
}))
const email: Email = {
  format: "EML",
  subject: "Message 世界",
  from: "Mina <mina@example.test>",
  to: "Team",
  cc: "",
  bcc: "",
  date: "Saved -0700",
  html: '<p id="note">HTML alternative</p><a href="#note">Back</a><a href="https://example.test">Reference</a>',
  text: "Plain alternative\n> Reply <literal>\n\n\nFinal line\n",
  attachments: [
    {
      name: "data.bin",
      type: "application/octet-stream",
      size: 8,
      kind: "attachment",
    },
  ],
  notices: [],
}
const file = new File(["mail"], "message.eml")
const html = {
  preview: { html: "safe", title: "Message" },
  file: new Blob(["html"]),
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(openEmail).mockResolvedValue(email)
  vi.mocked(exportWebDocument).mockResolvedValue(html as never)
})
test("exports validated HTML and the exact saved plain alternative with readable headers", async () => {
  const signal = new AbortController().signal
  const result = await convert(file, signal, m)
  expect(result.file).toBe(html.file)
  expect(result.text).toContain("From: Mina <mina@example.test>")
  expect(result.text).toContain("Saved -0700")
  expect(result.text).toContain("data.bin")
  expect(result.text).toContain(m.attachmentNotice)
  expect(result.text.endsWith(email.text)).toBe(true)
  expect(result.text).not.toContain("HTML alternative")
  expect(result.textFile.type).toBe("text/plain;charset=utf-8")
  const source = vi.mocked(exportWebDocument).mock.calls[0]![0]
  expect(source).toContain('href="#note"')
  expect(source).toContain('id="note"')
  expect(source).toContain('rel="noopener noreferrer"')
  expect(exportWebDocument).toHaveBeenCalledWith(source, signal, m.documentBody)
})
test("extracts readable HTML text and safe destinations when there is no text alternative", async () => {
  vi.mocked(openEmail).mockResolvedValueOnce({ ...email, text: "" })
  const result = await convert(file, new AbortController().signal, m)
  expect(result.text).toContain("HTML alternative")
  expect(result.text).toContain("Reference (https://example.test)")
  expect(result.text).not.toContain("<p")
  expect(result.text.endsWith("\n")).toBe(true)
})
test("suppresses stale output at each async boundary and propagates image-validation failures", async () => {
  const first = new AbortController()
  vi.mocked(openEmail).mockImplementationOnce(async () => {
    first.abort()
    return email
  })
  await expect(convert(file, first.signal, m)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(exportWebDocument).not.toHaveBeenCalled()
  const second = new AbortController()
  vi.mocked(exportWebDocument).mockImplementationOnce(async () => {
    second.abort()
    return html as never
  })
  await expect(convert(file, second.signal, m)).rejects.toMatchObject({
    name: "AbortError",
  })
  vi.mocked(exportWebDocument).mockRejectedValueOnce(new Error("unsupported"))
  await expect(convert(file, new AbortController().signal, m)).rejects.toThrow(
    "unsupported"
  )
})
test.each([
  "invalid",
  "unsupported",
  "protected",
  "incomplete",
  "rtfOnly",
  "resource",
  "engineUnavailable",
])("preserves structured %s feedback", (code) =>
  expect(failure(new Error(code.toUpperCase()))).toBe(code)
)
test("maps resource exhaustion without exposing unknown parser details", () => {
  expect(failure("resourceLimit")).toBe("resource")
  expect(failure(new RangeError("Maximum call stack size exceeded"))).toBe(
    "resource"
  )
  expect(failure("private details")).toBe("invalid")
})
