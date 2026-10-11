import { prepareWebDocument } from "@workspace/web-document"
import type { bookImages } from "./resources"

export async function cleanChapter(
  doc: Document,
  images: ReturnType<typeof bookImages>,
  imageUnavailable: string
) {
  doc
    .querySelectorAll(
      "style,link,script,form,iframe,object,embed,audio,video,canvas,template"
    )
    .forEach((node) => node.remove())
  for (const element of doc.querySelectorAll("*")) {
    element.removeAttribute("style")
    element.removeAttribute("class")
    element.removeAttribute("hidden")
  }
  // Keep a readable equation fallback instead of silently dropping MathML text.
  for (const math of doc.querySelectorAll("math"))
    math.replaceWith(doc.createTextNode(math.textContent || ""))
  for (const svg of doc.querySelectorAll("svg")) {
    const image = doc.createElement("img")
    image.alt = svg.querySelector("title")?.textContent || ""
    image.src =
      "data:image/svg+xml;charset=utf-8," +
      encodeURIComponent(new XMLSerializer().serializeToString(svg))
    if (svg.id) image.id = svg.id
    svg.replaceWith(image)
  }
  // The HTML sanitizer deliberately rejects SVG. Restore only our validated
  // static image URLs after sanitizing, using unpredictable placeholder values.
  const embedded = new Map<string, string>()
  for (const image of doc.querySelectorAll("img")) {
    const url = await images.embed(image.getAttribute("src") || "")
    image.removeAttribute("srcset")
    image.removeAttribute("width")
    image.removeAttribute("height")
    if (url) {
      const token = `data:image/png;base64,${crypto.randomUUID()}`
      embedded.set(token, url)
      image.setAttribute("src", token)
    } else {
      const placeholder = doc.createElement("p")
      placeholder.textContent = [image.alt, imageUnavailable]
        .filter(Boolean)
        .join(" · ")
      if (image.id) placeholder.id = image.id
      image.replaceWith(placeholder)
    }
  }
  const clean = prepareWebDocument(doc.documentElement.outerHTML, {
    emptyText: "",
    headingText: "",
    print: true,
    links: "direct",
  })
  const result = document.implementation.createHTMLDocument("")
  result.documentElement.innerHTML = clean.html
  for (const image of result.querySelectorAll("img")) {
    const url = embedded.get(image.getAttribute("src") || "")
    if (url) image.setAttribute("src", url)
  }
  for (const attribute of ["lang", "dir"]) {
    const value = doc.body.getAttribute(attribute)
    if (value) result.body.setAttribute(attribute, value)
  }
  return result.body
}
