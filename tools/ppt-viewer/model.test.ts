import { expect, test } from "vitest"
import type { PresentationDocument } from "@extend-ai/react-pptx"
import { preparePresentation, presentationError } from "./model"

test("uses embedded raster/metafile bytes only and extracts plain text recursively", () => {
  const data = new Uint8Array([1])
  const doc = {
    assets: {
      image: {
        data,
        contentType: "image/png",
        url: "https://evil.invalid/image",
      },
      vector: { data, contentType: "image/svg+xml" },
      remote: { contentType: "image/jpeg", url: "https://evil.invalid/track" },
      font: { data, contentType: "font/ttf" },
      emf: { data, contentType: "image/x-emf" },
    },
    embeddedFonts: [{ family: "External", assetId: "font" }],
    slides: [
      {
        nodes: [
          {
            type: "shape",
            paragraphs: [{ runs: [{ text: "First" }, { text: " line" }] }],
          },
          {
            type: "group",
            children: [
              { type: "shape", paragraphs: [{ runs: [{ text: "Nested" }] }] },
            ],
          },
          {
            type: "table",
            rows: [[{ paragraphs: [{ runs: [{ text: "Cell" }] }] }]],
          },
          { type: "shape" },
          { type: "image" },
        ],
      },
    ],
  } as unknown as PresentationDocument
  expect(preparePresentation(doc)).toEqual(["First line\nNested\nCell\n\n"])
  expect(Object.keys(doc.assets)).toEqual(["image", "emf"])
  expect(doc.assets.image).not.toHaveProperty("url")
  expect(doc.embeddedFonts).toEqual([])
})

test.each([
  [undefined, "invalid"],
  ["bad", "invalid"],
  [new Error("bad"), "invalid"],
  [new Error("EMPTY"), "empty"],
  [new Error("TOO_LARGE"), "resourceLimit"],
  [new RangeError("memory"), "resourceLimit"],
  [new Error("out of memory"), "resourceLimit"],
  [Object.assign(new Error(), { code: "encrypted-document" }), "protected"],
  [Object.assign(new Error(), { code: "resource-limit" }), "resourceLimit"],
  [Object.assign(new Error(), { code: "unsupported-format" }), "unsupported"],
  [Object.assign(new Error(), { code: "parse-failed" }), "invalid"],
])("maps diagnostics without leaking raw parser details", (error, expected) => {
  expect(presentationError(error)).toBe(expected)
})
