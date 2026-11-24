import { describe, expect, it } from "vitest"
import { readVcards } from "@workspace/vcard/read"
import { csvToVcard, vcardToCsv } from "./convert"

describe("vCard ↔ CSV conversion", () => {
  it("imports current Google Contacts headers and combines structured addresses", () => {
    const { output, rows } = csvToVcard(
      [
        "First Name,Last Name,Email 1 - Value,Phone 1 - Value,Address 1 - Street,Address 1 - City,Address 1 - Region,Address 1 - Postal Code,Address 1 - Country",
        "Álvaro,Rivera,alvaro@example.com,+1 415 555 0102,100 Main St,Oakland,CA,94601,US",
      ].join("\r\n")
    )

    expect(rows).toEqual([
      ["Álvaro Rivera", "alvaro@example.com", "+1 415 555 0102", ""],
    ])
    expect(readVcards(output)).toMatchObject([
      {
        firstName: "Álvaro",
        email: "alvaro@example.com",
        address: "100 Main St, Oakland, CA, 94601, US",
      },
    ])
  })

  it("keeps Outlook address groups separate and takes a formatted address when supplied", () => {
    const { output } = csvToVcard(
      [
        "Name,Home Street,Home City,Business City,Address",
        "Taylor,12 North St,,Dallas,",
        'Chen,13 North St,,Dallas,"23 South St, Oakland"',
      ].join("\n")
    )

    expect(readVcards(output).map(({ address }) => address)).toEqual([
      "12 North St",
      "23 South St, Oakland",
    ])
  })

  it("preserves supported Unicode, grouped properties, and folded values on a round trip", () => {
    const input = [
      "BEGIN:VCARD",
      "VERSION:4.0",
      "FN:王小明",
      "N:王;小明;;;",
      "item1.EMAIL;TYPE=work:xiaoming@example.com",
      "EMAIL:ignored@example.com",
      "TEL;VALUE=uri:tel:+886-912-345-678",
      "ORG:Studio;Design",
      "ADR:;;1 Test\\; Rd.;Taipei;;;Taiwan",
      "NOTE:First line\\nSecond",
      "  line",
      "END:VCARD",
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:Alex",
      "END:VCARD",
    ].join("\r\n")

    const csv = vcardToCsv(input)
    expect(csv.rows).toEqual([
      ["王小明", "xiaoming@example.com", "+886-912-345-678", "Studio / Design"],
      ["Alex", "", "", ""],
    ])

    expect(readVcards(csvToVcard(csv.output).output)).toMatchObject([
      {
        fullName: "王小明",
        address: "1 Test; Rd., Taipei, Taiwan",
        notes: "First line\nSecond line",
      },
      { fullName: "Alex" },
    ])
  })

  it("decodes quoted-printable names, soft line breaks, and escaped separators", () => {
    const input = [
      "BEGIN:VCARD",
      "VERSION:2.1",
      "N;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:D=C3=BCrne;J=C3=BCrgen;;;",
      "FN;CHARSET=ISO-8859-1;ENCODING=QUOTED-PRINTABLE:J=FCrgen D=FCrne",
      "ADR;CHARSET=UTF-8;ENCODING=QUOTED-PRINTABLE:;;Main=3B=20St.;Berlin;;;",
      "NOTE;ENCODING=QUOTED-PRINTABLE:First=20word=20=",
      "second=20word",
      "END:VCARD",
    ].join("\r\n")

    expect(readVcards(input)).toMatchObject([
      {
        lastName: "Dürne",
        firstName: "Jürgen",
        fullName: "Jürgen Dürne",
        address: "Main; St., Berlin",
        notes: "First word second word",
      },
    ])
  })

  it.each([
    ["BEGIN:VCARD\nVERSION:3.0\nEND:VCARD", "no contact fields"],
    ["BEGIN:VCARD\nFN:Lost\nBEGIN:VCARD\nFN:Second\nEND:VCARD", "nested vCard"],
    ["BEGIN:VCARD\nFN:Missing ending", "complete vCard"],
    ["END:VCARD", "vCard beginning"],
  ])("rejects invalid card %j", (input, message) => {
    expect(() => vcardToCsv(input)).toThrow(message)
  })

  it("reports the CSV row when a contact has no name", () => {
    expect(() => csvToVcard("Name,Email\n,hello@example.com")).toThrow(
      "Invalid CSV row 2"
    )
  })
})
