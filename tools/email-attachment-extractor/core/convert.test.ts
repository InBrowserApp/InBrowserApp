import { beforeEach, expect, test, vi } from "vitest"
import { openEmail } from "@workspace/email"
import type { Email } from "@workspace/email"
import { convert } from "./convert"
import { failure } from "./errors"
vi.mock("@workspace/email", () => ({ openEmail: vi.fn() }))
const email: Email = {
  format: "EML",
  subject: "Subject",
  from: "Sender",
  to: "",
  cc: "",
  bcc: "",
  date: "",
  html: "",
  text: "",
  notices: [],
  attachments: [
    {
      name: "data.bin",
      type: "application/octet-stream",
      kind: "attachment",
      size: 3,
      bytes: new Uint8Array([0, 128, 255]),
    },
  ],
}
const file = new File(["mail"], "mail.eml")
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(openEmail).mockResolvedValue(email)
})
test("requests original bytes and creates inert payload blobs independently of the unreadable body", async () => {
  vi.mocked(openEmail).mockResolvedValueOnce({
    ...email,
    notices: ["rtfOnly", "signed"],
  })
  const signal = new AbortController().signal
  const result = await convert(file, signal)
  expect(openEmail).toHaveBeenCalledWith(file, signal, {
    attachmentBytes: "all",
  })
  expect(result).toMatchObject({ subject: "Subject", from: "Sender" })
  expect(
    new Uint8Array(await result.attachments[0]!.file.arrayBuffer())
  ).toEqual(new Uint8Array([0, 128, 255]))
  expect(result.attachments[0]!.file.type).toBe("application/octet-stream")
})
test("preserves zero-byte attachments and assigns proper standalone names to nested emails", async () => {
  const item = email.attachments[0]!
  vi.mocked(openEmail).mockResolvedValueOnce({
    ...email,
    attachments: [
      { ...item, name: "", size: 0, bytes: new Uint8Array() },
      { ...item, name: "mail", kind: "nested", type: "message/rfc822" },
      { ...item, name: "", kind: "nested", type: "application/vnd.ms-outlook" },
      {
        ...item,
        name: "already.MSG",
        kind: "nested",
        type: "application/vnd.ms-outlook",
      },
    ],
  })
  const result = await convert(file, new AbortController().signal)
  expect(result.attachments.map((a) => a.filename)).toEqual([
    "attachment-1",
    "mail.eml",
    "message.msg",
    "already.MSG",
  ])
  expect(result.attachments[0]!.file.size).toBe(0)
})
test.each(["partial", "attachmentError"] as const)(
  "withdraws all exports for %s messages",
  async (notice) => {
    vi.mocked(openEmail).mockResolvedValueOnce({ ...email, notices: [notice] })
    await expect(convert(file, new AbortController().signal)).rejects.toThrow(
      "incomplete"
    )
  }
)
test("rejects absent bytes and remote attachment descriptors instead of pretending they are empty files", async () => {
  for (const [type, bytes, error] of [
    ["application/octet-stream", undefined, "incomplete"],
    ["message/external-body", new Uint8Array(), "unsupported"],
  ] as const) {
    vi.mocked(openEmail).mockResolvedValueOnce({
      ...email,
      attachments: [{ ...email.attachments[0]!, type, bytes }],
    })
    await expect(convert(file, new AbortController().signal)).rejects.toThrow(
      error
    )
  }
})
test("supports messages without attachments and suppresses results after cancellation", async () => {
  vi.mocked(openEmail).mockResolvedValueOnce({ ...email, attachments: [] })
  expect(
    (await convert(file, new AbortController().signal)).attachments
  ).toEqual([])
  const controller = new AbortController()
  vi.mocked(openEmail).mockImplementationOnce(async () => {
    controller.abort()
    return email
  })
  await expect(convert(file, controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})
test.each([
  "invalid",
  "unsupported",
  "protected",
  "incomplete",
  "resource",
  "engineUnavailable",
])("preserves structured %s feedback", (code) =>
  expect(failure(new Error(code.toUpperCase()))).toBe(code)
)
test("classifies resource failures without exposing parser internals", () => {
  expect(failure("resourceLimit")).toBe("resource")
  expect(failure(new RangeError("Maximum call stack size exceeded"))).toBe(
    "resource"
  )
  expect(failure("private details")).toBe("invalid")
})
