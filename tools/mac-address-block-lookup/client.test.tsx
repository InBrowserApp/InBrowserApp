import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import type { Database } from "@workspace/mac-address"
import { loadDatabase } from "@workspace/mac-address/load"

import Client from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/mac-address/load", () => ({ loadDatabase: vi.fn() }))

const database: Database = {
  updatedAt: "2026-11-17T00:00:00.000Z",
  records: [
    {
      registry: "MA-L",
      assignment: "00AABB",
      organization: "Example Devices",
      address: "Test City US",
    },
    {
      registry: "MA-M",
      assignment: "1012345",
      organization: "Example Devices",
      address: "Test City US",
    },
    {
      registry: "MA-S",
      assignment: "201234567",
      organization: "Small Devices",
      address: "Taipei TW",
    },
    {
      registry: "IAB",
      assignment: "0050C2ABC",
      organization: "Legacy Devices",
      address: "Oslo NO",
    },
    {
      registry: "CID",
      assignment: "AA1122",
      organization: "Local & Company",
      address: "London GB",
    },
    ...Array.from({ length: 25 }, (_, index) => ({
      registry: "MA-L" as const,
      assignment: `C0${index.toString(16).padStart(4, "0")}`,
      organization: `Other Vendor ${index.toString().padStart(2, "0")}`,
      address: "Other City US",
    })),
  ],
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(loadDatabase).mockResolvedValue(database)
  history.replaceState(null, "", "/tools/mac-address-block-lookup/")
})

afterEach(cleanup)

