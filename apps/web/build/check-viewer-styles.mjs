import { glob, readFile } from "node:fs/promises"

const directory = new URL("../dist/", import.meta.url)
const viewerStyles = new Set()
for await (const path of glob("_astro/*.css", { cwd: directory })) {
  const css = await readFile(new URL(path, directory), "utf8")
  if (css.includes(".pdfViewer") || css.includes(".pdf-reader-container")) {
    viewerStyles.add(`/${path}`)
  }
}
if (!viewerStyles.size) throw new Error("PDF viewer stylesheet was not built.")

// Include localized pages and preloads: no page needs PDF styles before a file
// is opened. Match the emitted assets by content rather than their hashed names.
let pages = 0
for await (const path of glob("**/*.html", { cwd: directory })) {
  const html = await readFile(new URL(path, directory), "utf8")
  for (const stylesheet of viewerStyles) {
    if (html.includes(stylesheet)) {
      throw new Error(
        `${path} loads PDF viewer styles before a document opens.`
      )
    }
  }
  pages++
}
console.log(`Verified lazy PDF viewer styles across ${pages} HTML pages.`)
