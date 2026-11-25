import { beforeEach, expect, test, vi } from "vitest"
import { prepareBook } from "./prepare-book"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({
  openBook: vi.fn(),
  snapshotBook: vi.fn(),
  dispose: vi.fn(),
}))
vi.mock("@workspace/ebook", () => ({
  openEbook: mock.openBook,
  snapshotBook: mock.snapshotBook,
}))

const snapshot = {
  title: "Test & notes",
  author: "Author",
  language: "ar",
  chapters: [
    {
      id: "ebook-chapter-0",
      title: "First chapter",
      html: '<section dir="rtl"><details><summary>Notes</summary><p>Some more text</p></details><img loading="lazy" src="data:image/png;base64,YQ==" alt="Picture"></section>',
      supporting: false,
    },
  ],
  cover: null,
  missing: true,
  unresolved: false,
}

beforeEach(() => {
  vi.resetAllMocks()
  mock.openBook.mockResolvedValue({ dispose: mock.dispose })
  mock.snapshotBook.mockResolvedValue(snapshot)
})

test("prepares an isolated, printable book with expandable content and chapter direction", async () => {
  const file = new File(["book"], "book.epub")
  const signal = new AbortController().signal
  const { html, missing } = await prepareBook(file, signal, m, "en")
  const doc = new DOMParser().parseFromString(html, "text/html")
  expect(mock.openBook).toHaveBeenCalledWith(file, signal, {
    preserveMissingImages: true,
  })
  expect(doc.querySelector("header h1")?.textContent).toBe(snapshot.title)
  expect(doc.documentElement.lang).toBe("ar")
  expect(doc.querySelector("#ebook-chapter-0")?.getAttribute("dir")).toBe(
    "auto"
  )
  expect(doc.querySelector("section section")?.getAttribute("dir")).toBe("rtl")
  expect(doc.querySelector("details")?.hasAttribute("open")).toBe(true)
  expect(doc.querySelector("img")?.hasAttribute("loading")).toBe(false)
  expect(doc.querySelector("#paper-size")?.tagName).toBe("STYLE")
  expect(
    doc
      .querySelector('meta[http-equiv="Content-Security-Policy"]')
      ?.getAttribute("content")
  ).toContain("script-src 'none'")
  expect(missing).toBe(true)
  expect(mock.dispose).toHaveBeenCalledOnce()
})

test("uses the page locale without a book language and releases the book on failure", async () => {
  const file = new File(["book"], "book.epub")
  const signal = new AbortController().signal
  mock.snapshotBook.mockResolvedValueOnce({ ...snapshot, language: undefined })
  expect((await prepareBook(file, signal, m, "zh-CN")).html).toContain(
    'lang="zh-CN"'
  )
  mock.snapshotBook.mockRejectedValueOnce(new Error("incomplete"))
  await expect(prepareBook(file, signal, m, "en")).rejects.toThrow("incomplete")
  expect(mock.dispose).toHaveBeenCalledTimes(2)
})

test("prints FB2 text and internal note targets with missing illustrations identified", async () => {
  const file = new File(["book"], "book.fb2.zip")
  const signal = new AbortController().signal
  const book = { dispose: mock.dispose }
  mock.openBook.mockResolvedValueOnce(book)
  mock.snapshotBook.mockResolvedValueOnce({
    ...snapshot,
    language: "ru",
    chapters: [
      {
        ...snapshot.chapters[0]!,
        html: '<p>Стихотворение <a href="#note">1</a></p><p id="note">Примечание</p>',
      },
    ],
  })
  const { html } = await prepareBook(file, signal, m, "en")
  const doc = new DOMParser().parseFromString(html, "text/html")
  expect(mock.openBook).toHaveBeenCalledWith(file, signal, {
    preserveMissingImages: true,
  })
  expect(doc.documentElement.lang).toBe("ru")
  expect(doc.querySelector('a[href="#note"]')?.textContent).toBe("1")
  expect(doc.querySelector("#note")?.textContent).toBe("Примечание")
  expect(doc.body.textContent).toContain("Стихотворение")
  expect(mock.dispose).toHaveBeenCalledOnce()
})
