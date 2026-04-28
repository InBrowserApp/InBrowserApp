import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import LocalFontBookClient from "./client"

const messages = {
  meta: {
    name: "Local Font Book",
    description: "Browse and preview fonts installed on your device.",
  },
  libraryTitle: "Font library",
  loadButton: "Load local fonts",
  searchPlaceholder: "Search family, style, name, or PostScript…",
  groupLabel: "Group by family",
  filterStyleAll: "All styles",
  filterStyleRegular: "Regular",
  filterStyleItalic: "Italic/Oblique",
  sortLabel: "Sort",
  sortFamily: "Family",
  sortName: "Name",
  sortStyle: "Style",
  fontCount: "{count} fonts available",
  statusUnsupported: "Your browser does not support Local Font Access.",
  statusDenied: "Permission denied. Allow local-fonts to list fonts.",
  statusBlocked: "Access blocked by permissions policy or insecure context.",
  statusError: "Unable to load fonts. Try again.",
  previewTitle: "Preview",
  previewDescription:
    "Edit sample text and check the selected font on light or dark surfaces.",
  previewPlaceholder: "Type specimen text…",
  previewFallback: "Sample text",
  previewBackground: "Dark background",
  previewEmpty: "Choose a font to start previewing.",
  detailsTitle: "Font details",
  detailsDescription:
    "Review font metadata and copy a ready-to-use CSS declaration.",
  detailsFamily: "Family",
  detailsFullName: "Full name",
  detailsPostscript: "PostScript name",
  detailsStyle: "Style",
  cssTitle: "CSS snippet",
  copyCssLabel: "Copy CSS snippet",
  copiedLabel: "Copied",
  noResults: "No fonts match your filters.",
} as const

const fontFixtures = [
  {
    family: "Inter",
    fullName: "Inter Regular",
    postscriptName: "Inter-Regular",
    style: "Regular",
  },
  {
    family: "Inter",
    fullName: "Inter Italic",
    postscriptName: "Inter-Italic",
    style: "Italic",
  },
  {
    family: "Roboto",
    fullName: "Roboto Bold",
    postscriptName: "Roboto-Bold",
    style: "Bold",
  },
] as const

const originalPermissions = Object.getOwnPropertyDescriptor(
  navigator,
  "permissions"
)
const originalQueryLocalFonts = Object.getOwnPropertyDescriptor(
  window,
  "queryLocalFonts"
)

beforeEach(() => {
  window.localStorage.clear()
  setPermissionsQuery(async () => ({ state: "prompt" }))
})

afterEach(() => {
  cleanup()

  if (originalPermissions) {
    Object.defineProperty(navigator, "permissions", originalPermissions)
  } else {
    Reflect.deleteProperty(navigator, "permissions")
  }

  if (originalQueryLocalFonts) {
    Object.defineProperty(window, "queryLocalFonts", originalQueryLocalFonts)
  } else {
    Reflect.deleteProperty(window, "queryLocalFonts")
  }
})

describe("LocalFontBookClient", () => {
  test("shows the unsupported message when Local Font Access is unavailable", () => {
    Reflect.deleteProperty(window, "queryLocalFonts")

    render(<LocalFontBookClient messages={messages} />)

    expect(screen.getByText(messages.statusUnsupported)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.loadButton })
    ).toHaveProperty("disabled", true)
  })

  test("loads fonts, filters them, and updates the CSS snippet", async () => {
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))

    render(<LocalFontBookClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.loadButton }))

    await waitFor(() => {
      expect(screen.getByText("3 fonts available")).toBeTruthy()
      expect(screen.getByTestId("font-Inter-Regular")).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "Roboto" },
    })

    await waitFor(() => {
      expect(screen.getByText("Roboto Bold")).toBeTruthy()
      expect(screen.queryByTestId("font-Inter-Regular")).toBeNull()
    })

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "" },
    })

    await waitFor(() => {
      expect(screen.getByTestId("font-Inter-Regular")).toBeTruthy()
    })

    fireEvent.click(screen.getByTestId("font-Inter-Italic"))

    expect(screen.getByTestId("css-snippet").textContent).toContain(
      "font-style: italic;"
    )
  })

  test("shows a denied status when the API rejects the permission request", async () => {
    setQueryLocalFonts(
      vi.fn().mockRejectedValue({
        name: "NotAllowedError",
      })
    )

    render(<LocalFontBookClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.loadButton }))

    await waitFor(() => {
      expect(screen.getByText(messages.statusDenied)).toBeTruthy()
    })
  })

  test("restores and persists local settings", async () => {
    window.localStorage.setItem(STORAGE_KEYS.searchQuery, "Inter")
    window.localStorage.setItem(STORAGE_KEYS.groupByFamily, "false")
    window.localStorage.setItem(STORAGE_KEYS.sampleText, "Stored specimen")
    setQueryLocalFonts(vi.fn().mockResolvedValue(fontFixtures))

    render(<LocalFontBookClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.searchPlaceholder) as HTMLInputElement)
        .value
    ).toBe("Inter")
    expect(
      (screen.getByLabelText(messages.previewFallback) as HTMLTextAreaElement)
        .value
    ).toBe("Stored specimen")

    fireEvent.click(screen.getByRole("button", { name: messages.loadButton }))

    await waitFor(() => {
      expect(screen.getByTestId("font-Inter-Regular")).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText(messages.searchPlaceholder), {
      target: { value: "Roboto" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.searchQuery)).toBe(
        "Roboto"
      )
    })
  })
})

function setPermissionsQuery(
  implementation: () => Promise<{
    state: PermissionState
  }>
) {
  Object.defineProperty(navigator, "permissions", {
    configurable: true,
    value: {
      query: implementation,
    },
  })
}

function setQueryLocalFonts(value: unknown) {
  Object.defineProperty(window, "queryLocalFonts", {
    configurable: true,
    writable: true,
    value,
  })
}

const STORAGE_KEYS = {
  searchQuery: "tools:local-font-book:search",
  groupByFamily: "tools:local-font-book:group",
  sampleText: "tools:local-font-book:sample-text",
} as const
