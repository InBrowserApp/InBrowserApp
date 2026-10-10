// @vitest-environment jsdom
import { expect, test } from "vitest"
import { prepare } from "./prepare"

test("retains source text and moves deduplicated inline styles into pagination CSS", () => {
  const result = prepare({
    html: '<p style="break-before:page;color:red">First</p><p style="break-before:page;color:red">Second</p>',
    css: "p{margin:0}",
  })
  expect(result.text).toBe("FirstSecond")
  expect(result.fragment.querySelectorAll("[style]")).toHaveLength(0)
  expect(result.fragment.querySelectorAll(".pdf-inline-0")).toHaveLength(2)
  expect(result.css).toContain("break-before: page")
})
test.each([
  '<img src="https://example.com/tracker.png">',
  '<span style="background:url(file.png)">text</span>',
  '<span style="color:r\\65 d">text</span>',
  '<img srcset="image.png 2x">',
  "<script>alert(1)</script><p>text</p>",
  '<iframe src="data:text/html,bad"></iframe>',
  "<img>",
  '<span class="msdoc-image-fallback">missing</span>',
  '<a class="msdoc-attachment">object</a>',
])("rejects active, external or incomplete content: %s", (html) => {
  expect(() => prepare({ html, css: "" })).toThrow("unsupported")
})
test("rejects remote styles and empty output while accepting an embedded image", () => {
  expect(() =>
    prepare({ html: "<p>text</p>", css: '@import "remote.css";' })
  ).toThrow("unsupported")
  expect(() => prepare({ html: "<p> </p>", css: "" })).toThrow("invalid")
  expect(
    prepare({ html: '<img src="data:image/png;base64,YQ==">', css: "" })
      .imageCount
  ).toBe(1)
})

test("reflows keep constraints without dropping explicit page breaks", () => {
  const result = prepare({
    html: '<p style="break-before:page;break-after:avoid;break-inside:avoid">Heading</p>',
    css: "",
  })
  expect(result.css).toContain("break-before: page")
  expect(result.css).not.toContain("avoid")
})
