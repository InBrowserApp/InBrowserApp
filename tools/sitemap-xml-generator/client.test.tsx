import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import SitemapXmlGeneratorClient from "./client"
import { STORAGE_KEY } from "./client/constants"

const messages = {
  meta: {
    name: "Sitemap XML Generator",
    description: "Generate sitemap.xml files from clean URL lists.",
  },
  modeLabel: "Output mode",
  modeDescription: "Choose between a standard urlset and a sitemap index.",
  urlsetModeLabel: "URL set",
  sitemapIndexModeLabel: "Sitemap index",
  baseUrlLabel: "Base URL",
  baseUrlDescription:
    "Used when you want to join relative paths into full URLs.",
  baseUrlPlaceholder: "https://example.com",
  autoJoinLabel: "Join relative paths with the base URL",
  autoJoinDescription:
    "Turn this off when every row already contains an absolute URL.",
  presetsLabel: "Presets",
  presetsDescription: "Start from a sensible example, then tune the entries.",
  standardPresetLabel: "Standard site",
  contentPresetLabel: "Content hub",
  indexPresetLabel: "Sitemap index",
  urlEntriesLabel: "URL entries",
  urlEntriesDescription: "Each row becomes one <url> record in sitemap.xml.",
  urlEntryLabel: "Page {index}",
  addUrlEntryLabel: "Add URL entry",
  sitemapEntriesLabel: "Sitemap files",
  sitemapEntriesDescription:
    "Each row becomes one <sitemap> record in the index.",
  sitemapEntryLabel: "Sitemap {index}",
  addSitemapEntryLabel: "Add sitemap entry",
  removeEntryLabel: "Remove",
  locationLabel: "Location",
  pathPlaceholder: "/pricing or https://example.com/pricing",
  lastModifiedLabel: "Last modified",
  lastModifiedPlaceholder: "2026-04-20 or 2026-04-20T10:30:00+00:00",
  changeFrequencyLabel: "Change frequency",
  changeFrequencyPlaceholder: "Optional",
  priorityLabel: "Priority",
  priorityPlaceholder: "0.0 to 1.0",
  outputLabel: "Generated XML",
  outputDescription: "Copy or download the XML once the sitemap is valid.",
  outputEmptyDescription:
    "Add at least one URL or sitemap file to generate XML.",
  outputErrorTitle: "Cannot generate XML yet",
  invalidBaseUrlMessage:
    "Base URL must be a valid http or https URL when auto join is enabled.",
  invalidUrlLocationMessage:
    "Row {index} needs an http/https URL or a path that can be joined to the base URL.",
  invalidSitemapLocationMessage:
    "Sitemap {index} needs an http/https URL or a path that can be joined to the base URL.",
  invalidLastmodMessage:
    "Row {index} last modified must use YYYY-MM-DD or a full ISO datetime with timezone.",
  invalidPriorityMessage:
    "Row {index} priority must be a number between 0.0 and 1.0.",
  generatedUrlCountLabel: "{count} URL entries included",
  generatedSitemapCountLabel: "{count} sitemap files included",
  copyXmlLabel: "Copy XML",
  copiedLabel: "Copied",
  downloadXmlLabel: "Download XML",
} as const

beforeEach(() => {
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:sitemap")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("SitemapXmlGeneratorClient", () => {
  test("renders the default preset and generates XML", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    const outputRegion = screen.getByRole("region", {
      name: messages.outputLabel,
    })

    await waitFor(() => {
      expect(outputRegion.textContent).toContain("https://example.com/")
    })

    expect(
      screen
        .getByRole("link", { name: messages.downloadXmlLabel })
        .getAttribute("download")
    ).toBe("sitemap.xml")
  })

  test("switches to sitemap index mode", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.sitemapIndexModeLabel })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.indexPresetLabel })
    )

    const outputRegion = screen.getByRole("region", {
      name: messages.outputLabel,
    })

    await waitFor(() => {
      expect(outputRegion.textContent).toContain("<sitemapindex")
    })

    expect(
      screen
        .getByRole("link", { name: messages.downloadXmlLabel })
        .getAttribute("download")
    ).toBe("sitemap-index.xml")
  })

  test("shows a validation error when priority is invalid", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    const priorityInputs = screen.getAllByLabelText(messages.priorityLabel)
    fireEvent.change(priorityInputs[0] as HTMLInputElement, {
      target: { value: "2" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "priority must be a number between 0.0 and 1.0."
      )
    })
  })

  test("shows a validation error when the base URL is invalid", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.baseUrlLabel), {
      target: { value: "not-a-url" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Base URL must be a valid http or https URL"
      )
    })
  })

  test("shows a validation error when a URL location is invalid", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    const locationInputs = screen.getAllByLabelText(messages.locationLabel)
    fireEvent.change(locationInputs[0] as HTMLInputElement, {
      target: { value: "ftp://example.com/page.xml" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Row 1 needs an http/https URL"
      )
    })
  })

  test("shows a validation error when lastmod is invalid", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    const lastmodInputs = screen.getAllByLabelText(messages.lastModifiedLabel)
    fireEvent.change(lastmodInputs[0] as HTMLInputElement, {
      target: { value: "April 20" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "last modified must use YYYY-MM-DD"
      )
    })
  })

  test("shows a validation error when a sitemap location is invalid", async () => {
    render(<SitemapXmlGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.sitemapIndexModeLabel })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.indexPresetLabel })
    )

    const locationInputs = screen.getAllByLabelText(messages.locationLabel)
    fireEvent.change(locationInputs[0] as HTMLInputElement, {
      target: { value: "ftp://example.com/sitemap.xml" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        "Sitemap 1 needs an http/https URL"
      )
    })
  })

  test("restores stored state from local storage", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: "urlset",
        baseUrl: "https://stored.example.com",
        autoJoin: true,
        urlEntries: [
          { loc: "/docs", lastmod: "", changefreq: "", priority: "" },
        ],
        sitemapEntries: [{ loc: "/sitemap.xml", lastmod: "" }],
      })
    )

    render(<SitemapXmlGeneratorClient messages={messages} />)

    const outputRegion = screen.getByRole("region", {
      name: messages.outputLabel,
    })

    await waitFor(() => {
      expect(outputRegion.textContent).toContain(
        "https://stored.example.com/docs"
      )
    })

    const baseUrlInput = screen.getByLabelText(
      messages.baseUrlLabel
    ) as HTMLInputElement
    expect(baseUrlInput.value).toBe("https://stored.example.com")
  })
})
