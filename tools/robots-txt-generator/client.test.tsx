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
  presetsDescription:
    "Start from a common policy. Applying a preset replaces the current user-agent groups.",
  presetAllowAll: "Allow all",
  presetDisallowAll: "Disallow all",
  presetBlockAdmin: "Block /admin/",
  siteSettings: "Site settings",
  siteSettingsDescription:
    "Add sitemap URLs and optional Host/Crawl-delay directives for crawlers that support them.",
  sitemaps: "Sitemaps",
  sitemapPlaceholder: "https://example.com/sitemap.xml",
  addSitemap: "Add sitemap",
  advancedSettings: "Advanced settings",
  host: "Host (non-standard)",
  hostPlaceholder: "example.com",
  groups: "User-agent groups",
  groupsDescription:
    "Define which crawlers each group targets and which paths they may crawl.",
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
  ruleType: "Rule type",
  ruleAllow: "Allow",
  ruleDisallow: "Disallow",
  rulePath: "Rule path",
  pathPlaceholder: "/path/",
  addRule: "Add rule",
  removeRule: "Remove rule",
  crawlDelay: "Crawl-delay (seconds)",
  crawlDelayPlaceholder: "e.g. 10",
  crawlDelayInvalid: "Enter a non-negative number, or leave it empty.",
  output: "Output",
  outputDescription:
    "Review the generated robots.txt, then copy or download it.",
  copyOutput: "Copy robots.txt",
  copiedOutput: "Copied",
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
    expect(output.value).not.toContain(
      "Sitemap: https://example.com/sitemap.xml"
    )
    expect(screen.getByText(messages.presetsDescription)).toBeTruthy()
    expect(screen.getByText(messages.siteSettingsDescription)).toBeTruthy()
    expect(screen.getByText(messages.groupsDescription)).toBeTruthy()
    expect(screen.getByText(messages.outputDescription)).toBeTruthy()
    expect(screen.getByRole("button", { name: "Copy robots.txt" })).toBeTruthy()
    expect(screen.getByRole("combobox", { name: "Rule type" })).toBeTruthy()
    expect(screen.getByLabelText("Rule path")).toBeTruthy()

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
    fireEvent.change(screen.getByLabelText("Rule path"), {
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

  test("marks invalid crawl delay values without exporting them", () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("switch", { name: "Advanced settings" }))
    fireEvent.change(screen.getByLabelText("Crawl-delay (seconds)"), {
      target: { value: "-1" },
    })

    expect(
      screen
        .getByLabelText("Crawl-delay (seconds)")
        .getAttribute("aria-invalid")
    ).toBe("true")
    expect(screen.getByText(messages.crawlDelayInvalid)).toBeTruthy()

    const output = screen.getByLabelText("Output") as HTMLTextAreaElement
    expect(output.value).not.toContain("Crawl-delay")
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
