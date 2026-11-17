import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { MacAddressNavigation } from "./mac-address-navigation"

const items = [
  {
    key: "lookup",
    label: "MAC lookup",
    href: "/zh-CN/tools/mac-address-lookup/?query=00%3A11%3A22",
  },
  {
    key: "blocks",
    label: "Browse blocks",
    href: "/zh-CN/tools/mac-address-block-lookup/?registry=MA-S",
  },
  {
    key: "vendors",
    label: "Search organizations",
    href: "/zh-CN/tools/mac-address-vendor-lookup/?query=Apple",
  },
] as const

afterEach(cleanup)

describe("MacAddressNavigation", () => {
  test.each(items)("marks only $key as the current page", (active) => {
    render(<MacAddressNavigation active={active.key} items={items} />)

    expect(screen.getByRole("navigation", { name: active.label })).toBeTruthy()
    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(3)
    expect(links.filter((link) => link.hasAttribute("aria-current"))).toEqual([
      screen.getByRole("link", { name: active.label }),
    ])
    expect(
      screen
        .getByRole("link", { name: active.label })
        .getAttribute("aria-current")
    ).toBe("page")
  })

  test("keeps real localized links and query parameters intact", () => {
    render(<MacAddressNavigation active="lookup" items={items} />)

    for (const item of items) {
      const link = screen.getByRole("link", { name: item.label })
      expect(link.getAttribute("href")).toBe(item.href)
      expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true"
      )
    }
  })
})
