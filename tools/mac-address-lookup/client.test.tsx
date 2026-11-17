import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { lookupMac, type Assignment } from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"
import Client from "./client"
import { LookupResult } from "./lookup-result"
import messages from "./messages/en.json"

vi.mock("@workspace/mac-address/load", () => ({ loadDatabase: vi.fn() }))

const records: Assignment[] = [
  {
    registry: "MA-L",
    assignment: "001B63",
    organization: "Apple, Inc.",
    address: "Cupertino US",
  },
  {
    registry: "MA-L",
    assignment: "8C1F64",
    organization: "IEEE Registration Authority",
    address: "US",
  },
  {
    registry: "MA-S",
    assignment: "8C1F64001",
    organization: "Small vendor",
    address: "Paris FR",
  },
  {
    registry: "MA-M",
    assignment: "001B631",
    organization: "Medium vendor",
    address: "Berlin DE",
  },
  {
    registry: "MA-L",
    assignment: "080030",
    organization: "CERN",
    address: "Geneva CH",
  },
  {
    registry: "MA-L",
    assignment: "080030",
    organization: "Research",
    address: "US",
  },
]

beforeEach(() => {
  vi.mocked(loadDatabase).mockResolvedValue({
    records,
    updatedAt: "2026-11-17T00:00:00Z",
  })
  window.history.replaceState(null, "", "/tools/mac-address-lookup/")
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

describe("MAC lookup", () => {
  test("starts empty and shows registry provenance", async () => {
    render(<Client language="en" messages={messages} />)
    expect(screen.getByText(messages.emptyLookupHint)).toBeTruthy()
    expect(
      await screen.findByRole("link", { name: messages.source })
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.source }).getAttribute("href")
    ).toContain("standards.ieee.org")
  })

  test("restores a shared URL and shows the longest allocation", async () => {
    window.history.replaceState(
      { keep: true },
      "",
      "/tools/mac-address-lookup/?q=001b63123456#details"
    )
    render(<Client language="zh-CN" messages={messages} />)
    expect(
      await screen.findByRole("link", { name: "Medium vendor" })
    ).toBeTruthy()
    expect(screen.queryByRole("link", { name: "Apple, Inc." })).toBeNull()
    expect(
      screen.getByRole("textbox", { name: messages.queryLabel })
    ).toHaveProperty("value", "001b63123456")
    expect(window.location.search).toBe("?q=001b63123456")
    expect(window.history.state).toEqual({ keep: true })
    expect(
      screen.getByRole("link", { name: "Medium vendor" }).getAttribute("href")
    ).toBe("/zh-CN/tools/mac-address-vendor-lookup/?org=Medium+vendor")
    expect(screen.getByText("1,048,576")).toBeTruthy()
  })

  test("examples update the shareable URL, and copying includes the query", async () => {
    const writeText = vi.fn<() => Promise<void>>().mockResolvedValue()
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })
    render(<Client language="en" messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: "00:1B:63:84:45:E6" }))
    expect(
      await screen.findByRole("link", { name: "Apple, Inc." })
    ).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.share }))
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith(window.location.href)
    )
    expect(new URLSearchParams(window.location.search).get("q")).toBe(
      "00:1B:63:84:45:E6"
    )
  })

  test("validates on blur, supports edits and clearing", async () => {
    render(<Client language="en" messages={messages} />)
    const input = screen.getByRole("textbox", { name: messages.queryLabel })
    fireEvent.change(input, { target: { value: "001B638445" } })
    expect(screen.queryByText(messages.invalidAddress)).toBeNull()
    fireEvent.blur(input)
    expect(screen.getAllByText(messages.invalidAddress)).toHaveLength(1)
    expect(input.getAttribute("aria-invalid")).toBe("true")
    fireEvent.change(input, { target: { value: "001B63" } })
    expect(input.getAttribute("aria-invalid")).toBe("false")
    expect(
      await screen.findByRole("link", { name: "Apple, Inc." })
    ).toBeTruthy()
    fireEvent.change(input, { target: { value: "" } })
    expect(await screen.findByText(messages.emptyLookupHint)).toBeTruthy()
    expect(window.location.search).toBe("")
  })

  test("reports a failed snapshot and retries", async () => {
    vi.mocked(loadDatabase).mockRejectedValueOnce(new Error("offline"))
    render(<Client language="en" messages={messages} />)
    expect(await screen.findByText(messages.loadError)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    expect(
      await screen.findByRole("link", { name: messages.source })
    ).toBeTruthy()
    expect(loadDatabase).toHaveBeenCalledTimes(2)
  })
})

describe("address results", () => {
  test.each([
    ["02:00:00:12:34:56", "local"],
    ["01:00:5E:00:00:01", "multicast"],
    ["FF:FF:FF:FF:FF:FF", "broadcast"],
    ["00:00:00:00:00:00", "zero"],
  ] as const)("classifies %s without asserting a vendor", (address, kind) => {
    render(
      <LookupResult
        result={lookupMac(records, address)}
        ready
        language="en"
        messages={messages}
      />
    )
    expect(screen.getByText(messages.types[kind])).toBeTruthy()
    expect(screen.getByText(messages.typeHints[kind])).toBeTruthy()
    expect(screen.queryByText(messages.noAssignment)).toBeNull()
  })

  test("does not show no-match while data is loading", () => {
    render(
      <LookupResult
        result={lookupMac([], "001B638445E6")}
        ready={false}
        language="en"
        messages={messages}
      />
    )
    expect(screen.queryByText(messages.noAssignment)).toBeNull()
  })

  test.each(["001122", "001122334455"])(
    "offers block browsing for an unknown %s",
    (address) => {
      render(
        <LookupResult
          result={lookupMac(records, address)}
          ready
          language="en"
          messages={messages}
        />
      )
      expect(screen.getByText(messages.noAssignment)).toBeTruthy()
      expect(
        screen.getByRole("link", { name: messages.blocks }).getAttribute("href")
      ).toContain(`q=${address}`)
    }
  )

  test("shows every organization sharing the same longest prefix", () => {
    render(
      <LookupResult
        result={lookupMac(records, "080030112233")}
        ready
        language="en"
        messages={messages}
      />
    )
    expect(screen.getByRole("link", { name: "CERN" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Research" })).toBeTruthy()
    expect(screen.getByText("08:00:30:00:00:00")).toBeTruthy()
    expect(screen.getByText("08:00:30:FF:FF:FF")).toBeTruthy()
  })
})
