import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

const lookupDnsRecordsMock = vi.fn()

vi.mock("./core/dns-lookup", async () => {
  const actual =
    await vi.importActual<typeof import("./core/dns-lookup")>(
      "./core/dns-lookup"
    )

  return {
    ...actual,
    lookupDnsRecords: (...args: unknown[]) => lookupDnsRecordsMock(...args),
  }
})

import DnsLookupClient from "./client"

const messages = {
  meta: {
    name: "DNS Lookup",
    description:
      "Query DNS records for a domain through DNS over HTTPS resolvers.",
  },
  queryTitle: "Query",
  queryDescription:
    "Enter a domain, choose record types, and run a DNS over HTTPS lookup.",
  domainLabel: "Domain",
  domainPlaceholder: "example.com or https://example.com",
  recordTypesLabel: "Record types",
  recordTypesDescription:
    "Select one or more DNS record types to query in parallel.",
  dohServerLabel: "DNS over HTTPS resolver",
  dnssecLabel: "Request DNSSEC records",
  dnssecDescription:
    "Set the DO flag so supporting resolvers include DNSSEC data.",
  checkingDisabledLabel: "Disable DNSSEC checking",
  checkingDisabledDescription:
    "Set the CD flag when you need the resolver to skip DNSSEC validation.",
  lookupButton: "Lookup",
  lookingUpButton: "Looking up",
  resetButton: "Reset",
  resultsTitle: "Results",
  resultsDescription:
    "Inspect response status, resolver flags, answer rows, and raw JSON.",
  idleTitle: "Run a DNS query",
  idleDescription:
    "Results appear here after you submit a domain and record type selection.",
  emptyAnswersTitle: "No answers returned",
  emptyAnswersDescription:
    "The resolver returned no answer rows for this record type.",
  errorTitle: "Lookup failed",
  answerName: "Name",
  answerType: "Type",
  answerTtl: "TTL",
  answerData: "Data",
  statusLabel: "Status",
  flagsLabel: "DNS flags",
  rawJson: "Raw JSON",
  copyRawJson: "Copy raw JSON",
  copied: "Copied",
  responseComment: "Resolver comment",
  domainRequired: "Enter a domain name.",
  invalidDomain: "Enter a valid domain name.",
  recordTypeRequired: "Select at least one record type.",
  lookupFailed: "The DNS lookup failed.",
  on: "on",
  off: "off",
  flagDescriptions: {
    TC: "Truncated response",
    RD: "Recursion desired",
    RA: "Recursion available",
    AD: "Authenticated data",
    CD: "Checking disabled",
  },
} as const

afterEach(() => {
  cleanup()
  lookupDnsRecordsMock.mockReset()
  window.localStorage.clear()
})

describe("DnsLookupClient", () => {
  test("validates empty domains before querying", async () => {
    render(<DnsLookupClient language="en" messages={messages} />)

    expect(screen.getByText(messages.idleTitle)).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.domainLabel), {
      target: { value: "" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    expect(await screen.findByText(messages.errorTitle)).toBeTruthy()
    expect(screen.getByText(messages.domainRequired)).toBeTruthy()
    expect(lookupDnsRecordsMock).not.toHaveBeenCalled()
  })

  test("runs lookups with selected record types and renders answers", async () => {
    lookupDnsRecordsMock.mockResolvedValue([
      {
        recordType: "A",
        response: {
          Status: 0,
          TC: false,
          RD: true,
          RA: true,
          AD: false,
          CD: false,
          Question: [{ name: "example.net.", type: 1 }],
          Answer: [
            {
              name: "example.net.",
              type: 1,
              TTL: 300,
              data: "93.184.216.34",
            },
          ],
        },
      },
    ])

    render(<DnsLookupClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.domainLabel), {
      target: { value: "https://Example.net/docs" },
    })
    openRecordTypeMenu("Record types: A, AAAA")
    fireEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: /5 CNAME/ })
    )
    closeRecordTypeMenu()
    fireEvent.click(screen.getByLabelText(messages.dnssecLabel))
    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    await waitFor(() => {
      expect(lookupDnsRecordsMock).toHaveBeenCalledWith(
        "https://cloudflare-dns.com/dns-query",
        "example.net",
        ["A", "AAAA", "CNAME"],
        expect.objectContaining({
          checkingDisabled: false,
          dnssec: true,
        })
      )
    })

    await waitFor(() => {
      expect(screen.getAllByText("93.184.216.34").length).toBeGreaterThan(0)
    })
    expect(screen.getByText("example.net")).toBeTruthy()
    expect(screen.getByText("Status: NoError")).toBeTruthy()
    expect(screen.queryByText("No error")).toBeNull()
    expect(screen.getByLabelText("Status: NoError. No error")).toBeTruthy()
    expect(screen.getByLabelText("TC off: Truncated response")).toBeTruthy()
    expect(screen.getByLabelText("RD on: Recursion desired")).toBeTruthy()
    expect(screen.getByLabelText("RA on: Recursion available")).toBeTruthy()
    expect(screen.getByLabelText("AD off: Authenticated data")).toBeTruthy()
    expect(screen.getByLabelText("CD off: Checking disabled")).toBeTruthy()
    expect(screen.getByText("RD on")).toBeTruthy()
  })

  test("renders lookup failures", async () => {
    lookupDnsRecordsMock.mockRejectedValue(new Error("network unavailable"))

    render(<DnsLookupClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.lookupButton }))

    expect(await screen.findByText(messages.errorTitle)).toBeTruthy()
    expect(
      screen.getByText("The DNS lookup failed. network unavailable")
    ).toBeTruthy()
  })

  test("restores local state and resets back to the idle view", async () => {
    window.localStorage.setItem("tools:dns-lookup:domain", "stored.example")
    window.localStorage.setItem(
      "tools:dns-lookup:record-types",
      JSON.stringify(["MX"])
    )
    window.localStorage.setItem("tools:dns-lookup:dnssec", "true")

    render(<DnsLookupClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.domainLabel) as HTMLInputElement).value
      ).toBe("stored.example")
    })

    expect(
      screen.getByRole("button", { name: "Record types: MX" })
    ).toBeTruthy()
    openRecordTypeMenu("Record types: MX")
    expect(
      (
        await screen.findByRole("menuitemcheckbox", { name: /15 MX/ })
      ).getAttribute("data-state")
    ).toBe("checked")
    closeRecordTypeMenu()
    expect(
      screen.getByLabelText(messages.dnssecLabel).getAttribute("data-state")
    ).toBe("checked")

    fireEvent.click(screen.getByRole("button", { name: messages.resetButton }))

    expect(
      (screen.getByLabelText(messages.domainLabel) as HTMLInputElement).value
    ).toBe("example.com")
    expect(screen.getByText(messages.idleTitle)).toBeTruthy()
  })
})

function openRecordTypeMenu(name: string) {
  fireEvent.pointerDown(screen.getByRole("button", { name }), {
    button: 0,
    ctrlKey: false,
  })
}

function closeRecordTypeMenu() {
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" })
}
