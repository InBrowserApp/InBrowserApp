import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import HtmlColorNamesClient from "./client"

const messages = {
  meta: {
    name: "HTML Color Names",
    description: "Browse and search named HTML colors.",
  },
  all: "All",
  blue: "Blue",
  brown: "Brown",
  cyan: "Cyan",
  gray: "Gray",
  green: "Green",
  hex: "HEX",
  name: "Name",
  noResults: "No colors matched your search.",
  orange: "Orange",
  pink: "Pink",
  purple: "Purple",
  red: "Red",
  rgb: "RGB",
  searchPlaceholder: "Search by color name or HEX value...",
  swatch: "Color",
  white: "White",
  yellow: "Yellow",
} as const

describe("HtmlColorNamesClient", () => {
  const writeText = vi.fn()

  beforeEach(() => {
    window.localStorage.clear()
    writeText.mockReset()
    writeText.mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })
  })

  afterEach(() => {
    cleanup()
  })

  test("restores local storage and filters by search and category", async () => {
    window.localStorage.setItem("tools:html-color-names:search", "steel")
    window.localStorage.setItem("tools:html-color-names:category", "blue")

    render(<HtmlColorNamesClient language="en" messages={messages} />)

    await screen.findByDisplayValue("steel")
    expect(
      screen.getByRole("radio", { name: "Blue" }).getAttribute("data-state")
    ).toBe("on")
    expect(screen.getByText("steelblue")).toBeTruthy()
    expect(screen.queryByText("tomato")).toBeNull()
  })

  test("shows an empty state when filters remove every result", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.searchPlaceholder }),
      {
        target: { value: "does-not-exist" },
      }
    )

    await waitFor(() => {
      expect(screen.getAllByText(messages.noResults).length).toBeGreaterThan(0)
    })
  })

  test("copies values from the result table", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    const tomatoButton = screen.getByRole("button", { name: "tomato" })
    fireEvent.click(tomatoButton)

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("tomato")
    })
    await waitFor(() => {
      expect(tomatoButton.getAttribute("data-state")).toBe("copied")
    })
  })
})
