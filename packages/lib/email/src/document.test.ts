// @vitest-environment jsdom
import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { emailDocument } from "./document"
import { parseEmail } from "./parse"
import type { Email } from "./types"
import type { DocumentLabels } from "./document"

const labels: DocumentLabels = JSON.parse(
  readFileSync("tools/email-to-pdf-converter/messages/en.json", "utf8")
)
const email = (changes: Partial<Email> = {}): Email => ({
  format: "EML",
  subject: "Field notes 世界",
  from: "Mina <mina@example.test>",
  to: "Team",
  cc: "Copy",
  bcc: "Hidden",
  date: "Thu, 8 Oct 2026 14:35:00 -0700",
  html: "<p>HTML body</p>",
  text: "Alternative body",
  attachments: [],
  notices: [],
  ...changes,
})
const body = (html: string) =>
  new DOMParser().parseFromString(html, "text/html")

test("retains saved body direction and language in mixed-script messages", () => {
  const result = body(
    emailDocument(
      email({
        html: '<html><body dir="rtl" lang="ar"><p>Brand — رسالة عربية</p></body></html>',
      }),
      labels
    ).html
  )
  expect(result.querySelector("article")!.getAttribute("dir")).toBe("rtl")
  expect(result.querySelector("article")!.getAttribute("lang")).toBe("ar")
})

test.each(["field-notes.eml", "field-notes.emlx", "outlook-html.msg"])(
  "retains saved headers and actual embedded image bytes from %s",
  async (name) => {
    const bytes = readFileSync(`tools/email-viewer/fixtures/${name}`)
    const parsed = await parseEmail(new Uint8Array(bytes).buffer, name)
    const result = body(emailDocument(parsed, labels).html)
    expect(result.querySelector("h1")!.textContent).toBe(parsed.subject)
    expect(result.querySelector("dl")!.textContent).toContain(parsed.from)
    expect(result.querySelector("dl")!.textContent).toContain(parsed.date)
    const image = parsed.attachments.find((item) => item.bytes)!
    const actual = result
      .querySelector("img")!
      .getAttribute("src")!
      .split(",")[1]!
    expect(Buffer.from(actual, "base64")).toEqual(Buffer.from(image.bytes!))
    expect(result.body.textContent).toContain(labels.attachmentNotice)
    expect(result.querySelector("article")!.textContent).not.toContain(
      "Earlier reply 24"
    )
  }
)

test("keeps metadata literal, distinguishes attachment roles and retains saved timezone", () => {
  const source = email({
    subject: "<img src=x onerror=alert(1)>",
    attachments: [
      {
        name: "<script>nested</script>",
        type: "message/rfc822",
        size: null,
        kind: "nested",
      },
      { name: "", type: "text/plain", size: 0, kind: "attachment" },
    ],
  })
  const result = body(emailDocument(source, labels).html)
  expect(result.querySelector("h1")!.textContent).toBe(source.subject)
  expect(result.querySelectorAll("script,img")).toHaveLength(0)
  expect(result.querySelector("dl")!.textContent).toContain("-0700")
  expect(result.querySelector("dl")!.textContent).toContain("Hidden")
  expect(result.querySelectorAll("li")[0]!.textContent).toContain(
    labels.unknownSize
  )
  expect(result.querySelectorAll("li")[0]!.textContent).toContain(labels.nested)
  expect(result.querySelectorAll("li")[1]!.textContent).toContain(
    "0 " + labels.bytes
  )
  expect(result.querySelectorAll("li")[1]!.textContent).toContain(
    labels.attachmentFallback
  )
})

test("removes remote tracking, active content and sender CSS before adding trusted metadata", () => {
  const source = email({
    html: `<style>h1,dl{display:none}body{background:url(https://tracker.test/x)}</style>
    <link href="https://tracker.test/style"><script>alert(1)</script><form><input></form>
    <p style="display:none" class="hidden" hidden>Visible body</p>
    <img src="https://tracker.test/pixel"><img src="//tracker.test/pixel">
    <video poster="https://tracker.test/poster"></video>
    <img src="data:image/png;base64,YQ==" srcset="https://tracker.test/large 2x">
    <a href="https://example.test" onclick="alert(1)">Reference</a>`,
  })
  const result = emailDocument(source, labels),
    doc = body(result.html)
  expect(result.notes).toContain(labels.remoteNotice)
  expect(
    doc.querySelectorAll(
      "style,link,script,form,input,video,[style],[hidden],[class]"
    )
  ).toHaveLength(0)
  expect(doc.querySelector("article")!.textContent).toContain("Visible body")
  expect(doc.querySelectorAll("img")).toHaveLength(1)
  expect(result.html).not.toContain("tracker.test")
  expect(doc.querySelector("h1")!.textContent).toBe(source.subject)
})

test.each(["partial", "attachmentError", "rtfOnly"] as const)(
  "rejects %s instead of making an incomplete PDF",
  (notice) => {
    expect(() => emailDocument(email({ notices: [notice] }), labels)).toThrow(
      notice === "rtfOnly" ? "rtfOnly" : "incomplete"
    )
  }
)
test.each([
  "cid:missing",
  "images/local.png",
  "file:///local.png",
  "data:image/svg+xml,a",
  "",
])("rejects unavailable embedded source %s", (src) => {
  expect(() =>
    emailDocument(email({ html: `<img src="${src}">` }), labels)
  ).toThrow("unsupported")
})
test("rejects ambiguous CID images but decodes escaped IDs without executing them", () => {
  const item = {
    name: "plot",
    type: "image/png",
    kind: "inline" as const,
    size: 1,
    bytes: new Uint8Array([97]),
    cid: "plot one",
  }
  const source = email({
    html: '<img src="cid:plot%20one">',
    attachments: [item],
  })
  expect(emailDocument(source, labels).html).toContain(
    "data:image/png;base64,YQ=="
  )
  source.attachments.push(item)
  expect(() => emailDocument(source, labels)).toThrow("unsupported")
  source.attachments = [{ ...item, cid: "%", type: "image/svg+xml" }]
  source.html = '<img src="cid:%">'
  expect(() => emailDocument(source, labels)).toThrow("unsupported")
})
test("uses literal plain text when HTML is absent and explicitly labels missing body/headers", () => {
  const source = email({
    html: "",
    text: "<script>Literal</script>\n> Reply",
    subject: "",
    from: "",
    date: "",
    cc: "",
    bcc: "",
    notices: ["invalidDate", "signed", "utcDate"],
  })
  const result = emailDocument(source, labels),
    doc = body(result.html)
  expect(doc.querySelector("pre")!.textContent).toBe(source.text)
  expect(doc.querySelector("script")).toBeNull()
  expect(doc.querySelector("h1")!.textContent).toBe(labels.subjectFallback)
  expect(doc.querySelectorAll("dt")).toHaveLength(3)
  expect(result.notes).toEqual(
    expect.arrayContaining([labels.invalidDate, labels.signed, labels.utcDate])
  )
  source.text = ""
  expect(
    body(emailDocument(source, labels).html).querySelector("article")!
      .textContent
  ).toBe(labels.noBody)
})
