// @vitest-environment jsdom
import { expect, test } from "vitest"
import { makeBook } from "./book"
import m from "./messages/en.json"

const metadata = { title: "Lantern Field Notes", author: "Fixture Author" }

test("builds an editable chapter when a PDF has no bookmarks", () => {
  const book = makeBook(
    metadata,
    [
      {
        number: 1,
        blocks: [{ kind: "paragraph", text: "Native text & symbols." }],
      },
    ],
    [],
    m,
    String
  )
  expect(book.chapters).toHaveLength(1)
  expect(book.chapters[0]?.title).toBe(metadata.title)
  const doc = new DOMParser().parseFromString(
    book.chapters[0]!.html,
    "text/html"
  )
  expect(doc.querySelector("h1")?.textContent).toBe(metadata.title)
  expect(doc.querySelector("p")?.textContent).toBe("Native text & symbols.")
})

test("preserves distinct chapter and subsection destinations on the same PDF page", () => {
  const book = makeBook(
    metadata,
    [
      {
        number: 1,
        blocks: [
          { kind: "heading", text: "Lanterns at Dusk" },
          { kind: "paragraph", text: "Walk along the river." },
          { kind: "heading", text: "Night Blooms" },
        ],
      },
    ],
    [
      {
        page: 1,
        label: "Lanterns at Dusk",
        children: [{ page: 1, label: "Night Blooms", children: [] }],
      },
    ],
    m,
    String
  )
  const doc = new DOMParser().parseFromString(
    book.chapters[0]!.html,
    "text/html"
  )
  const top = book.contents?.[0]
  const child = top?.subitems?.[0]
  expect(top?.href).not.toBe(child?.href)
  expect(doc.getElementById(top!.href.slice(1))?.textContent).toBe(
    "Lanterns at Dusk"
  )
  expect(doc.getElementById(child!.href.slice(1))?.textContent).toBe(
    "Night Blooms"
  )
})
