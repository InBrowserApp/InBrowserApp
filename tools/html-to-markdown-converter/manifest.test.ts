import { describe, expect, test } from "vitest"

import { tool } from "./manifest"

describe("html-to-markdown-converter manifest", () => {
  test("declares the expected category, icon, and tags", () => {
    expect(tool).toEqual({
      category: "text",
      icon: "file-text",
      tags: ["document", "html", "markdown", "converter"],
    })
  })
})
