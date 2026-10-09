import { readFileSync } from "node:fs"
import { describe, expect, test } from "vitest"
import { parseEmail } from "./parse"
import { address, cleanLabel, contentId, parseMime } from "./mime"
import { failure } from "./failure"

const bytes = (text: string) => new TextEncoder().encode(text)
const buffer = (name: string) => {
  const file = readFileSync(`tools/email-viewer/fixtures/${name}`)
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength)
}

test("reads independently serialized MIME headers, alternatives, CID and nested attachments", async () => {
  const email = await parseEmail(buffer("field-notes.eml"), "field-notes.eml")
  expect(email).toMatchObject({
    format: "EML",
    subject: "Field notes — 世界",
    from: "Mina 陈 <mina@example.test>",
    cc: "José <jose@example.test>",
    date: "Thu, 08 Oct 2026 14:35:00 -0700",
    notices: [],
  })
  expect(email.html).toContain("cid:field-chart")
  expect(email.text).toContain("> Earlier reply 24")
  expect(email.attachments).toEqual([
    expect.objectContaining({
      name: "field-chart.png",
      type: "image/png",
      kind: "inline",
      cid: "field-chart",
      size: 537,
      bytes: expect.any(Uint8Array),
    }),
    expect.objectContaining({
      name: "observations.csv",
      kind: "attachment",
      size: 45,
    }),
    expect.objectContaining({ kind: "nested", type: "message/rfc822" }),
  ])
  expect(email.attachments[1]).not.toHaveProperty("bytes")
})

test("EMLX uses byte length and excludes trailing plist, including UTF-8 bodies", async () => {
  const raw = bytes(
    "From: a@example.test\r\nDate: Thu, 8 Oct 2026 14:35:00 -0700\r\nSubject: 世界\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nこんにちは 🌎"
  )
  const prefix = bytes(`${raw.length}\r\n`),
    tail = bytes('\n<?xml version="1.0"?><plist>PRIVATE METADATA</plist>')
  const file = new Uint8Array(prefix.length + raw.length + tail.length)
  file.set(prefix)
  file.set(raw, prefix.length)
  file.set(tail, prefix.length + raw.length)
  const email = await parseEmail(file.buffer, "unicode.emlx")
  expect(email).toMatchObject({
    format: "EMLX",
    subject: "世界",
    text: "こんにちは 🌎\n",
    notices: [],
  })
  expect(
    (await parseEmail(buffer("field-notes.emlx"), "sample.emlx")).attachments
  ).toHaveLength(3)
})

test("handles encoded names, quoted-printable, non-UTF8 text and malformed dates without guessing", async () => {
  const email = await parseEmail(buffer("latin1.eml"), "latin1.eml")
  expect(email).toMatchObject({
    subject: "Café",
    from: "José <jose@example.test>",
    text: "Café au lait.\n",
    date: "invalid date",
    notices: ["invalidDate"],
  })
})

test("reports truncated MIME and EMLX and Apple detached-part markers", async () => {
  const raw =
    "Subject: partial\r\nContent-Type: multipart/mixed; boundary=parts\r\n\r\n--parts\r\nContent-Type: text/plain\r\nX-Apple-Content-Length: 100\r\n\r\nStill readable"
  const email = await parseMime(
    bytes(`${bytes(raw).length + 100}\n${raw}`),
    "EMLX"
  )
  expect(email.text.trim()).toBe("Still readable")
  expect(email.notices).toEqual(["partial", "invalidDate"])
})

test("header-only messages remain inspectable; grouped international addresses and labels are safe text", async () => {
  const email = await parseMime(
    bytes(
      "Subject: Header only\nTo: Team: a@example.test, b@example.test;\n\n"
    ),
    "EML"
  )
  expect(email.text).toBe("")
  expect(email.to).toContain("Team:")
  expect(address()).toBe("")
  expect(address({ name: "A", address: "" })).toBe("A")
  expect(address({ name: "", address: "a@example.test" })).toBe(
    "a@example.test"
  )
  expect(cleanLabel("a\u202etxt\n")).toBe("a txt")
  expect(contentId(" <part@example.test> ")).toBe("part@example.test")
})

