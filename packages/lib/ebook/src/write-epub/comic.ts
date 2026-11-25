import { writePublication } from "./archive"
import { EPUB, element, serialize, xhtml } from "./xml"

export type ComicEpubPage = {
  image: Blob
  width: number
  height: number
  label: string
}

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
}
const style =
  "body.comic-page{margin:0;background:white}body.comic-page img{display:block;width:100%;height:auto}"
const xhtmlType = "application/xhtml+xml"

export function writeComicEpub(
  title: string,
  pages: AsyncIterable<ComicEpubPage>,
  signal: AbortSignal,
  { contents, language }: { contents: string; language: string }
) {
  return writePublication(
    { title },
    "und",
    signal,
    async (add) => {
      const nav = xhtml(contents, language)
      const toc = element(nav.doc, "nav")
      toc.setAttributeNS(EPUB, "epub:type", "toc")
      const list = element(nav.doc, "ol")
      toc.append(element(nav.doc, "h1", {}, contents), list)
      nav.body.append(toc)

      let number = 0
      for await (const { image, width, height, label } of pages) {
        const id = `page-${++number}`
        const href = `${id}.xhtml`
        const source = `images/${id}.${extensions[image.type]}`
        const { doc, head, body } = xhtml(label, language)
        head.append(
          element(doc, "meta", {
            name: "viewport",
            content: `width=${width}, height=${height}`,
          })
        )
        body.setAttribute("class", "comic-page")
        body.append(
          element(doc, "img", {
            src: source,
            width: String(width),
            height: String(height),
            alt: label,
          })
        )
        await add(source, image, {
          id: `image-${number}`,
          media: image.type,
          properties: number === 1 ? "cover-image" : undefined,
        })
        await add(href, serialize(doc), { id, media: xhtmlType, linear: true })

        const item = element(nav.doc, "li")
        item.append(element(nav.doc, "a", { href }, label))
        list.append(item)
      }
      await add("nav.xhtml", serialize(nav.doc), {
        id: "nav",
        media: xhtmlType,
        properties: "nav",
      })
      await add("style.css", style, { id: "style", media: "text/css" })
    },
    true
  )
}
