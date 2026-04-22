import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import HtmlColorNamesClient from "./client"

const messages = {
  meta: {
    name: "HTML Color Names",
    description:
      "Browse and search 140+ CSS/HTML named colors with HEX and RGB values",
  },
  searchPlaceholder: "Search by color name or HEX value...",
  all: "All",
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  cyan: "Cyan",
  blue: "Blue",
  purple: "Purple",
  pink: "Pink",
  brown: "Brown",
  gray: "Gray",
  white: "White",
  swatch: "Color",
  hex: "HEX",
  rgb: "RGB",
  resetLabel: "Reset",
  noResultsTitle: "No matching colors",
} as const

describe("HtmlColorNamesClient", () => {
  afterEach(() => {
    cleanup()
  })

  test("renders the default catalog", () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    expect(screen.getByText("aliceblue")).toBeTruthy()
    expect(screen.getByText("tomato")).toBeTruthy()
  })

  test("filters colors by name search", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "tomato" },
    })

    await waitFor(() => {
      expect(screen.getByText("tomato")).toBeTruthy()
    })

    expect(screen.queryByText("aliceblue")).toBeNull()
  })

  test("filters colors by HEX query", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "#FF0000" },
    })

    await waitFor(() => {
      expect(screen.getByText("red")).toBeTruthy()
    })
  })

  test("filters by category and can reset back to the full list", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.blue }))

    await waitFor(() => {
      expect(screen.queryByText("tomato")).toBeNull()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(screen.getByText("tomato")).toBeTruthy()
    })
  })

  test("shows the empty state when no colors match", async () => {
    render(<HtmlColorNamesClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "not-a-real-color" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.noResultsTitle)).toBeTruthy()
    })
  })
})
