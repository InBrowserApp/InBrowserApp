import { unzipSync } from "fflate"
import type { SaxesTagNS } from "saxes"
import { ConversionError, failure } from "./errors"
import { attribute, ns, packagePath, readXml } from "./xml"
import { imageResource } from "./images"

const textMime = "application/vnd.oasis.opendocument.text"
const isImage = (tag: SaxesTagNS) =>
  (tag.uri === ns.draw && ["image", "fill-image"].includes(tag.local)) ||
  (tag.uri === ns.style && tag.local === "background-image") ||
  (tag.uri === ns.text && tag.local === "list-level-style-image")

export function preflight(input: ArrayBuffer) {
  try {
    const names = new Set<string>()
    const files = unzipSync(new Uint8Array(input), {
      filter: ({ name }) => {
        if (
          names.has(name) ||
          // Control characters and noncanonical paths must not disagree with
          // the native package reader about which entry is being validated.
          // oxlint-disable-next-line no-control-regex
          /[\\\u0000-\u001f]|^\/|(?:^|\/)\.{1,2}(?:\/|$)/.test(name)
        )
          throw new ConversionError("invalid")
        names.add(name)
        return true
      },
    })
    const manifest = files["META-INF/manifest.xml"]
    if (!manifest || !files["content.xml"]) throw new ConversionError("invalid")
    let rootMime = ""
    readXml(manifest, (tag) => {
      if (tag.uri !== ns.manifest) return
      if (tag.local === "encryption-data")
        throw new ConversionError("protected")
      if (tag.local !== "file-entry") return
      const path = attribute(tag, ns.manifest, "full-path")
      if (path === "/")
        rootMime = attribute(tag, ns.manifest, "media-type") ?? ""
      else if (path && !path.endsWith("/") && !files[path]?.length)
        throw new ConversionError("unsupported")
    })
    const mime = files.mimetype
      ? new TextDecoder().decode(files.mimetype).trim()
      : rootMime
    if (![textMime, `${textMime}-template`].includes(mime))
      throw new ConversionError("invalid")
    if (rootMime !== mime) throw new ConversionError("invalid")
    let body = false
    const resources = new Set<string>()
    const images: Blob[] = []
    const checkImage = (bytes: Uint8Array) => {
      const image = imageResource(bytes)
      if (image) images.push(image)
    }
    for (const path of ["content.xml", "styles.xml", "settings.xml"]) {
      if (!files[path]) continue
      let image: { reference?: string; inline: string } | undefined
      let binary = false
      const ancestry: { uri: string; local: string }[] = []
      readXml(
        files[path],
        (tag) => {
          if (
            path === "content.xml" &&
            ancestry.length === 0 &&
            (tag.uri !== ns.office || tag.local !== "document-content")
          )
            throw new ConversionError("invalid")
          if (
            path === "content.xml" &&
            ancestry.length === 2 &&
            ancestry[1]!.uri === ns.office &&
            ancestry[1]!.local === "body" &&
            tag.uri === ns.office &&
            tag.local === "text"
          )
            body = true
          ancestry.push(tag)
          if (
            (tag.uri === ns.draw &&
              [
                "object",
                "object-ole",
                "plugin",
                "applet",
                "floating-frame",
              ].includes(tag.local)) ||
            (tag.uri === ns.text && tag.local === "section-source")
          )
            throw new ConversionError("unsupported")
          const href = attribute(tag, ns.xlink, "href")
          const hyperlink =
            [ns.text, ns.draw].includes(tag.uri) && tag.local === "a"
          if (
            hyperlink &&
            href &&
            /^\s*(?:javascript|data|macro|vnd\.sun\.star\.script):/i.test(href)
          )
            throw new ConversionError("unsupported")
          if (href && !hyperlink) {
            const resolved = packagePath(href, path)
            if (!files[resolved]?.length)
              throw new ConversionError("unsupported")
            if (!resources.has(resolved) && isImage(tag)) {
              checkImage(files[resolved])
              resources.add(resolved)
            }
          }
          if (isImage(tag)) image = { reference: href, inline: "" }
          if (tag.uri === ns.office && tag.local === "binary-data")
            binary = true
        },
        (tag) => {
          ancestry.pop()
          if (tag.uri === ns.office && tag.local === "binary-data")
            binary = false
          if (!isImage(tag)) return
          if (image && !image.reference) {
            // ODF uses an empty background-image to clear an inherited image.
            if (
              tag.uri === ns.style &&
              tag.local === "background-image" &&
              !image.inline.trim()
            ) {
              image = undefined
              return
            }
            const bytes = Uint8Array.from(atob(image.inline), (char) =>
              char.charCodeAt(0)
            )
            if (!bytes.length) throw new ConversionError("unsupported")
            checkImage(bytes)
          }
          image = undefined
        },
        (value) => {
          if (image && binary) image.inline += value
        }
      )
    }
    if (!body) throw new ConversionError("invalid")
    return { images }
  } catch (error) {
    throw failure(error)
  }
}
