import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

vi.mock("mime-db", () => ({
  default: {
    "application/json": {
      extensions: ["json"],
      source: "iana",
      compressible: true,
      charset: "UTF-8",
    },
    "image/png": {
      extensions: ["png"],
      source: "iana",
      compressible: false,
    },
    "text/plain": {
      extensions: ["txt", "text"],
      source: "iana",
      compressible: true,
      charset: "UTF-8",
    },
    "video/webm": {
      extensions: ["webm"],
      source: "iana",
      compressible: false,
    },
  },
}))

import MimeTypeLookupClient from "./client"

const messages = {
  meta: {
    name: "MIME Type Lookup",
    description: "Search and browse MIME types and their file extensions.",
  },
  searchPlaceholder: "Search MIME types, extensions...",
  all: "All",
  previousPage: "Previous page",
  nextPage: "Next page",
  mimeType: "MIME Type",
  extensions: "Extensions",
  category: "Category",
  source: "Source",
  compressible: "Compressible",
  charset: "Charset",
  yes: "Yes",
  no: "No",
  application: "Application",
  audio: "Audio",
  font: "Font",
  image: "Image",
  message: "Message",
  model: "Model",
  multipart: "Multipart",
  text: "Text",
  video: "Video",
  unknown: "Unknown",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("MimeTypeLookupClient", () => {
  test("renders the default MIME type list", () => {
    render(<MimeTypeLookupClient language="en" messages={messages} />)

    expect(
      screen.getByRole("textbox", { name: messages.searchPlaceholder })
    ).toHaveProperty("value", "")
    expect(screen.getByText("application/json")).toBeTruthy()
    expect(screen.getByText("text/plain")).toBeTruthy()
    expect(screen.getByText("1-4 / 4")).toBeTruthy()
  })

  test("filters the list by search query", () => {
    render(<MimeTypeLookupClient language="en" messages={messages} />)

    const input = screen.getByRole("textbox", {
      name: messages.searchPlaceholder,
    })
    fireEvent.change(input, { target: { value: "webm" } })

    expect(screen.getByText("video/webm")).toBeTruthy()
    expect(screen.queryByText("application/json")).toBeNull()
  })

  test("filters the list by category", () => {
    render(<MimeTypeLookupClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.image }))

    expect(screen.getByText("image/png")).toBeTruthy()
    expect(screen.queryByText("text/plain")).toBeNull()
  })

  test("restores the stored search query and category filter", async () => {
    window.localStorage.setItem(SEARCH_STORAGE_KEY, "json")
    window.localStorage.setItem(CATEGORY_STORAGE_KEY, "application")

    render(<MimeTypeLookupClient language="en" messages={messages} />)

    expect(await screen.findByDisplayValue("json")).toBeTruthy()
    expect(screen.getByText("application/json")).toBeTruthy()
    expect(screen.queryByText("text/plain")).toBeNull()
  })
})

const SEARCH_STORAGE_KEY = "tools:mime-type-lookup:search"
const CATEGORY_STORAGE_KEY = "tools:mime-type-lookup:category"