describe("MAC address block browser", () => {
  test("shows 20 records and links the next page without losing the query", async () => {
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", { name: "Registered blocks: 30" })
    expect(screen.getAllByRole("row")).toHaveLength(21)
    expect(screen.getByRole("status").textContent).toBe("1–20 of 30")
    const next = screen.getByRole("link", { name: messages.next })
    expect(next.getAttribute("href")).toBe(
      "/tools/mac-address-block-lookup/?page=2"
    )
    expect(
      screen
        .getByRole("button", { name: messages.previous })
        .hasAttribute("disabled")
    ).toBe(true)
    expect(screen.getByText("Snapshot: Nov 17, 2026")).toBeTruthy()

    history.pushState(null, "", next.getAttribute("href")!)
    fireEvent.popState(window)
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("21–30 of 30")
    )
    expect(screen.getAllByRole("row")).toHaveLength(11)
    expect(
      screen.getByRole("link", { name: messages.previous }).getAttribute("href")
    ).toBe("/tools/mac-address-block-lookup/")
    expect(
      screen
        .getByRole("button", { name: messages.next })
        .hasAttribute("disabled")
    ).toBe(true)
  })

  test("restores a shareable query and searches registered addresses", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-block-lookup/?q=taipei&registry=MA-S"
    )
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", { name: "Registered blocks: 1" })
    expect(
      screen
        .getByRole("searchbox", { name: messages.blockSearchLabel })
        .getAttribute("value")
    ).toBe("taipei")
    expect(
      screen.getByRole("radio", { name: "MA-S" }).getAttribute("aria-checked")
    ).toBe("true")
    expect(
      screen.getByRole("link", { name: "Small Devices" }).getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?org=Small+Devices")
    expect(
      screen
        .getByRole("link", { name: "20:12:34:56:7/36" })
        .getAttribute("href")
    ).toBe("/tools/mac-address-block-lookup/?q=201234567&registry=MA-S")
  })

  test.each([
    ["00AABB", "MA-L", "16,777,216", "00:AA:BB:00:00:00 – 00:AA:BB:FF:FF:FF"],
    ["1012345", "MA-M", "1,048,576", "10:12:34:50:00:00 – 10:12:34:5F:FF:FF"],
    ["201234567", "MA-S", "4,096", "20:12:34:56:70:00 – 20:12:34:56:7F:FF"],
    ["0050C2ABC", "IAB", "4,096", "00:50:C2:AB:C0:00 – 00:50:C2:AB:CF:FF"],
  ])(
    "shows the complete range and capacity for %s (%s)",
    async (prefix, registry, capacity, range) => {
      history.replaceState(
        null,
        "",
        `/tools/mac-address-block-lookup/?q=${prefix}&registry=${registry}`
      )
      render(<Client language="en" messages={messages} />)

      expect(await screen.findByText(range!)).toBeTruthy()
      expect(screen.getByText(capacity!)).toBeTruthy()
      expect(screen.getByText(messages.capacity)).toBeTruthy()
      expect(screen.queryByText(messages.cidHint)).toBeNull()
    }
  )

  test("lists every organization sharing a prefix without promoting the first match", async () => {
    vi.mocked(loadDatabase).mockResolvedValue({
      ...database,
      records: [
        {
          registry: "MA-L",
          assignment: "080030",
          organization: "Organization A",
          address: "First City",
        },
        {
          registry: "MA-L",
          assignment: "080030",
          organization: "Organization B",
          address: "Second City",
        },
        {
          registry: "MA-L",
          assignment: "080030",
          organization: "Organization C",
          address: "Third City",
        },
      ],
    })
    history.replaceState(null, "", "/tools/mac-address-block-lookup/?q=080030")
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", { name: "Registered blocks: 3" })
    expect(screen.getByRole("link", { name: "Organization A" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Organization B" })).toBeTruthy()
    expect(screen.getByRole("link", { name: "Organization C" })).toBeTruthy()
    expect(
      screen.getByRole("heading", { name: "08:00:30/24 MA-L" })
    ).toBeTruthy()
    expect(screen.queryByRole("link", { name: "08:00:30/24" })).toBeNull()
    expect(
      screen.getAllByRole("columnheader").map((cell) => cell.textContent)
    ).toEqual([messages.organization, messages.address])
    expect(screen.getByText("16,777,216")).toBeTruthy()
  })

  test("explains CID without describing a globally allocated MAC range", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-block-lookup/?q=AA1122&registry=CID"
    )
    render(<Client language="en" messages={messages} />)

    expect(await screen.findByText(messages.cidHint)).toBeTruthy()
    expect(screen.queryByText(messages.capacity)).toBeNull()
    expect(screen.queryByText(messages.range)).toBeNull()
    expect(
      screen
        .getAllByRole("link", { name: "Local & Company" })
        .every(
          (link) =>
            new URL(
              link.getAttribute("href")!,
              window.location.href
            ).searchParams.get("org") === "Local & Company"
        )
    ).toBe(true)
  })

  test("filters by registry, resets the page, and retains the selected filter", async () => {
    history.replaceState(null, "", "/tools/mac-address-block-lookup/?page=2")
    render(<Client language="en" messages={messages} />)
    await screen.findByRole("heading", { name: "Registered blocks: 30" })

    fireEvent.click(screen.getByRole("radio", { name: "MA-M" }))
    await screen.findByRole("heading", { name: "Registered blocks: 1" })
    expect(window.location.search).toBe("?registry=MA-M")
    fireEvent.click(screen.getByRole("radio", { name: "MA-M" }))
    expect(window.location.search).toBe("?registry=MA-M")
    fireEvent.click(screen.getByRole("radio", { name: messages.allRegistries }))
    await screen.findByRole("heading", { name: "Registered blocks: 30" })
    expect(window.location.search).toBe("")
  })

  test("clamps an out-of-range page and clears pagination when searching", async () => {
    history.replaceState(null, "", "/tools/mac-address-block-lookup/?page=999")
    render(<Client language="en" messages={messages} />)
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("21–30 of 30")
    )

    fireEvent.change(
      screen.getByRole("searchbox", { name: messages.blockSearchLabel }),
      { target: { value: "missing vendor" } }
    )
    expect(await screen.findByText(messages.noResults)).toBeTruthy()
    expect(window.location.search).toBe("?q=missing+vendor")
    expect(screen.getByRole("status").textContent).toBe("0–0 of 0")
    expect(screen.queryByRole("table")).toBeNull()
    expect(screen.getByText(messages.noResultsHint)).toBeTruthy()
  })

  test("keeps inputs usable while loading and applies their latest query", async () => {
    let resolve!: (value: Database) => void
    vi.mocked(loadDatabase).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    render(<Client language="en" messages={messages} />)
    expect(screen.getByRole("status").textContent).toBe(messages.loading)

    const input = screen.getByRole("searchbox", {
      name: messages.blockSearchLabel,
    })
    expect(input.hasAttribute("disabled")).toBe(false)
    fireEvent.change(input, { target: { value: "Taipei" } })
    await act(async () => resolve(database))
    expect(
      await screen.findByRole("heading", { name: "Registered blocks: 1" })
    ).toBeTruthy()
    expect(screen.getByRole("link", { name: "Small Devices" })).toBeTruthy()
  })

  test("retries a failed registry download without clearing a shared query", async () => {
    history.replaceState(null, "", "/tools/mac-address-block-lookup/?q=Taipei")
    vi.mocked(loadDatabase).mockRejectedValueOnce(new Error("offline"))
    render(<Client language="en" messages={messages} />)

    expect(await screen.findByRole("alert")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    expect(
      await screen.findByRole("heading", { name: "Registered blocks: 1" })
    ).toBeTruthy()
    expect(loadDatabase).toHaveBeenCalledTimes(2)
    expect(window.location.search).toBe("?q=Taipei")
  })

  test("copies the current URL and localizes organization links", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    history.replaceState(
      null,
      "",
      "/zh-CN/tools/mac-address-block-lookup/?registry=MA-S&page=2"
    )
    render(<Client language="zh-CN" messages={messages} />)
    await screen.findByRole("heading", { name: "Registered blocks: 1" })

    fireEvent.click(screen.getByRole("button", { name: messages.share }))
    await screen.findByText(messages.copied)
    const copied = new URL(writeText.mock.calls[0]![0] as string)
    expect(copied.pathname).toBe("/zh-CN/tools/mac-address-block-lookup/")
    expect(copied.search).toBe("?registry=MA-S&page=2")
    expect(
      screen.getByRole("link", { name: "Small Devices" }).getAttribute("href")
    ).toBe("/zh-CN/tools/mac-address-vendor-lookup/?org=Small+Devices")
  })
})
