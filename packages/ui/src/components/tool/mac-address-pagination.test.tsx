import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { MacAddressPagination } from "./mac-address-pagination"

const props = {
  summary: "21–40 / 100",
  previousLabel: "Previous page",
  nextLabel: "Next page",
  previousHref: "/tools/mac-address-block-lookup/?registry=MA-S&page=1",
  nextHref: "/tools/mac-address-block-lookup/?registry=MA-S&page=3",
}

afterEach(cleanup)

describe("MacAddressPagination", () => {
  test("provides real page links with filters and announces the visible range", () => {
    render(<MacAddressPagination {...props} />)

    expect(screen.getByRole("navigation", { name: props.summary })).toBeTruthy()
    expect(screen.getByRole("status").textContent).toBe(props.summary)
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite")
    const previous = screen.getByRole("link", { name: props.previousLabel })
    const next = screen.getByRole("link", { name: props.nextLabel })
    expect(previous.getAttribute("href")).toBe(props.previousHref)
    expect(previous.getAttribute("rel")).toBe("prev")
    expect(next.getAttribute("href")).toBe(props.nextHref)
    expect(next.getAttribute("rel")).toBe("next")
    expect(previous.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true"
    )
    expect(next.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  })

  test("disables the previous control on the first page without creating a dead link", () => {
    render(<MacAddressPagination {...props} previousHref={null} />)

    expect(
      screen
        .getByRole("button", { name: props.previousLabel })
        .hasAttribute("disabled")
    ).toBe(true)
    expect(screen.queryByRole("link", { name: props.previousLabel })).toBeNull()
    expect(screen.getByRole("link", { name: props.nextLabel })).toBeTruthy()
  })

  test("disables the next control on the last page", () => {
    render(<MacAddressPagination {...props} nextHref={null} />)

    expect(
      screen
        .getByRole("button", { name: props.nextLabel })
        .hasAttribute("disabled")
    ).toBe(true)
    expect(screen.queryByRole("link", { name: props.nextLabel })).toBeNull()
    expect(screen.getByRole("link", { name: props.previousLabel })).toBeTruthy()
  })

  test("handles a single empty page in an RTL layout", () => {
    render(
      <div dir="rtl">
        <MacAddressPagination
          summary="٠ / ٠"
          previousLabel="السابق"
          nextLabel="التالي"
          previousHref={null}
          nextHref={null}
        />
      </div>
    )

    expect(screen.queryByRole("link")).toBeNull()
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(2)
    expect(buttons.every((button) => button.hasAttribute("disabled"))).toBe(
      true
    )
    expect(
      buttons.every((button) => button.querySelector(".rtl\\:rotate-180"))
    ).toBe(true)
  })
})
