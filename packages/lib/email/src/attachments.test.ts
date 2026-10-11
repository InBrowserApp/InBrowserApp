import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { parseEmail } from "./parse"
const expected = JSON.parse(
  readFileSync(
    "tools/email-attachment-extractor/fixtures/expected.json",
    "utf8"
  )
) as { kind: string; size: number; sha256: string }[]
const root = "tools/email-attachment-extractor/fixtures/"
test.each(["collection.eml", "collection.emlx"])(
  "decodes every %s payload to its original bytes including nested RFC 822",
  async (name) => {
    const bytes = new Uint8Array(readFileSync(root + name))
    const email = await parseEmail(bytes.buffer, name, {
      attachmentBytes: "all",
    })
    expect(email.attachments).toHaveLength(expected.length)
    for (const [index, attachment] of email.attachments.entries()) {
      const oracle = expected[index]!
      expect(attachment.kind).toBe(oracle.kind)
      expect(attachment.bytes?.length).toBe(oracle.size)
      expect(createHash("sha256").update(attachment.bytes!).digest("hex")).toBe(
        oracle.sha256
      )
    }
  }
)
test("retains ordinary Outlook attachment bytes only when explicitly requested", async () => {
  const bytes = new Uint8Array(
    readFileSync("tools/email-viewer/fixtures/outlook-html.msg")
  )
  const normal = await parseEmail(bytes.buffer, "mail.msg")
  expect(normal.attachments[1]!.bytes).toBeUndefined()
  const all = await parseEmail(bytes.buffer, "mail.msg", {
    attachmentBytes: "all",
  })
  expect(new TextDecoder().decode(all.attachments[1]!.bytes)).toBe(
    "Local attachment."
  )
})

test("does not pass a broken MSG mini-stream off as a valid empty attachment", async () => {
  const bytes = readFileSync("tools/email-viewer/fixtures/outlook-html.msg")
  const name = Buffer.from("__substg1.0_37010102", "utf16le")
  const first = bytes.indexOf(name)
  const second = bytes.indexOf(name, first + name.length)
  expect(second).toBeGreaterThan(first)
  // Keep the declared 17-byte stream length, but remove its mini-sector chain.
  bytes.writeUInt32LE(0xfffffffe, second + 116)
  const email = await parseEmail(new Uint8Array(bytes).buffer, "broken.msg", {
    attachmentBytes: "all",
  })
  expect(email.notices).toContain("attachmentError")
})
