import { expect, test } from "vitest"
import {
  createPptxThumbnailRenderer,
  type PresentationDocument,
  type SlideNode,
} from "@extend-ai/react-pptx"

const raster =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6GXsAAAAASUVORK5CYII="

test.each(["contain", "fill", "crop"] as const)(
  "serializes embedded %s pictures as SVG images without changing their box",
  async (fit) => {
    const node: SlideNode = {
      id: "picture",
      type: "image",
      assetId: "raster",
      transform: { x: 0, y: 0, width: 952500, height: 952500 },
      preserveAspectRatio: fit !== "fill",
      ...(fit === "crop"
        ? { crop: { left: 0.25, right: 0.25, top: 0, bottom: 0 } }
        : {}),
    }
    const document: PresentationDocument = {
      format: "ppt",
      size: { widthEmu: 952500, heightEmu: 952500 },
      slides: [{ id: "slide", index: 0, nodes: [node] }],
      masters: [],
      layouts: [],
      themes: [],
      assets: {
        raster: {
          id: "raster",
          contentType: "image/png",
          byteLength: 68,
          url: raster,
        },
      },
      warnings: [],
    }
    const renderer = createPptxThumbnailRenderer(
      { kind: "parsed-presentation", document, warnings: [] },
      { fonts: { waitForFonts: false, reportMissingFonts: false } }
    )
    try {
      for (const maxWidth of [254, 296]) {
        const result = await renderer.renderSlide(0, {
          output: "svg",
          maxWidth,
        })
        const snapshot = new DOMParser().parseFromString(
          result.data,
          "image/svg+xml"
        )
        expect(snapshot.querySelector("img")).toBeNull()
        const image = snapshot.querySelector("image")!
        expect(image.namespaceURI).toBe("http://www.w3.org/2000/svg")
        expect(image.getAttribute("href")).toBe(raster)
        expect(image.getAttribute("preserveAspectRatio")).toBe(
          fit === "contain" ? "xMidYMid meet" : "none"
        )
        const box = image.parentElement!
        expect(box.getAttribute("style")).toContain(
          fit === "crop" ? "width: 200%" : "width: 100%"
        )
        if (fit === "crop") {
          expect(box.getAttribute("style")).toContain("left: -50%")
        }
      }
    } finally {
      renderer.destroy()
    }
  }
)
