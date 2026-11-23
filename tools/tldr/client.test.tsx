// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import TldrClient from "./client"
import { fetchCatalog, fetchPage } from "./core/source"
import messages from "./messages/en.json"

vi.mock("./core/source", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./core/source")>()),
  fetchCatalog: vi.fn(),
  fetchPage: vi.fn(),
}))

const catalog = {
  revision: "test-revision",
  commands: [
    ["git-commit", { common: ["en", "zh"] }],
    ["git-config", { common: ["en"] }],
    ["platform-tool", { linux: ["en"], osx: ["en"] }],
  ],
} as const

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  window.history.replaceState(null, "", "/")
})

it("searches locally and preserves platform and language in a localized result link", async () => {
  window.history.replaceState(null, "", "/zh-CN/tools/tldr/")
  vi.mocked(fetchCatalog).mockResolvedValue(catalog)
  render(<TldrClient lang="zh-CN" messages={messages} />)

  await screen.findByRole("option", { name: "macOS" })
  fireEvent.change(screen.getByLabelText(messages.platform), {
    target: { value: "macos" },
  })
  fireEvent.change(screen.getByLabelText(messages.pageLanguage), {
    target: { value: "en" },
  })
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "Git Co" },
  })
  const result = await screen.findByRole("link", { name: "git-commit" })
  expect((result as HTMLAnchorElement).pathname).toBe("/zh-CN/tools/tldr/")
  expect((result as HTMLAnchorElement).search).toBe(
    "?q=git-commit&os=macos&lang=en"
  )
  expect(fetchPage).not.toHaveBeenCalled()
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "unknown" },
  })
  expect(screen.getByText(messages.noResults)).toBeTruthy()
})

it("opens a shared result, recovers from failures and keeps the preferred language", async () => {
  window.history.replaceState(
    null,
    "",
    "/zh-CN/tools/tldr/?q=git-commit&os=linux"
  )
  vi.mocked(fetchCatalog)
    .mockRejectedValueOnce(new Error())
    .mockResolvedValue(catalog)
  vi.mocked(fetchPage)
    .mockRejectedValueOnce(new Error())
    .mockResolvedValue("# git commit\n\n`git commit {{file}}`")
  render(<TldrClient lang="zh-CN" messages={messages} />)

  expect(await screen.findByText(messages.indexError)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.retry }))
  expect(await screen.findByText(messages.pageError)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: messages.retry }))
  const heading = await screen.findByRole("heading", {
    name: "git commit",
    level: 2,
  })
  expect(heading.closest("article")?.lang).toBe("zh-CN")
  expect(screen.getByText("git commit file")).toBeTruthy()
  expect(
    screen.getByRole("link", { name: messages.source }).getAttribute("href")
  ).toContain("/pages.zh/common/git-commit.md")
  expect(screen.getByRole("button", { name: messages.copyLink })).toBeTruthy()
})

it("offers available platforms when automatic selection is ambiguous", async () => {
  window.history.replaceState(null, "", "/tools/tldr/?q=platform-tool")
  vi.mocked(fetchCatalog).mockResolvedValue(catalog)
  render(<TldrClient lang="en" messages={messages} />)
  const option = await screen.findByRole("link", { name: "macOS" })
  expect((option as HTMLAnchorElement).search).toBe("?q=platform-tool&os=macos")
  expect(fetchPage).not.toHaveBeenCalled()
})
