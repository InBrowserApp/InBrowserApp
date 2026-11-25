// @vitest-environment jsdom
import { strFromU8, unzipSync } from "fflate"
import { expect, test } from "vitest"
import type { BookSnapshot } from "./types"
import { writeDocx } from "./write-docx"

const word = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
const png =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDZsAAAAASUVORK5CYII="
const illustration = `data:image/png;base64,${png}`

const book: BookSnapshot = {
  title: "Field Guide",
  author: "E. Reader",
  description: "Native text and structure",
  language: "en-US",
  cover: null,
  missing: false,
  unresolved: false,
  chapters: [
    {
      id: "chapter-1",
      title: "First chapter",
      supporting: false,
      html: `<h1 id="first">First chapter</h1>
        <p>Read <strong>中文花园</strong> and <a href="#chapter-2">jump to chapter two</a>.</p>
        <p lang="ar">الحديقة العربية</p>
        <ol start="3"><li>Plant flowers<ul><li>White blossoms</li></ul></li></ol>
        <p><a href="#plants">Plant table</a>, <a href="#moonflower">Moonflower cell</a>, <a href="#garden">Garden illustration</a>.</p>
        <table id="plants"><tr><th colspan="2">Plant name</th></tr><tr><td id="moonflower">Moonflower</td><td>Evening primrose</td></tr></table>
        <p><img id="garden" src="${illustration}" alt="Garden diagram" /></p>`,
    },
    {
      id: "chapter-2",
      title: "Second chapter",
      supporting: false,
      html: '<p>Follow the <a href="https://example.com/read#notes">reading notes</a>.</p>',
    },
  ],
}

function parse(bytes: Uint8Array) {
  return new DOMParser().parseFromString(strFromU8(bytes), "application/xml")
}

async function unpack(file: Blob) {
  const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
  return unzipSync(new Uint8Array(bytes))
}

test("writes editable Word headings, lists, tables, links and original images", async () => {
  const { file, missing } = await writeDocx(book, new AbortController().signal)
  expect(missing).toBe(false)
  const files = await unpack(file)
  const source = parse(files["word/document.xml"]!)
  const elements = (name: string) =>
    Array.from(source.getElementsByTagNameNS(word, name))
  expect(elements("t").map((node) => node.textContent)).toContain("中文花园")
  expect(
    elements("lang").map((node) => node.getAttributeNS(word, "val"))
  ).toEqual(expect.arrayContaining(["en-US", "ar"]))
  expect(
    elements("pStyle").map((node) => node.getAttributeNS(word, "val"))
  ).toContain("Heading1")
  expect(elements("numPr")).toHaveLength(2)
  expect(elements("tbl")).toHaveLength(1)
  expect(elements("gridSpan")[0]?.getAttributeNS(word, "val")).toBe("2")
  const bookmarks = elements("bookmarkStart").map((node) =>
    node.getAttributeNS(word, "name")
  )
  const links = elements("hyperlink")
  expect(links).toHaveLength(5)
  expect(bookmarks).toEqual(
    expect.arrayContaining(
      links.slice(0, 4).map((node) => node.getAttributeNS(word, "anchor"))
    )
  )
  expect(links[4]?.getAttributeNS(word, "anchor")).toBe("notes")
  expect(strFromU8(files["word/_rels/document.xml.rels"]!)).toContain(
    'Target="https://example.com/read" TargetMode="External"'
  )
  expect(strFromU8(files["docProps/core.xml"]!)).toContain(
    "<dc:creator>E. Reader</dc:creator>"
  )
  const media = Object.entries(files).filter(
    ([name]) => name.startsWith("word/media/") && name.endsWith(".png")
  )
  expect(media).toHaveLength(1)
  expect(media[0]?.[1]).toEqual(
    Uint8Array.from(atob(png), (char) => char.charCodeAt(0))
  )
})

test("keeps alternate text and skips remotely hosted pictures", async () => {
  const { file, missing } = await writeDocx(
    {
      ...book,
      chapters: [
        {
          ...book.chapters[0]!,
          html: '<p>Artwork <img id="garden" src="https://example.com/remote.png" alt="Garden diagram" /></p><p><a href="#garden">Illustration</a></p>',
        },
      ],
    },
    new AbortController().signal
  )
  expect(missing).toBe(true)
  const files = await unpack(file)
  const source = parse(files["word/document.xml"]!)
  expect(source.documentElement.textContent).toContain("Artwork Garden diagram")
  expect(
    source
      .getElementsByTagNameNS(word, "bookmarkStart")[0]
      ?.getAttributeNS(word, "name")
  ).toBe(
    source
      .getElementsByTagNameNS(word, "hyperlink")[0]
      ?.getAttributeNS(word, "anchor")
  )
  expect(strFromU8(files["word/_rels/document.xml.rels"]!)).not.toContain(
    "remote.png"
  )
})
