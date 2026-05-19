import { describe, expect, test } from "vitest"

import {
  countImageToolsByGroup,
  filterImageTools,
  imageToolMatchesQuery,
  normalizeImageToolQuery,
  resolveImageToolGroups,
} from "./image-tools"

import type { ImageToolSummary } from "./image-tools"

const tools = [
  {
    slug: "image-resizer",
    tags: ["image", "resize", "photo"],
    meta: {
      name: "Image Resizer",
      description: "Resize images and export them for the web.",
    },
  },
  {
    slug: "image-to-webp-converter",
    tags: ["image", "webp", "converter"],
    meta: {
      name: "Image to WebP Converter",
      description: "Convert PNG or JPEG files to WebP.",
    },
  },
  {
    slug: "exif-viewer",
    tags: ["image", "metadata", "privacy"],
    meta: {
      name: "EXIF Viewer",
      description: "Inspect camera metadata before sharing photos.",
    },
  },
  {
    slug: "placeholder-image-generator",
    tags: ["image", "generator", "placeholder"],
    meta: {
      name: "Placeholder Image Generator",
      description: "Generate placeholder graphics.",
    },
  },
  {
    slug: "qr-code-reader",
    tags: ["image", "reader", "scan"],
    meta: {
      name: "QR Code Reader",
      description: "Read QR codes from an uploaded image.",
    },
  },
] as const satisfies readonly ImageToolSummary[]

describe("image tools directory core", () => {
  test("normalizes search queries", () => {
    expect(normalizeImageToolQuery("  WebP   Converter  ")).toBe(
      "webp converter"
    )
  })

  test("classifies image tools by user workflow", () => {
    expect(resolveImageToolGroups(tools[0])).toEqual(["optimize"])
    expect(resolveImageToolGroups(tools[1])).toEqual(["convert"])
    expect(resolveImageToolGroups(tools[2])).toEqual(["inspect"])
    expect(resolveImageToolGroups(tools[3])).toEqual(["create"])
    expect(resolveImageToolGroups(tools[4])).toEqual(["scan"])
  })

  test("falls back to inspect for uncategorized image utilities", () => {
    expect(
      resolveImageToolGroups({
        slug: "histogram",
        tags: ["image"],
        meta: {
          description: "Show tonal distribution.",
          name: "Histogram",
        },
      })
    ).toEqual(["inspect"])
  })

  test("matches every search token across names, descriptions, slugs, and tags", () => {
    expect(imageToolMatchesQuery(tools[0], "   ")).toBe(true)
    expect(imageToolMatchesQuery(tools[1], "webp png")).toBe(true)
    expect(imageToolMatchesQuery(tools[1], "webp camera")).toBe(false)
    expect(imageToolMatchesQuery(tools[2], "sharing metadata")).toBe(true)
  })

  test("filters by group and query while preserving input order", () => {
    expect(
      filterImageTools(tools, {
        group: "all",
        query: "image",
      }).map((tool) => tool.slug)
    ).toEqual([
      "image-resizer",
      "image-to-webp-converter",
      "exif-viewer",
      "placeholder-image-generator",
      "qr-code-reader",
    ])

    expect(
      filterImageTools(tools, {
        group: "convert",
        query: "webp",
      }).map((tool) => tool.slug)
    ).toEqual(["image-to-webp-converter"])
  })

  test("counts tools in each workflow group", () => {
    expect(countImageToolsByGroup(tools)).toEqual({
      convert: 1,
      create: 1,
      inspect: 1,
      optimize: 1,
      scan: 1,
    })
  })
})
