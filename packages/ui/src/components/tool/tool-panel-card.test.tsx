import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "./tool-panel-card"

afterEach(cleanup)

describe("ToolPanelCard", () => {
  test.each(["default", "sm"] as const)(
    "resets outer spacing for %s panels",
    (size) => {
      render(
        <ToolPanelCard size={size}>
          <div>body</div>
        </ToolPanelCard>
      )

      const card = screen.getByText("body").closest("[data-slot='card']")
      expect(card?.className).toContain("h-full")
      expect(card?.className).toContain("gap-0")
      expect(card?.className).toContain("py-0")
      expect(card?.className).toContain("data-[size=sm]:gap-0")
      expect(card?.className).toContain("data-[size=sm]:py-0")
      expect(card?.className).not.toContain("data-[size=sm]:py-3")
      expect(card?.className).not.toContain("data-[size=sm]:gap-3")
    }
  )

  test("restores top padding on a header child", () => {
    render(
      <ToolPanelCard>
        <div>body</div>
      </ToolPanelCard>
    )

    const card = screen.getByText("body").closest("[data-slot='card']")
    expect(card?.className).toContain("[&>[data-slot=card-header]]:pt-4")
  })

  test("adds padded flex content defaults", () => {
    render(
      <ToolPanelCard>
        <ToolPanelCardContent>content</ToolPanelCardContent>
      </ToolPanelCard>
    )

    const content = screen
      .getByText("content")
      .closest("[data-slot='card-content']")
    expect(content?.className).toContain("flex")
    expect(content?.className).toContain("flex-1")
    expect(content?.className).toContain("flex-col")
    expect(content?.className).toContain("py-4")
    expect(content?.className).toContain("group-data-[size=sm]/card:py-3")
  })

  test.each(["default", "sm"] as const)(
    "supports unpadded content in %s panels",
    (size) => {
      render(
        <ToolPanelCard size={size}>
          <ToolPanelCardContent padding="none">preview</ToolPanelCardContent>
        </ToolPanelCard>
      )

      const content = screen
        .getByText("preview")
        .closest("[data-slot='card-content']")
      expect(content?.className).toContain("p-0")
      expect(content?.className).not.toContain("py-4")
      expect(content?.className).toContain("group-data-[size=sm]/card:p-0")
      expect(content?.className).not.toContain("group-data-[size=sm]/card:px-3")
      expect(content?.className).not.toContain("group-data-[size=sm]/card:py-3")
      expect(content?.hasAttribute("padding")).toBe(false)
    }
  )

  test("adds pinned footer defaults", () => {
    render(
      <ToolPanelCard>
        <ToolPanelCardFooter>footer</ToolPanelCardFooter>
      </ToolPanelCard>
    )

    const footer = screen
      .getByText("footer")
      .closest("[data-slot='card-footer']")
    expect(footer?.className).toContain("mt-auto")
  })

  test("keeps caller classes on wrapped slots", () => {
    render(
      <ToolPanelCard className="card-extra">
        <ToolPanelCardContent className="content-extra">
          content
        </ToolPanelCardContent>
        <ToolPanelCardFooter className="footer-extra">
          footer
        </ToolPanelCardFooter>
      </ToolPanelCard>
    )

    const card = screen.getByText("content").closest("[data-slot='card']")
    const content = screen
      .getByText("content")
      .closest("[data-slot='card-content']")
    const footer = screen
      .getByText("footer")
      .closest("[data-slot='card-footer']")

    expect(card?.className).toContain("card-extra")
    expect(content?.className).toContain("content-extra")
    expect(footer?.className).toContain("footer-extra")
  })
})
