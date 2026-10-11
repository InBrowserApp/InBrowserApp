// @vitest-environment jsdom
import { expect, test } from "vitest"
import { ebookDocument } from "./document"
import m from "../messages/en.json"

test("builds UTF-8 reading copies with local navigation, supporting sections and disclosed limitations", async () => {
  const result = ebookDocument(
    {
      title: "<世界>",
      author: "Author",
      description: undefined,
      cover: null,
      missing: true,
      unresolved: true,
      chapters: [
        {
          id: "one",
          title: "First",
          supporting: false,
          html: '<h2>First</h2><p>Hello <a href="#note">note</a> <a href="https://example.com/" rel="noopener noreferrer" target="_blank">Visit</a></p>',
        },
        {
          id: "two",
          title: "Second",
          supporting: false,
          html: "<p>Second body</p>",
        },
        {
          id: "notes",
          title: "Footnotes",
          supporting: true,
          html: '<p id="note">Footnote 世界</p>',
        },
        {
          id: "more",
          title: "More notes",
          supporting: true,
          html: "<h2>More</h2><p>Last note</p>",
        },
      ],
    },
    m
  )
  const doc = new DOMParser().parseFromString(
    await result.file.text(),
    "text/html"
  )
  expect(doc.title).toBe("<世界>")
  expect(doc.querySelectorAll("nav li")).toHaveLength(4)
  expect(
    doc.body.textContent!.match(/Notes and supporting sections/g)
  ).toHaveLength(1)
  expect(doc.querySelectorAll("h2")).toHaveLength(6)
  for (const a of doc.querySelectorAll('a[href^="#"]'))
    expect(doc.getElementById(a.getAttribute("href")!.slice(1))).not.toBeNull()
  expect(doc.querySelector("script,[data-web-link]")).toBeNull()
  expect(doc.head.firstElementChild!.getAttribute("content")).toContain(
    "default-src 'none'"
  )
  expect(result.preview.html).toContain('data-web-link="#note"')
  expect(result.preview.html).not.toContain(m.safePreview)
  expect(result.text).toContain("Visit (https://example.com/)")
  expect(result.text.indexOf("Second body")).toBeLessThan(
    result.text.indexOf("Footnote 世界")
  )
  expect(result.text).not.toContain("<h2>")
  expect(result.text).not.toContain(m.contents)
  expect(result.text.match(/Second\n/g)).toHaveLength(1)
  expect(result.notes).toEqual([
    m.styleNotice,
    m.safePreview,
    m.missingResources,
    m.unresolvedLinks,
  ])
  expect(doc.body.textContent).toContain(m.missingResources)
  expect(result.file.type).toBe("text/html;charset=utf-8")
  expect(await result.textFile.text()).toBe(result.text)
})
test("supports a book without author or compatibility notes", () => {
  const result = ebookDocument(
    {
      title: "Book",
      author: "",
      description: undefined,
      cover: null,
      missing: false,
      unresolved: false,
      chapters: [
        {
          id: "one",
          title: "Reading",
          html: "<h2>Reading</h2><p>Book text</p>",
          supporting: false,
        },
      ],
    },
    m
  )
  expect(result.notes).toEqual([m.styleNotice, m.safePreview])
  expect(result.text).toContain("Book text")
})

test("retains a metadata cover without duplicating an existing chapter image", async () => {
  const book = {
    title: "Book",
    author: "",
    description: undefined,
    cover: "data:image/png;base64,AA==",
    missing: false,
    unresolved: false,
    chapters: [
      {
        id: "one",
        title: "Reading",
        html: "<h2>Reading</h2>",
        supporting: false,
      },
    ],
  }
  let doc = new DOMParser().parseFromString(
    await ebookDocument(book, m).file.text(),
    "text/html"
  )
  expect(doc.querySelectorAll("img")).toHaveLength(1)
  expect(doc.querySelector("header img")!.getAttribute("alt")).toBe("Book")
  book.chapters[0]!.html += '<img src="data:image/png;base64,AA==" alt="Cover">'
  doc = new DOMParser().parseFromString(
    await ebookDocument(book, m).file.text(),
    "text/html"
  )
  expect(doc.querySelectorAll("img")).toHaveLength(1)
  expect(doc.querySelector("header img")).toBeNull()
})
