import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { MacAddressRecords } from "./mac-address-records"

const labels = {
  prefix: "Prefix",
  registry: "Registry",
  organization: "Organization",
  address: "Registered address",
}
const row = {
  key: "MA-S-001122334",
  prefix: "00:11:22:33:4/36",
  registry: "MA-S",
  organization: "Example Devices & Networks",
  address: "123 Example Street, Test City, US",
  blockHref: "/tools/mac-address-block-lookup/?query=001122334",
  organizationHref:
    "/tools/mac-address-vendor-lookup/?organization=Example+Devices+%26+Networks",
}

afterEach(cleanup)

describe("MacAddressRecords", () => {
  test("renders column headers and browsable assignment records", () => {
    render(<MacAddressRecords rows={[row]} labels={labels} />)

    const table = screen.getByRole("table")
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((cell) => cell.textContent)
    ).toEqual(Object.values(labels))
    const prefixLink = screen.getByRole("link", { name: row.prefix })
    expect(prefixLink.getAttribute("href")).toBe(row.blockHref)
    expect(prefixLink.getAttribute("dir")).toBe("ltr")
    expect(prefixLink.getAttribute("translate")).toBe("no")
    expect(
      screen.getByRole("link", { name: row.organization }).getAttribute("href")
    ).toBe(row.organizationHref)
    expect(screen.getByText(row.address)).toBeTruthy()
    expect(screen.getByText(row.registry).getAttribute("dir")).toBe("ltr")
  })

  test("preserves long organization names, international addresses, and all page rows", () => {
    const longOrganization = "Example".repeat(40)
    const longAddress = "عنوان مسجل 123, 測試地址, Beispielstraße 456"
    const rows = Array.from({ length: 20 }, (_, index) => ({
      ...row,
      key: `record-${index}`,
      prefix: `00:11:22:${index.toString(16).padStart(2, "0")}:0/36`,
      organization: `${longOrganization} ${index}`,
      address: longAddress,
    }))
    render(<MacAddressRecords rows={rows} labels={labels} />)

    expect(screen.getAllByRole("row")).toHaveLength(21)
    expect(screen.getAllByRole("link")).toHaveLength(40)
    expect(screen.getAllByText(longAddress)).toHaveLength(20)
    const organization = screen.getByText(`${longOrganization} 19`)
    expect(organization.tagName).toBe("BDI")
    expect(organization.getAttribute("translate")).toBe("no")
  })

  test("shows an em dash for an absent registered address", () => {
    render(
      <MacAddressRecords rows={[{ ...row, address: "" }]} labels={labels} />
    )

    expect(screen.getByText("—")).toBeTruthy()
  })
})
