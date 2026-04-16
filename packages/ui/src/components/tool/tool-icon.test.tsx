import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { ToolIcon } from "./tool-icon"

afterEach(cleanup)

describe("ToolIcon", () => {
  test("renders known icon for 'binary'", () => {
    render(<ToolIcon icon="binary" data-testid="icon" />)
    expect(screen.getByTestId("icon")).toBeTruthy()
  })

  test("renders known icon for 'braces'", () => {
    render(<ToolIcon icon="braces" data-testid="icon" />)
    expect(screen.getByTestId("icon")).toBeTruthy()
  })

  test("renders known icon for 'image'", () => {
    render(<ToolIcon icon="image" data-testid="icon" />)
    expect(screen.getByTestId("icon")).toBeTruthy()
  })

  test("renders fallback Wrench icon for unknown icon name", () => {
    render(<ToolIcon icon="unknown-icon" data-testid="icon" />)
    expect(screen.getByTestId("icon")).toBeTruthy()
  })

  test("passes className to the icon", () => {
    render(<ToolIcon icon="binary" data-testid="icon" className="size-6" />)
    const icon = screen.getByTestId("icon")
    expect(icon.getAttribute("class")).toContain("size-6")
  })

  test("renders all known icon types", () => {
    const icons = [
      "binary",
      "braces",
      "credit-card",
      "file-json-2",
      "file-text",
      "globe",
      "image",
      "lock",
      "network",
    ]

    for (const iconName of icons) {
      const { unmount } = render(
        <ToolIcon icon={iconName} data-testid="icon" />
      )
      expect(screen.getByTestId("icon")).toBeTruthy()
      unmount()
    }
  })
})
