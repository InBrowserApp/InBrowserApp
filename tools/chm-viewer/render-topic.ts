import {
  assertChmSvgSourceSafety,
  decodeChmText,
  sanitizeChmCss,
  sanitizeChmHtmlDocument,
} from "@file-viewer/renderer-chm/security"

const assetTypes: Record<string, string> = {
  avif: "image/avif",
  bmp: "image/bmp",
  gif: "image/gif",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
  otf: "font/otf",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
}

const cssResource = /url\("chm-internal:([^"]+)"\)/g
const resourceAttributes = [
  ["img", "src"],
  ["video", "poster"],
  ["body, table, td, th", "background"],
] as const

export async function renderTopic({
  path,
  encoding,
  lookup,
  read,
  signal,
}: {
  path: string
  encoding: string
  lookup: (path: string) => string | undefined
  read: (path: string) => Promise<Uint8Array>
  signal: AbortSignal
}) {
  const source = decodeChmText(await read(path), encoding)
  signal.throwIfAborted()
  const { document, title } = sanitizeChmHtmlDocument(source, path, false)
  const objectUrls = new Map<string, Promise<string>>()

  function resource(reference: string, stylesheet = false): Promise<string> {
    const entry = lookup(reference)
    const extension = entry?.split(".").at(-1)?.toLowerCase() ?? ""
    const type = stylesheet
      ? extension === "css" && "text/css;charset=utf-8"
      : Object.hasOwn(assetTypes, extension) && assetTypes[extension]
    if (!entry || !type) return Promise.resolve("")

    let url = objectUrls.get(entry)
    if (!url) {
      url = createResource(entry, type).catch((error: unknown) => {
        if (signal.aborted) throw error
        return ""
      })
      objectUrls.set(entry, url)
    }
    return url
  }

  async function createResource(entry: string, type: string) {
    const bytes = await read(entry)
    signal.throwIfAborted()
    let body: BlobPart = new Uint8Array(bytes).buffer
    if (type.startsWith("text/css")) {
      const { css } = sanitizeChmCss(decodeChmText(bytes, encoding), entry)
      body = await replaceCssResources(css)
      signal.throwIfAborted()
    } else if (type === "image/svg+xml") {
      assertChmSvgSourceSafety(decodeChmText(bytes, "utf-8"))
    }
    return URL.createObjectURL(new Blob([body], { type }))
  }

  async function replaceCssResources(css: string) {
    const paths = new Set(
      Array.from(css.matchAll(cssResource), ([, value]) => value!)
    )
    const replacements = new Map(
      await Promise.all(
        Array.from(
          paths,
          async (value) =>
            [value, await resource(decodeURIComponent(value))] as const
        )
      )
    )
    return css.replace(
      cssResource,
      (_, value: string) => `url("${replacements.get(value) ?? ""}")`
    )
  }

  async function restoreAttribute(element: Element, attribute: string) {
    const value = element.getAttribute(`data-chm-resource-${attribute}`)!
    const url = await resource(value, attribute === "href")
    if (url) element.setAttribute(attribute, url)
  }

  function dispose() {
    for (const url of objectUrls.values()) {
      void url.then(
        (value) => {
          if (value) URL.revokeObjectURL(value)
        },
        () => {}
      )
    }
    objectUrls.clear()
  }

  try {
    const tasks = resourceAttributes.flatMap(([selectors, attribute]) =>
      Array.from(document.querySelectorAll(selectors), (element) =>
        element.hasAttribute(`data-chm-resource-${attribute}`)
          ? restoreAttribute(element, attribute)
          : undefined
      )
    )
    for (const element of document.querySelectorAll(
      'link[rel~="stylesheet" i][data-chm-resource-href]'
    )) {
      tasks.push(restoreAttribute(element, "href"))
    }
    for (const element of document.querySelectorAll("style")) {
      tasks.push(
        replaceCssResources(element.textContent ?? "").then((css) => {
          // Keep CSS raw text inside its style element when srcdoc is parsed.
          element.textContent = css.replace(/<(?=\/style)/gi, "\\3c ")
        })
      )
    }
    for (const element of document.querySelectorAll("[style]")) {
      tasks.push(
        replaceCssResources(element.getAttribute("style")!).then((css) => {
          element.setAttribute("style", css)
        })
      )
    }
    await Promise.all(tasks)
    signal.throwIfAborted()
    for (const link of document.querySelectorAll("a, area")) {
      if (link.getAttribute("href") === "#") {
        link.setAttribute("role", "link")
        link.setAttribute("tabindex", "0")
      }
      link.removeAttribute("href")
      link.removeAttribute("target")
      link.removeAttribute("download")
      if (link.getAttribute("aria-disabled") === "true")
        link.removeAttribute("title")
    }
    for (const node of document.querySelectorAll(
      "math [href], math [xlink\\:href], math[href], math[xlink\\:href]"
    )) {
      node.removeAttribute("href")
      node.removeAttributeNS("http://www.w3.org/1999/xlink", "href")
    }
    const viewport = document.createElement("meta")
    viewport.name = "viewport"
    viewport.content = "width=device-width, initial-scale=1"
    document.head.append(viewport)

    const style = document.createElement("style")
    style.textContent =
      "body{padding:clamp(16px,3vw,32px)}img{height:auto}[role=link]{color:LinkText;text-decoration:underline;cursor:pointer}a[aria-disabled=true]{text-decoration:none}"
    document.head.append(style)
    return {
      html: `<!doctype html>${document.documentElement.outerHTML}`,
      title,
      dispose,
    }
  } catch (error) {
    dispose()
    throw error
  }
}

export type RenderedTopic = Awaited<ReturnType<typeof renderTopic>>
