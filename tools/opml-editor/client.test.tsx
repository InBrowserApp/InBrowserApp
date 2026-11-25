// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const { downloadBlob } = vi.hoisted(() => ({ downloadBlob: vi.fn() }))
vi.mock("@workspace/ui/lib/download-blob", () => ({ downloadBlob }))

beforeEach(() => {
  vi.stubGlobal("matchMedia", () => ({ matches: true }))
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test("creates a folder and feed and exports the current outline", () => {
  render(<Client messages={m} />)
  fireEvent.change(screen.getByLabelText(m.title), {
    target: { value: "Reading / list" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.addFolder }))
  fireEvent.change(screen.getByLabelText(m.itemName), {
    target: { value: "Science" },
  })
  fireEvent.click(screen.getByRole("button", { name: m.addFeed }))
  expect(screen.getByText(m.feedRequired)).toBeTruthy()
  expect(screen.getByRole("button", { name: m.download })).toHaveProperty(
    "disabled",
    true
  )
  fireEvent.change(screen.getByLabelText(m.itemName), {
    target: { value: "New lab blog" },
  })
  fireEvent.change(screen.getByLabelText(m.feedUrl), {
    target: { value: "https://example.test/feed" },
  })
  const list = screen.getByRole("list", { name: m.outline })
  expect(
    within(list).getByRole("button", { name: "New lab blog" })
  ).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  expect(downloadBlob).toHaveBeenCalledWith(
    expect.any(Blob),
    "Reading _ list.opml"
  )
})

test("keeps the outline on a bad paste and restores a deleted folder with its subtree", () => {
  render(<Client messages={m} />)
  fireEvent.click(screen.getByRole("button", { name: m.sample }))
  fireEvent.click(screen.getByRole("button", { name: m.paste }))
  const dialog = screen.getByRole("dialog", { name: m.pasteTitle })
  fireEvent.change(within(dialog).getByRole("textbox"), {
    target: { value: "<opml/>" },
  })
  fireEvent.click(within(dialog).getByRole("button", { name: m.import }))
  expect(within(dialog).getByText(m.invalid)).toBeTruthy()
  fireEvent.click(within(dialog).getByRole("button", { name: m.cancel }))
  fireEvent.click(screen.getByRole("button", { name: "Technology" }))
  fireEvent.click(screen.getByRole("button", { name: m.remove }))
  expect(screen.queryByRole("button", { name: "Hacker News" })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.undo }))
  expect(screen.getByRole("button", { name: "Hacker News" })).toBeTruthy()
})
