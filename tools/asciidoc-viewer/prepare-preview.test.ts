// @vitest-environment jsdom
import { expect, test } from "vitest"
import { convert } from "./core/convert"
import { preparePreview } from "./prepare-preview"
import m from "./messages/en.json"

test("sanitizes passthrough, isolates output, flags resources and disables include links", async () => {
  const result = await convert(
    '= Manual\n\ninclude::https://example.invalid/chapter.adoc[]\n\nimage::local.png[Missing image]\n\n++++\n<script>alert(1)</script><img src="https://example.invalid/image" onerror="alert(1)"><a href="https://example.org/">External link</a>\n++++'
  )
  const preview = preparePreview(result, m)
  expect(preview.includes).toBe(true)
  expect(preview.notes).toEqual({ local: true, remote: true, active: true })
  expect(preview.html).not.toContain("<script")
  expect(preview.html).not.toContain("onerror")
  expect(preview.html).not.toContain('src="https:')
  const doc = new DOMParser().parseFromString(preview.html, "text/html")
  const include = doc.querySelector("a.include")!
  expect(include.getAttribute("data-web-link")).toBeNull()
  expect(include.getAttribute("tabindex")).toBeNull()
  expect(include.getAttribute("title")).toBe(m.includes)
  expect(doc.head.firstElementChild?.getAttribute("http-equiv")).toBe(
    "Content-Security-Policy"
  )
  expect(
    doc.querySelector('a[data-web-link="https://example.org/"]')
  ).toBeTruthy()
})

test("keeps ordinary internal references, title, code and every outline entry", async () => {
  const preview = preparePreview(
    await convert(
      "= Manual\n\n== Chapter\n\n<<_chapter,Return>>\n\n----\na long code line\n----\n\n// comment"
    ),
    m
  )
  expect(preview.title).toBe("Manual")
  expect(preview.outline.map((x) => x.label)).toEqual(["Manual", "Chapter"])
  expect(preview.html).toContain('data-web-link="#_chapter"')
  expect(preview.html).toContain("data-web-wide")
  expect(preview.includes).toBe(false)
  expect(preview.warnings).toBe(false)
  expect(preview.empty).toBe(false)
  const empty = preparePreview(await convert("// comment"), m)
  expect(empty.empty).toBe(true)
  expect(empty.html).toContain(m.noContent)
})
