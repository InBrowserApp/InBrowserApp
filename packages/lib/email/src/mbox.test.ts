import { describe, expect, it } from "vitest"
import { indexMbox, readMboxMessage } from "./mbox"

describe("MBOX indexing and reading", () => {
  it("streams CRLF mailboxes and preserves encoded headers, body text, and attachments", async () => {
    const content = [
      "From - Sat Jan  1 12:30:00 2022",
      "From: =?UTF-8?Q?Ren=C3=A9e?= <sender@example.test>",
      "To: Reader <recipient@example.test>",
      "Subject: Café",
      " and maps",
      "MIME-Version: 1.0",
      'Content-Type: multipart/mixed; boundary="parts"',
      "",
      "--parts",
      "Content-Type: text/plain; charset=utf-8",
      "",
      "From this beach",
      ">From sender@example.test Sat Jan  1 14:30:00 2022",
      ">>From a quoted line",
      "--parts",
      'Content-Type: text/plain; name="map.txt"',
      'Content-Disposition: attachment; filename="map.txt"',
      "Content-Transfer-Encoding: base64",
      "",
      "bm9ydGg=",
      "--parts--",
      "",
      "From reader@example.test Sat Jan  1 14:30:00 +0000 2022",
      "Subject: =?UTF-8?Q?R=C3=A9ponse?=",
      "",
      "Final message",
    ].join("\r\n")
    const bytes = new TextEncoder().encode(content)
    const file = new Blob([bytes])
    file.stream = () =>
      new ReadableStream({
        start(controller) {
          for (let i = 0; i < bytes.length; i += 11)
            controller.enqueue(bytes.subarray(i, i + 11))
          controller.close()
        },
      })
    const entries = await indexMbox(file)
    expect(
      entries.map(({ subject, from, to }) => ({ subject, from, to }))
    ).toEqual([
      {
        subject: "Café and maps",
        from: "Renée <sender@example.test>",
        to: "Reader <recipient@example.test>",
      },
      { subject: "Réponse", from: "", to: "" },
    ])
    const first = await readMboxMessage(file, entries[0]!)
    expect(first.text).toContain("From this beach")
    expect(first.text).toContain(
      "\nFrom sender@example.test Sat Jan  1 14:30:00 2022"
    )
    expect(first.text).toContain("\n>From a quoted line")
    expect(first.attachments[0]).toMatchObject({
      name: "map.txt",
      bytes: new TextEncoder().encode("north"),
    })
    expect((await readMboxMessage(file, entries[1]!)).text.trim()).toBe(
      "Final message"
    )
  })

  it("indexes later messages after reading a long body line", async () => {
    const first = "From - Sat Jan  1 12:30:00 2022\nSubject: First\n\n"
    const second =
      "From - Mon Jan  3 12:30:00 2022\nSubject: Second\n\nSecond body"
    const file = new Blob([first, "é".repeat(150_000), "\n", second])
    const entries = await indexMbox(file)
    expect(entries.map(({ subject }) => subject)).toEqual(["First", "Second"])
    expect((await readMboxMessage(file, entries[1]!)).text.trim()).toBe(
      "Second body"
    )
  })

  it("honors a validated Content-Length and keeps mboxcl2 body lines intact", async () => {
    const body =
      "From - Sat Jan  1 12:30:00 2022\nSubject: embedded sample\n\n>From literal text\n"
    const second =
      "From - Mon Jan  3 12:30:00 2022\nSubject: Second\n\nSecond body"
    const mailbox = (length: number) =>
      new Blob([
        "From - Sat Jan  1 12:30:00 2022\nSubject: First\n",
        `Content-Length: ${length}\n\n`,
        body,
        "\n",
        second,
      ])
    const file = mailbox(body.length)
    const entries = await indexMbox(file)
    expect(entries.map(({ subject }) => subject)).toEqual(["First", "Second"])
    expect((await readMboxMessage(file, entries[0]!)).text).toBe(body)
    expect(
      (await indexMbox(mailbox(body.length - 5))).map(({ subject }) => subject)
    ).toEqual(["First", "embedded sample", "Second"])
  })

  it("indexes legacy Latin-1 headers the same way as the MIME reader", async () => {
    const file = new Blob([
      "From - Sat Jan  1 12:30:00 2022\nFrom: Andr",
      new Uint8Array([233]),
      " <legacy@example.test>\nSubject: Caf",
      new Uint8Array([233]),
      "\n\nLegacy message",
    ])
    const [entry] = await indexMbox(file)
    expect(entry).toMatchObject({
      from: "André <legacy@example.test>",
      subject: "Café",
    })
    expect(await readMboxMessage(file, entry!)).toMatchObject({
      from: entry!.from,
      subject: entry!.subject,
    })
  })

  it("rejects input that does not contain an MBOX message", async () => {
    await expect(
      indexMbox(new Blob(["Subject: Standalone message\n\nHi"]))
    ).rejects.toThrow("invalid")
    await expect(
      indexMbox(
        new Blob(["From - Mon Jan  3 12:30:00 2022\nthis is not a header"])
      )
    ).rejects.toThrow("invalid")
  })
})
