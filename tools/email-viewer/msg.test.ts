import { beforeEach, expect, test, vi } from "vitest"
import type { FieldsData } from "@kenjiuno/msgreader"
import { parseMsg } from "./msg"
const mock = vi.hoisted(() => ({
  data: [] as FieldsData[],
  readers: [] as {
    parserConfig?: { ansiEncoding: string }
    getAttachment: ReturnType<typeof vi.fn>
  }[],
}))
vi.mock("@kenjiuno/msgreader", () => ({
  default: class {
    parserConfig?: { ansiEncoding: string }
    getAttachment = vi.fn(() => ({
      content: new Uint8Array([1, 2]),
      fileName: "image.png",
    }))
    constructor() {
      mock.readers.push(this)
    }
    getFileData() {
      return mock.data.shift()!
    }
  },
}))
beforeEach(() => {
  mock.data = []
  mock.readers = []
})
const open = (data: Partial<FieldsData> = {}) => {
  mock.data.push({ dataType: "msg", subject: "Subject", ...data })
  return parseMsg(new ArrayBuffer(8))
}

test("retains signed-only MSG bodies without conflating them with encryption", async () => {
  const result = await open({
    messageClass: "IPM.Note.SMIME.MultipartSigned",
    body: "Signed readable body",
  })
  expect(result.text).toBe("Signed readable body")
  expect(result.notices).toContain("signed")
})

test("rejects decoder errors and non-MSG compound objects", async () => {
  await expect(open({ error: "invalid" })).rejects.toThrow("invalid")
  await expect(open({ dataType: "attachment" })).rejects.toThrow("invalid")
  await expect(open({ subject: undefined })).rejects.toThrow("invalid")
})

test("uses the ANSI reparsed reader for attachment bytes and recipient properties", async () => {
  mock.data.push({ dataType: "msg", messageCodepage: 1251 })
  mock.data.push({
    dataType: "msg",
    subject: "Привет",
    bodyHtml: '<img src="cid:photo">',
    recipients: [
      {
        dataType: "recipient",
        recipType: "to",
        name: "Mina",
        smtpAddress: "mina@example.test",
      },
      { dataType: "recipient", recipType: "cc", email: "copy@example.test" },
      { dataType: "recipient", recipType: "bcc", name: "Hidden name" },
      { dataType: "recipient", recipType: "bcc" },
    ],
    attachments: [
      {
        dataType: "attachment",
        fileNameShort: "photo.png",
        attachMimeTag: "image/png",
        pidContentId: "photo",
      },
    ],
  })
  const result = await parseMsg(new ArrayBuffer(8))
  expect(mock.readers[0]!.parserConfig?.ansiEncoding).toBe("windows-1252")
  expect(mock.readers[1]!.parserConfig?.ansiEncoding).toBe("1251")
  expect(mock.readers[0]!.getAttachment).not.toHaveBeenCalled()
  expect(mock.readers[1]!.getAttachment).toHaveBeenCalledOnce()
  expect(result).toMatchObject({
    subject: "Привет",
    to: "Mina <mina@example.test>",
    cc: "copy@example.test",
    bcc: "Hidden name, ",
  })
})

test("prefers transport dates and flags UTC timestamps only when transport date is absent", async () => {
  const result = await open({
    headers:
      "Date: not a date\r\nFrom: Header <header@example.test>\r\nSubject: From headers",
    subject: "",
    clientSubmitTime: "Wed, 8 Oct 2025 15:00:00 GMT",
  })
  expect(result.date).toBe("not a date")
  expect(result.notices).toEqual(["invalidDate"])
  expect(result.subject).toBe("From headers")
  const utc = await open({
    messageDeliveryTime: "Wed, 8 Oct 2025 15:00:00 GMT",
    senderName: "Name",
    senderSmtpAddress: "sender@example.test",
  })
  expect(utc.date).toContain("GMT")
  expect(utc.notices).toEqual(["utcDate"])
})

test("decodes HTML using declared MIME charset or supported Windows code pages", async () => {
  const bytes = new Uint8Array([60, 112, 62, 67, 97, 102, 233, 60, 47, 112, 62])
  expect((await open({ html: bytes, internetCodepage: 1252 })).html).toContain(
    "Café"
  )
  expect((await open({ html: bytes, messageCodepage: 1252 })).html).toContain(
    "Café"
  )
  const html = new TextEncoder().encode('<meta charset="utf-8"><p>世界</p>')
  expect((await open({ html })).html).toContain("世界")
  expect((await open({ html: new TextEncoder().encode("Body") })).html).toBe(
    "Body"
  )
  const fallback = await open({
    html: new TextEncoder().encode("Readable"),
    internetCodepage: 999999,
  })
  expect(fallback.html).toBe("Readable")
  expect(fallback.notices).toContain("partial")
})

test("keeps nested and ordinary CID-bearing attachments distinct, preserving unknown metadata", async () => {
  const result = await open({
    attachments: [
      { dataType: "attachment", innerMsgContent: true, name: "Nested mail" },
      {
        dataType: "attachment",
        pidContentId: "unused",
        attachMimeTag: "image/png",
        name: "Not in body",
      },
      { dataType: "attachment" },
      { dataType: "attachment", attachMimeTag: "application/pkcs7-signature" },
    ],
  })
  expect(result.attachments.map((item) => item.kind)).toEqual([
    "nested",
    "attachment",
    "attachment",
    "attachment",
  ])
  expect(result.attachments[0]).toMatchObject({
    type: "message/rfc822",
    size: null,
  })
  expect(result.attachments[2]).toMatchObject({
    type: "application/octet-stream",
    name: "",
    size: null,
  })
  expect(result.notices).toContain("signed")
})

test("reports unreadable included images while preserving the rest of the message", async () => {
  const promise = open({
    attachments: [
      {
        dataType: "attachment",
        pidContentId: "broken",
        attachMimeTag: "image/png",
        attachmentHidden: true,
      },
    ],
  })
  mock.readers[0]!.getAttachment.mockImplementation(() => {
    throw new Error("broken")
  })
  expect((await promise).notices).toContain("attachmentError")
})