test("identifies signatures without claiming verification", async () => {
  const email = await parseMime(
    bytes(
      'Subject: signed\nContent-Type: multipart/signed; boundary="b"\n\n--b\nContent-Type: text/plain\n\nSigned text\n--b--'
    ),
    "EML"
  )
  expect(email.notices).toContain("signed")
  expect(email.notices).not.toContain("partial")
})

describe("rejects invalid, empty, unsupported and encrypted files accurately", () => {
  test.each([
    ["", "empty.eml", "emptyFile"],
    ["not an email", "bad.eml", "invalid"],
    ["Subject: fake\n\ntext", "fake.msg", "invalid"],
    ["invalid\nSubject: fake\n\ntext", "bad.emlx", "invalid"],
    ["9007199254740992\nSubject: fake\n\ntext", "bad.emlx", "invalid"],
    [
      "Subject: encrypted\nContent-Type: application/pkcs7-mime\n\nAAAA",
      "locked.eml",
      "protected",
    ],
    [
      "Subject: pgp\n\n-----BEGIN PGP MESSAGE-----\nData",
      "locked.eml",
      "protected",
    ],
  ])("%s → %s", async (source, name, reason) => {
    await expect(parseEmail(bytes(source).buffer, name)).rejects.toThrow(reason)
  })
  test.each(["outlook-protected.msg", "outlook-calendar.msg"])(
    "recognizes %s",
    async (name) => {
      await expect(parseEmail(buffer(name), name)).rejects.toThrow(
        name.includes("protected") ? "protected" : "unsupported"
      )
    }
  )
})

test("reads real compound-file MSG properties, separate alternatives and inline attachment bytes", async () => {
  const email = await parseEmail(buffer("outlook-html.msg"), "outlook-html.msg")
  expect(email).toMatchObject({
    format: "MSG",
    from: "Mina Chen <mina@example.test>",
    to: "Readers <readers@example.test>",
    date: "Thu, 8 Oct 2026 14:35:00 -0700",
    notices: [],
  })
  expect(email.html).toContain("Project notes 世界")
  expect(email.text).toContain("Hello 世界")
  expect(email.attachments).toHaveLength(2)
  expect(email.attachments[0]?.bytes?.byteLength).toBe(537)
  expect(email.attachments[1]).toMatchObject({
    type: "text/plain",
    size: 17,
    kind: "attachment",
  })
})

test("explains RTF-only Outlook bodies", async () => {
  const email = await parseEmail(buffer("outlook-rtf-only.msg"), "rtf.msg")
  expect(email.notices).toContain("rtfOnly")
  expect(email.text).toBe("")
  expect(email.html).toBe("")
})

test("classifies actual memory exhaustion without product size caps", () => {
  for (const reason of [
    new RangeError(),
    new Error("out of memory"),
    new Error("allocation failed"),
    new Error("resourceLimit"),
  ])
    expect(failure(reason)).toBe("resourceLimit")
  expect(failure(null)).toBe("invalid")
  expect(failure(new Error("invalid data"))).toBe("invalid")
  expect(failure(new Error("protected"))).toBe("protected")
})

test("handles separately generated ANSI and signed-only MAPI fixtures", async () => {
  const ansi = await parseEmail(buffer("outlook-ansi.msg"), "ansi.msg")
  expect(ansi.subject).toBe("Привет")
  expect(ansi.attachments[0]?.bytes?.length).toBe(537)
  expect(ansi.attachments[0]?.kind).toBe("inline")
  const signed = await parseEmail(buffer("outlook-signed.msg"), "signed.msg")
  expect(signed.notices).toContain("signed")
  expect(signed.html).toContain("Signed readable message")
  const opaque = await parseMime(
    bytes(
      "Subject: Opaque signed\nContent-Type: application/pkcs7-mime; smime-type=signed-data\nContent-Transfer-Encoding: base64\n\nQUJD"
    ),
    "EML"
  )
  expect(opaque.notices).toContain("signed")
  expect(opaque.html).toBe("")
  expect(opaque.attachments).toHaveLength(1)
})

test("does not report truncated compound-file offsets as exhausted browser memory", async () => {
  const truncated = new Uint8Array(32)
  truncated.set([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])
  await expect(
    parseEmail(truncated.buffer, "truncated.msg").catch(failure)
  ).resolves.toBe("invalid")
})
