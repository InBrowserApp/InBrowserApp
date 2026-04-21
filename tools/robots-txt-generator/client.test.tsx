import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RobotsTxtGeneratorClient from "./client"

const createObjectURL = vi.fn(() => "blob:robots-preview")
const revokeObjectURL = vi.fn()

const messages = {
  meta: {
    name: "robots.txt Generator",
    description:
      "Generate robots.txt files with user-agent rules, allow/disallow paths, and sitemap links.",
  },
  securityNoticeTitle: "Robots.txt is not security",
  securityNotice:
    "Robots.txt is public and does not block access. Use server-side access control for sensitive content.",
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
  crawlDelay: "Crawl-delay (seconds)",
  crawlDelayPlaceholder: "e.g. 10",
  output: "Output",
  outputDescription:
    "Review, copy, or download the generated `robots.txt` file.",
  download: "Download robots.txt",
  emptyOutput: "No content to export yet.",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

const zhMessages = {
  ...messages,
  meta: {
    name: "robots.txt 生成器",
    description:
      "生成 robots.txt 文件，包含 User-agent 规则、Allow/Disallow 路径和 Sitemap 链接。",
  },
  presetAllowAll: "允许全部",
  presetDisallowAll: "禁止全部",
  presetBlockAdmin: "屏蔽 /admin/",
  siteSettings: "站点设置",
  output: "输出",
  outputDescription: "查看、复制或下载生成的 `robots.txt` 文件。",
} as const

beforeEach(() => {
  vi.stubGlobal("URL", {
    createObjectURL,
    revokeObjectURL,
  })
})

afterEach(() => {
  cleanup()
  createObjectURL.mockClear()
  revokeObjectURL.mockClear()
  vi.unstubAllGlobals()
})

describe("RobotsTxtGeneratorClient", () => {
  test("renders the default output and download link", () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    const output = screen.getByRole("region", { name: messages.output })
    expect(output.textContent).toContain("User-agent: *")
    expect(output.textContent).toContain("Disallow: /admin/")
    expect(output.textContent).toContain(
      "Sitemap: https://example.com/sitemap.xml"
    )
    expect(
      screen.getByRole("link", { name: messages.download }).getAttribute("href")
    ).toBe("blob:robots-preview")
  })

  test("applies presets and user-agent presets", async () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.presetDisallowAll })
    )

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: messages.output }).textContent
      ).toContain("Disallow: /")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.presetSearchEngines })
    )

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: messages.output }).textContent
      ).toContain("User-agent: Googlebot")
    })
  })

  test("shows advanced directives when enabled", async () => {
    render(<RobotsTxtGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("switch", { name: messages.advancedSettings })
    )
    fireEvent.change(screen.getByLabelText(messages.host), {
      target: { value: "example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.crawlDelay), {
      target: { value: "2.5" },
    })

    await waitFor(() => {
      const output = screen.getByRole("region", { name: messages.output })
      expect(output.textContent).toContain("Host: example.com")
      expect(output.textContent).toContain("Crawl-delay: 2.5")
    })
  })

  test("localizes visible labels in zh-CN", () => {
    render(<RobotsTxtGeneratorClient messages={zhMessages} />)

    expect(
      screen.getByRole("button", { name: zhMessages.presetAllowAll })
    ).toBeTruthy()
    expect(screen.getByText(zhMessages.siteSettings)).toBeTruthy()
    expect(screen.getAllByText(zhMessages.output).length).toBeGreaterThan(0)
  })
})
