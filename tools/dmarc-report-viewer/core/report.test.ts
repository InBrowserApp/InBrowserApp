// @vitest-environment jsdom

import { describe, expect, test } from "vitest"
import { example } from "../example"
import { readReport } from "./report"

function report(rows = "", metadata = "") {
  return `<feedback><report_metadata>${metadata}</report_metadata><policy_published><domain>example.org</domain></policy_published>${rows}</feedback>`
}

function record(ip: string, count: string, evaluation = "") {
  return `<record><row><source_ip>${ip}</source_ip><count>${count}</count><policy_evaluated>${evaluation}</policy_evaluated></row></record>`
}

describe("readReport", () => {
  test("reads the modern default namespace and keeps alignment and raw authentication separate", () => {
    const result = readReport(example)
    expect(result).toMatchObject({
      status: "ready",
      report: {
        domain: "example.com",
        reporter: "Example Mail",
        id: "example-2026-11-23",
        period: { begin: 1795392000000, end: 1795478399000 },
        policy: [
          { name: "p", value: "quarantine" },
          { name: "sp", value: "reject" },
          { name: "adkim", value: "r" },
          { name: "aspf", value: "r" },
        ],
        totals: { total: 180n, passed: 164n, failed: 16n, unknown: 0n },
      },
    })
    if (result.status !== "ready") throw new Error("Expected a report")
    expect(result.report.records[2]).toMatchObject({
      ip: "192.0.2.55",
      count: 12n,
      dkim: "fail",
      spf: "fail",
      disposition: "quarantine",
      auth: [
        {
          kind: "dkim",
          domain: "example.net",
          result: "pass",
          selector: "provider",
        },
      ],
    })
    expect(result.report.records[3]?.reasons).toEqual(["mailing_list"])
  })

  test("accepts a prefixed namespace while ignoring foreign extension fields", () => {
    const source = `
    <m:feedback xmlns:m="urn:ietf:params:xml:ns:dmarc-2.0" xmlns:x="urn:example">
      <x:record />
      <x:report_metadata><x:org_name>Wrong reporter</x:org_name></x:report_metadata>
      <m:report_metadata><m:org_name>Correct reporter</m:org_name></m:report_metadata>
      <m:policy_published><m:domain>example.org</m:domain><m:testing>y</m:testing></m:policy_published>
      <m:record><m:row><m:source_ip>192.0.2.11</m:source_ip><m:count>+3</m:count>
        <m:policy_evaluated><m:spf>pass</m:spf></m:policy_evaluated>
      </m:row><m:auth_results><m:extension /></m:auth_results></m:record>
    </m:feedback>`
    expect(readReport(source)).toMatchObject({
      status: "ready",
      report: {
        reporter: "Correct reporter",
        policy: [{ name: "testing", value: "y" }],
        records: [{ ip: "192.0.2.11", count: 3n, auth: [] }],
        totals: { total: 3n, passed: 3n, failed: 0n, unknown: 0n },
      },
    })
  })

  test("preserves precise legacy message counts, unknown results, and stable sorting", () => {
    const rows =
      record("192.0.2.3", "7", "<dkim>fail</dkim><spf>other</spf>") +
      record("192.0.2.4", "1", "<dkim>PASS</dkim>") +
      record(
        "192.0.2.1",
        "9007199254740994",
        "<dkim>fail</dkim><spf>fail</spf>"
      ) +
      record(
        "192.0.2.2",
        "7",
        "<dkim>pass</dkim><reason><type>local_policy</type><comment>Forwarded</comment></reason><reason />"
      )
    const result = readReport(report(rows))
    expect(result).toMatchObject({
      status: "ready",
      report: {
        period: null,
        totals: {
          total: 9007199254741009n,
          passed: 8n,
          failed: 9007199254740994n,
          unknown: 7n,
        },
        records: [
          { ip: "192.0.2.1" },
          { ip: "192.0.2.3", spf: "unknown" },
          { ip: "192.0.2.2", reasons: ["local_policy · Forwarded"] },
          { ip: "192.0.2.4" },
        ],
      },
    })
  })

  test.each(["<feedback>", "", "<feedback><x></feedback>"])(
    "separates malformed XML from unrelated XML",
    (source) => {
      expect(readReport(source)).toEqual({
        status: "error",
        error: "invalidXml",
      })
    }
  )

  test.each([
    "<report><report_metadata/><policy_published><domain>example.org</domain></policy_published></report>",
    "<feedback><policy_published><domain>example.org</domain></policy_published></feedback>",
    "<feedback><report_metadata/><policy_published/></feedback>",
  ])("rejects a document without a report envelope", (source) => {
    expect(readReport(source)).toEqual({
      status: "error",
      error: "invalidReport",
    })
  })

  test.each([
    record("", "1"),
    record("192.0.2.5", "-1"),
    record("192.0.2.5", "1.5"),
  ])(
    "rejects reports with rows that would produce misleading totals",
    (row) => {
      expect(readReport(report(row))).toEqual({
        status: "error",
        error: "invalidRecord",
      })
    }
  )

  test.each([
    "<date_range><begin>8640000000001</begin><end>2</end></date_range>",
    "<date_range><begin>2</begin><end>x</end></date_range>",
    "<date_range><begin>3</begin><end>2</end></date_range>",
  ])("keeps unavailable report dates separate from counts", (metadata) => {
    expect(readReport(report("", metadata))).toMatchObject({
      status: "ready",
      report: { period: null, totals: { total: 0n }, records: [] },
    })
  })
})
