import { buildBinaryPlist } from "rork-plist"

export function sampleArchive() {
  const encoder = new TextEncoder()
  const html =
    '<!doctype html><html lang="en"><head><title>Saturday Market</title><link rel="stylesheet" href="market.css"></head><body><main><p class="byline">THE NEIGHBORHOOD NOTEBOOK</p><h1>Saturday at the market</h1><p>Fresh pears, purple flowers, and handwritten signs filled the stalls this morning.</p><p>This sample page and its stylesheet were saved together in a WebArchive file.</p></main></body></html>'
  const css =
    "body { background: #faf5e9; color: #282433; } main { margin: 2rem auto; max-width: 38rem; } h1 { font: bold 2.25rem Georgia, serif; } .byline { color: #774c6d; font-size: .75rem; font-weight: 700; letter-spacing: .1em; }"
  const bytes = buildBinaryPlist({
    WebMainResource: {
      WebResourceURL: "https://example.org/market/",
      WebResourceMIMEType: "text/html",
      WebResourceTextEncodingName: "UTF-8",
      WebResourceData: encoder.encode(html),
    },
    WebSubresources: [
      {
        WebResourceURL: "https://example.org/market/market.css",
        WebResourceMIMEType: "text/css",
        WebResourceData: encoder.encode(css),
      },
    ],
  })
  return new File([new Uint8Array(bytes)], "saturday-market.webarchive")
}
