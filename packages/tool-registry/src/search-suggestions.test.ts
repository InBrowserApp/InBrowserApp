import { afterEach, expect, it, vi } from "vitest"
import { loadToolSearchSuggestions as loadLocale } from "./generated/search-suggestions"
import { loadToolSearchSuggestions } from "./search-suggestions"

vi.mock("./generated/search-suggestions", () => ({
  loadToolSearchSuggestions: vi.fn<typeof loadLocale>(),
}))

const en = { category: "image", slug: "qr", name: "QR Code Generator" }
const simplified = { ...en, name: "二维码生成器" }
const traditional = { ...en, name: "QR Code 產生器" }

afterEach(() => vi.resetAllMocks())

it("loads only the requested index outside the Chinese locales", async () => {
  vi.mocked(loadLocale).mockResolvedValueOnce([en])

  expect(await loadToolSearchSuggestions("en")).toEqual([en])
  expect(loadLocale).toHaveBeenCalledExactlyOnceWith("en")
})

it("matches paired Chinese titles by slug", async () => {
  vi.mocked(loadLocale)
    .mockResolvedValueOnce([traditional])
    .mockResolvedValueOnce([{ ...simplified, slug: "other" }, simplified])

  expect(await loadToolSearchSuggestions("zh-TW")).toEqual([
    { ...traditional, alternateName: simplified.name },
  ])
})

it("preserves primary suggestions when loading the alternate index fails", async () => {
  vi.mocked(loadLocale)
    .mockResolvedValueOnce([simplified])
    .mockRejectedValueOnce(new Error("network error"))

  expect(await loadToolSearchSuggestions("zh-CN")).toEqual([simplified])
})
