import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import ImageToolsClient from "./client"

import type { ImageToolsMessages, ImageToolsRelatedTool } from "./client"

const messages = {
  allToolsLabel: "All",
  clearSearchLabel: "Clear search",
  convertGroupLabel: "Convert",
  createGroupLabel: "Create",
  emptySearchDescription: "Try another query.",
  emptySearchTitle: "No image tools match",
  filterDescription: "Filter by workflow",
  inspectGroupLabel: "Inspect",
  meta: {
    description: "Browse image tools.",
    name: "Image Tools",
  },
  noToolsDescription: "Tools will appear here.",
  noToolsTitle: "No image tools are available",
  openToolLabel: "Open tool",
  optimizeGroupLabel: "Optimize",
  resultCountTemplate: "{count} image tools",
  scanGroupLabel: "Scan",
  searchLabel: "Search image tools",
  searchPlaceholder: "Search by task",
} as const satisfies ImageToolsMessages

const relatedTools = [
  {
    category: "image",
    icon: "image",
    slug: "image-resizer",
    tags: ["image", "resize"],
    meta: {
      description: "Resize images for the web.",
      name: "Image Resizer",
    },
  },
  {
    category: "image",
    icon: "image",
    slug: "image-to-webp-converter",
    tags: ["image", "webp", "converter"],
    meta: {
      description: "Convert raster images to WebP.",
      name: "Image to WebP Converter",
    },
  },
  {
    category: "image",
    icon: "image",
    slug: "qr-code-reader",
    tags: ["image", "reader", "scan"],
    meta: {
      description: "Read QR codes from images.",
      name: "QR Code Reader",
    },
  },
] as const satisfies readonly ImageToolsRelatedTool[]

afterEach(cleanup)

describe("ImageToolsClient", () => {
  test("renders related image tools with localized links", () => {
    render(
      <ImageToolsClient
        lang="es"
        messages={messages}
        relatedTools={relatedTools}
      />
    )

    expect(
      screen
        .getByRole("link", { name: "Open tool: Image Resizer" })
        .getAttribute("href")
    ).toBe("/es/tools/image-resizer")
    expect(screen.getByText("3 image tools")).toBeTruthy()
  })

  test("filters tools by workflow", () => {
    render(
      <ImageToolsClient
        lang="en"
        messages={messages}
        relatedTools={relatedTools}
      />
    )

    fireEvent.click(screen.getByRole("radio", { name: /Convert 1/ }))

    expect(screen.getByText("Image to WebP Converter")).toBeTruthy()
    expect(screen.queryByText("Image Resizer")).toBeNull()
  })

  test("searches tools and clears the query", () => {
    render(
      <ImageToolsClient
        lang="en"
        messages={messages}
        relatedTools={relatedTools}
      />
    )

    fireEvent.change(screen.getByLabelText(messages.searchLabel), {
      target: { value: "qr" },
    })

    expect(screen.getByText("QR Code Reader")).toBeTruthy()
    expect(screen.queryByText("Image Resizer")).toBeNull()

    fireEvent.click(screen.getByLabelText(messages.clearSearchLabel))

    expect(screen.getByText("Image Resizer")).toBeTruthy()
  })

  test("shows empty states for no tools and no search matches", () => {
    const { rerender } = render(
      <ImageToolsClient lang="en" messages={messages} relatedTools={[]} />
    )

    expect(screen.getByText(messages.noToolsTitle)).toBeTruthy()

    rerender(
      <ImageToolsClient
        lang="en"
        messages={messages}
        relatedTools={relatedTools}
      />
    )

    fireEvent.change(screen.getByLabelText(messages.searchLabel), {
      target: { value: "camera raw" },
    })

    expect(screen.getByText(messages.emptySearchTitle)).toBeTruthy()
  })
})
