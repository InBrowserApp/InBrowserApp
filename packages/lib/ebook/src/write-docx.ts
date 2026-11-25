import { Document as WordDocument, Packer } from "docx"
import { htmlToContent } from "docx/html"
import { imagePng } from "./image-png"
import { languageTag } from "./language"
import type { BookSnapshot } from "./types"

// Word can use these source images without a raster conversion.
const nativeImage = /^data:image\/(?:png|jpeg|gif|bmp);base64,/i
const convertedImage =
  /^(?:data:image\/(?:avif|webp);base64,|data:image\/svg\+xml;charset=utf-8,)/i

function preserveBookmarkTargets(doc: Document) {
  // docx/html handles these elements directly, skipping their IDs.
  for (const target of doc.querySelectorAll(
    ":is(img,svg,math,br,wbr,hr,q,rt,table,thead,tbody,tfoot,tr,colgroup,col,td,th,caption)[id]"
  )) {
    const anchor = doc.createElement("span")
    anchor.id = target.id
    target.removeAttribute("id")
    let container: Element | null = null
    let sibling = target
    if (target.matches("q,rt,td,th,caption")) {
      container = target
    } else if (target.matches("table,thead,tbody,tfoot,tr,colgroup,col")) {
      sibling = target.closest("table") ?? target
      container =
        target.querySelector("td,th") ?? sibling.querySelector("td,th")
    }
    if (container) {
      const paragraph = container.querySelector(":scope > p") ?? container
      paragraph.prepend(anchor)
    } else {
      sibling.before(anchor)
    }
  }
}

export async function writeDocx(book: BookSnapshot, signal: AbortSignal) {
  signal.throwIfAborted()
  const doc = document.implementation.createHTMLDocument("")
  const language = languageTag(book.language)
  if (language) doc.body.lang = language
  for (const chapter of book.chapters) {
    const section = doc.createElement("section")
    section.id = chapter.id
    section.innerHTML = chapter.html
    if (!section.querySelector("h1,h2,h3,h4,h5,h6")) {
      const heading = doc.createElement("h1")
      heading.textContent = chapter.title
      section.prepend(heading)
    }
    doc.body.append(section)
  }
  if (
    book.cover &&
    !Array.from(doc.querySelectorAll("img")).some(
      (image) => image.getAttribute("src") === book.cover
    )
  ) {
    const cover = doc.createElement("img")
    cover.setAttribute("src", book.cover)
    cover.alt = book.title
    doc.body.prepend(cover)
  }
  preserveBookmarkTargets(doc)

  const converted = new Map<string, string | null>()
  const assets = new Map<string, Uint8Array>()
  let missing = false
  for (const image of doc.querySelectorAll("img")) {
    signal.throwIfAborted()
    const source = image.getAttribute("src") || ""
    if (nativeImage.test(source)) continue
    let path = converted.get(source)
    if (path === undefined) {
      path = null
      if (convertedImage.test(source)) {
        try {
          const png = await imagePng(source, signal)
          path = `epub-image-${assets.size}.png`
          assets.set(path, new Uint8Array(await png.arrayBuffer()))
        } catch (reason) {
          signal.throwIfAborted()
          if (reason instanceof RangeError) throw reason
          path = null
        }
      }
      converted.set(source, path)
    }
    if (path) image.setAttribute("src", path)
    else {
      missing = true
      image.replaceWith(image.alt)
    }
  }
  signal.throwIfAborted()
  const children = htmlToContent(doc.body.outerHTML, {
    images: (source) => assets.get(source),
    onWarning: ({ code }) => {
      if (
        code === "missing-image" ||
        code === "unsupported-image" ||
        code === "unsupported-element"
      )
        missing = true
    },
  })
  if (!children.length) throw new Error("empty")
  const output = await Packer.toBlob(
    new WordDocument({
      title: book.title,
      creator: book.author,
      description: book.description,
      sections: [{ children }],
    })
  )
  signal.throwIfAborted()
  return { file: output, missing }
}
