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
      address: "",
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
    {
      registry: "MA-L",
      assignment: "334455",
      organization: "Example Devices Limited",
      address: "Berlin DE",
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
  history.replaceState(null, "", "/tools/mac-address-vendor-lookup/")
})

afterEach(cleanup)

function getOrganizationLinks() {
  return screen
    .getAllByRole("link")
    .filter((link) =>
      new URL(
        link.getAttribute("href")!,
        window.location.href
      ).searchParams.has("org")
    )
}

describe("MAC address organization browser", () => {
  test("shows 20 organizations with assignment counts and addresses", async () => {
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "30"),
    })
    expect(getOrganizationLinks()).toHaveLength(20)
    expect(
      screen
        .getByRole("link", {
          name: new RegExp(
            "Example Devices " +
              messages.assignmentCount.replace("{count}", "2")
          ),
        })
        .getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?org=Example+Devices")
    expect(screen.getByText("Test City US")).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe("1–20 of 30")
    expect(screen.getByText("Snapshot: Nov 17, 2026")).toBeTruthy()
  })

  test("restores a shared search and finds organizations by registered address", async () => {
    history.replaceState(null, "", "/tools/mac-address-vendor-lookup/?q=taipei")
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "1"),
    })
    expect(
      screen
        .getByRole("searchbox", { name: messages.vendorSearchLabel })
        .getAttribute("value")
    ).toBe("taipei")
    expect(getOrganizationLinks()).toHaveLength(1)
    expect(
      screen.getByRole("link", { name: /Small Devices/ }).getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?org=Small+Devices")
  })

  test("shows an address matching the search and selected registry with a nonempty fallback", async () => {
    vi.mocked(loadDatabase).mockResolvedValue({
      ...database,
      records: [
        {
          registry: "MA-L",
          assignment: "001122",
          organization: "Multisite Devices",
          address: "San Jose US",
        },
        {
          registry: "MA-M",
          assignment: "1012340",
          organization: "Multisite Devices",
          address: "",
        },
        {
          registry: "MA-M",
          assignment: "1012341",
          organization: "Multisite Devices",
          address: "Berlin DE",
        },
        {
          registry: "MA-M",
          assignment: "1012342",
          organization: "Multisite Devices",
          address: "Taipei TW",
        },
        {
          registry: "MA-M",
          assignment: "1012343",
          organization: "Multisite Devices",
          address: "TaIPEI Branch TW",
        },
        {
          registry: "MA-M",
          assignment: "1012344",
          organization: "Multisite Devices",
          address: "Munich DE",
        },
        {
          registry: "MA-L",
          assignment: "002233",
          organization: "Only Large",
          address: "London GB",
        },
      ],
    })
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?registry=MA-M&q=++tAiPeI++"
    )
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "1"),
    })
    expect(screen.getByText("Taipei TW")).toBeTruthy()
    expect(screen.queryByText("San Jose US")).toBeNull()
    expect(screen.queryByText("TaIPEI Branch TW")).toBeNull()
    expect(
      screen.getByText(messages.assignmentCount.replace("{count}", "5"))
    ).toBeTruthy()

    fireEvent.change(
      screen.getByRole("searchbox", { name: messages.vendorSearchLabel }),
      { target: { value: "Multisite" } }
    )
    await screen.findByText("Berlin DE")
    expect(screen.queryByText("Taipei TW")).toBeNull()
    expect(screen.queryByText("San Jose US")).toBeNull()
    fireEvent.click(screen.getByRole("radio", { name: messages.allRegistries }))
    expect(await screen.findByText("San Jose US")).toBeTruthy()
    expect(
      screen.getByText(messages.assignmentCount.replace("{count}", "6"))
    ).toBeTruthy()
  })

  test("opens the exact organization and avoids similarly named organizations", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Example+Devices"
    )
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("heading", {
      name: "Example Devices",
    })
    expect(screen.getAllByRole("row")).toHaveLength(3)
    expect(screen.queryByText("Example Devices Limited")).toBeNull()
    expect(
      screen.getByRole("link", { name: "00:AA:BB/24" }).getAttribute("href")
    ).toBe("/tools/mac-address-block-lookup/?q=00AABB&registry=MA-L")
    expect(
      screen.getByRole("link", { name: "10:12:34:5/28" }).getAttribute("href")
    ).toBe("/tools/mac-address-block-lookup/?q=1012345&registry=MA-M")
    expect(
      screen
        .getByRole("link", { name: messages.clearOrganization })
        .getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/")
  })

  test("filters a selected organization's assignments and resets its page", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Example+Devices&page=999"
    )
    render(<Client language="en" messages={messages} />)
    await screen.findByRole("table")

    fireEvent.click(screen.getByRole("radio", { name: "MA-M" }))
    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2))
    expect(window.location.search).toBe("?registry=MA-M&org=Example+Devices")
    expect(screen.getByRole("status").textContent).toBe("1–1 of 1")
    expect(
      screen
        .getByRole("link", { name: messages.clearOrganization })
        .getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?registry=MA-M")
    fireEvent.click(screen.getByRole("radio", { name: "MA-M" }))
    expect(
      screen.getByRole("radio", { name: "MA-M" }).getAttribute("aria-checked")
    ).toBe("true")
  })

  test("searching from an organization starts a new organization search", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Example+Devices"
    )
    render(<Client language="en" messages={messages} />)
    await screen.findByRole("table")

    fireEvent.change(
      screen.getByRole("searchbox", { name: messages.vendorSearchLabel }),
      { target: { value: "TAIPEI" } }
    )
    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "1"),
    })
    expect(window.location.search).toBe("?q=TAIPEI")
    expect(screen.queryByRole("table")).toBeNull()
    expect(screen.getByRole("link", { name: /Small Devices/ })).toBeTruthy()
  })

  test("preserves registry and search while paging and responding to browser history", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?q=Other&registry=MA-L"
    )
    render(<Client language="en" messages={messages} />)
    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "25"),
    })
    const next = screen.getByRole("link", { name: messages.next })
    expect(next.getAttribute("href")).toBe(
      "/tools/mac-address-vendor-lookup/?q=Other&registry=MA-L&page=2"
    )

    history.pushState(null, "", next.getAttribute("href")!)
    fireEvent.popState(window)
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("21–25 of 25")
    )
    expect(getOrganizationLinks()).toHaveLength(5)
    expect(
      screen.getByRole("link", { name: messages.previous }).getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?q=Other&registry=MA-L")
    expect(
      screen
        .getByRole("button", { name: messages.next })
        .hasAttribute("disabled")
    ).toBe(true)

    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?q=Other&registry=MA-L&page=999"
    )
    fireEvent.popState(window)
    expect(screen.getByRole("status").textContent).toBe("21–25 of 25")
  })

  test("paginates a large selected organization with exact, shareable links", async () => {
    vi.mocked(loadDatabase).mockResolvedValue({
      ...database,
      records: Array.from({ length: 23 }, (_, index) => ({
        registry: "MA-L" as const,
        assignment: `C0${index.toString(16).padStart(4, "0")}`,
        organization: "Bulk Devices",
        address: "London GB",
      })),
    })
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Bulk+Devices&page=999"
    )
    render(<Client language="en" messages={messages} />)

    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("21–23 of 23")
    )
    expect(screen.getAllByRole("row")).toHaveLength(4)
    expect(
      screen.getByRole("link", { name: messages.previous }).getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?org=Bulk+Devices")
    expect(screen.getByText("London GB")).toBeTruthy()
    expect(screen.queryByRole("link", { name: "Bulk Devices" })).toBeNull()
    expect(
      screen.getAllByRole("columnheader").map((cell) => cell.textContent)
    ).toEqual([messages.prefix, messages.registry])
  })

  test("shows an empty state for an organization without assignments in the selected registry", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Small+Devices&registry=MA-M"
    )
    render(<Client language="en" messages={messages} />)

    expect(await screen.findByText(messages.noResults)).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe("0–0 of 0")
    expect(screen.getByText(messages.noResultsHint)).toBeTruthy()
    expect(
      screen
        .getByRole("link", { name: messages.clearOrganization })
        .getAttribute("href")
    ).toBe("/tools/mac-address-vendor-lookup/?registry=MA-M")
  })

  test("filters the organization list by registry and clears it with the all option", async () => {
    render(<Client language="en" messages={messages} />)
    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "30"),
    })

    fireEvent.click(screen.getByRole("radio", { name: "MA-M" }))
    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "1"),
    })
    expect(getOrganizationLinks()).toHaveLength(1)
    fireEvent.click(screen.getByRole("radio", { name: messages.allRegistries }))
    await screen.findByRole("heading", {
      name: messages.organizationCount.replace("{count}", "30"),
    })
    fireEvent.change(
      screen.getByRole("searchbox", { name: messages.vendorSearchLabel }),
      { target: { value: "missing company" } }
    )
    expect(await screen.findByText(messages.noResults)).toBeTruthy()
    expect(window.location.search).toBe("?q=missing+company")
  })

  test("keeps search usable while data loads", async () => {
    let resolve!: (value: Database) => void
    vi.mocked(loadDatabase).mockReturnValue(
      new Promise((done) => {
        resolve = done
      })
    )
    render(<Client language="en" messages={messages} />)
    expect(screen.getByRole("status").textContent).toBe(messages.loading)

    const input = screen.getByRole("searchbox", {
      name: messages.vendorSearchLabel,
    })
    expect(input.hasAttribute("disabled")).toBe(false)
    fireEvent.change(input, { target: { value: "Taipei" } })
    await act(async () => resolve(database))
    expect(
      await screen.findByRole("heading", {
        name: messages.organizationCount.replace("{count}", "1"),
      })
    ).toBeTruthy()
  })

  test("can retry a failed download with the organization preserved", async () => {
    history.replaceState(
      null,
      "",
      "/tools/mac-address-vendor-lookup/?org=Example+Devices"
    )
    vi.mocked(loadDatabase).mockRejectedValueOnce(new Error("offline"))
    render(<Client language="en" messages={messages} />)

    await screen.findByRole("alert")
    fireEvent.click(screen.getByRole("button", { name: messages.retry }))
    expect(await screen.findByRole("table")).toBeTruthy()
    expect(loadDatabase).toHaveBeenCalledTimes(2)
    expect(window.location.search).toBe("?org=Example+Devices")
  })

  test("copies an exact organization link and localizes allocation links", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    history.replaceState(
      null,
      "",
      "/zh-CN/tools/mac-address-vendor-lookup/?org=Local+%26+Company"
    )
    render(<Client language="zh-CN" messages={messages} />)
    await screen.findByRole("table")

    fireEvent.click(screen.getByRole("button", { name: messages.share }))
    await screen.findByText(messages.copied)
    const copied = new URL(writeText.mock.calls[0]![0] as string)
    expect(copied.pathname).toBe("/zh-CN/tools/mac-address-vendor-lookup/")
    expect(copied.searchParams.get("org")).toBe("Local & Company")
    expect(
      screen.getByRole("link", { name: "AA:11:22/24" }).getAttribute("href")
    ).toBe("/zh-CN/tools/mac-address-block-lookup/?q=AA1122&registry=CID")
  })
})
