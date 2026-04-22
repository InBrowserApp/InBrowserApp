import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RobotsTxtGeneratorClient from "./client"

const messages = {
  meta: {
    name: "robots.txt Generator",
    description: "Generate robots.txt files.",
  },
  presets: "Presets",
  presetAllowAll: "Allow all",
  presetDisallowAll: "Disallow all",
  presetBlockAdmin: "Block /admin/",
  siteSettings: "Site settings",
  sitemaps: "Sitemaps",
  sitemapPlaceholder: "https://example.com/sitemap.xml",
  addSitemap: "Add sitemap",
  advancedSettings: "Advanced settings",
  host: "Host (non-standard)",
  hostPlaceholder: "example.com",
  groups: "User-agent groups",
  groupTitle: "Group {index}",
  removeGroup: "Remove group",
  addGroup: "Add group",
  userAgents: "User agents",
  userAgentPlaceholder: "* or Googlebot",
  userAgentPresets: "User-agent presets",
  presetSearchEngines: "Add search engine bots",
  presetAiCrawlers: "Add AI crawlers",
  userAgentHint: "Empty user-agent defaults to *.",
  addUserAgent: "Add user-agent",
  rules: "Rules",
  ruleHint: "No rules means allow all.",
  ruleAllow: "Allow",
  ruleDisallow: "Disallow",
  pathPlaceholder: "/path/",
  addRule: "Add rule",
  removeRule: "Remove rule",
  crawlDelay: "Crawl-delay (seconds)",
  crawlDelayPlaceholder: "e.g. 10",
  output: "Output",
  download: "Download robots.txt",
  emptyOutput: "No content to export yet.",
} as const

const createObjectURL = vi.fn(() => "blob:robots")
const revokeObjectURL = vi.fn()

beforeEach(() => {
  Object.defineProperty(URL, "createObjectURL", {
    configurable: true,
    value: createObjectURL,
  })
  Object.defineProperty(URL, "revokeObjectURL", {
    configurable: true,
    value: revokeObjectURL,
  })
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
})

describe("RobotsTxtGeneratorClient", () => {
  test("renders the default example and download link", async () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    const output = screen.getByLabelText("Output") as HTMLTextAreaElement
    expect(output.value).toContain("User-agent: *")
    expect(output.value).toContain("Disallow: /admin/")
    expect(output.value).toContain("Sitemap: https://example.com/sitemap.xml")

    const downloadLink = await screen.findByRole("link", {
      name: "Download robots.txt",
    })
    expect(downloadLink.getAttribute("href")).toBe("blob:robots")
  })

  test("applies the allow-all preset and highlights it", () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Allow all" }))

    const output = screen.getByLabelText("Output") as HTMLTextAreaElement
    expect(output.value).toContain("User-agent: *")
    expect(output.value.includes("Disallow:")).toBe(false)
    expect(
      screen
        .getByRole("radio", { name: "Allow all" })
        .getAttribute("data-state")
    ).toBe("on")
  })

  test("clears preset highlight after manual changes diverge", () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Allow all" }))
    fireEvent.click(screen.getByRole("button", { name: "Add rule" }))
    fireEvent.change(screen.getAllByPlaceholderText("/path/")[0], {
      target: { value: "/private/" },
    })

    expect(
      screen
        .getByRole("radio", { name: "Allow all" })
        .getAttribute("data-state")
    ).toBe("off")
  })

  test("supports advanced settings and crawl delay", async () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("switch", { name: "Advanced settings" }))
    fireEvent.change(screen.getByLabelText("Host (non-standard)"), {
      target: { value: "example.com" },
    })
    fireEvent.change(screen.getByLabelText("Crawl-delay (seconds)"), {
      target: { value: "5" },
    })

    await waitFor(() => {
      const output = screen.getByLabelText("Output") as HTMLTextAreaElement
      expect(output.value).toContain("Host: example.com")
      expect(output.value).toContain("Crawl-delay: 5")
    })
  })

  test("adds user-agent presets without duplicates", () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    const userAgentsInput = screen.getByLabelText(
      "User agents"
    ) as HTMLTextAreaElement
    fireEvent.change(userAgentsInput, { target: { value: "Googlebot" } })
    fireEvent.click(
      screen.getByRole("button", { name: "Add search engine bots" })
    )
    fireEvent.click(
      screen.getByRole("button", { name: "Add search engine bots" })
    )

    const lines = userAgentsInput.value.split("\n")
    expect(lines.filter((line) => line === "Googlebot")).toHaveLength(1)
    expect(lines).toContain("Bingbot")
  })

  test("restores stored draft state from localStorage", async () => {
    window.localStorage.setItem(
      "tools:robots-txt-generator:draft",
      JSON.stringify({
        groups: [
          {
            id: "stored-group",
            userAgentsText: "Googlebot\nBingbot",
            rules: [{ type: "allow", path: "/public/" }],
            crawlDelayInput: "2.5",
          },
        ],
        sitemapsText: "https://example.com/a.xml",
        host: "stored.example.com",
        advanced: true,
      })
    )

    render(<RobotsTxtGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText("User agents") as HTMLTextAreaElement).value
      ).toBe("Googlebot\nBingbot")
    })

    const output = screen.getByLabelText("Output") as HTMLTextAreaElement
    expect(output.value).toContain("Host: stored.example.com")
    expect(output.value).toContain("User-agent: Googlebot")
    expect(output.value).toContain("Allow: /public/")
    expect(output.value).toContain("Crawl-delay: 2.5")
  })
})
