import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "./tool-panel-card"

afterEach(cleanup)

describe("ToolPanelCard", () => {
  test("adds full-height layout defaults", () => {
    render(
      <ToolPanelCard>
        <div>body</div>
      </ToolPanelCard>
    )

    const card = screen.getByText("body").closest("[data-slot='card']")
    expect(card?.className).toContain("h-full")
  })

  test("adds flex content defaults", () => {
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
  })

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
