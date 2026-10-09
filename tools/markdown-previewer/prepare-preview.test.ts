// @vitest-environment jsdom
import { describe, expect, test } from "vitest"
import { preparePreview, exportBody } from "./prepare-preview"
import {
  buildMarkdownPreview,
  createExportHtmlDocument,
} from "./core/markdown-preview"

describe("safe Markdown documents", () => {
  test("keeps GFM tasks, semantic HTML, embedded raster images, and independent wide blocks", () => {
    const source = `# Guide

- [x] Done
- [ ] Todo

| Name | Status |
| --- | ---: |
| ~~Old~~ | **New** |

\`\`\`js
console.log('<script>')
\`\`\`

<details><summary>Details</summary><p id="bookmark">More</p></details>

![pixel](data:image/png;base64,iVBORw0KGgo=)

[Jump](#bookmark) [Web](https://example.com) [Mail](mailto:reader@example.com)
`
    const result = preparePreview(buildMarkdownPreview(source, "Untitled").html)
    const template = document.createElement("template")
    template.innerHTML = result.html
    expect(
      template.content.querySelectorAll('input[type="checkbox"][disabled]')
    ).toHaveLength(2)
    expect(template.content.querySelector("input[checked]")).toBeTruthy()
    expect(template.content.querySelector('th[align="right"]')).toBeTruthy()
    expect(
      template.content.querySelectorAll("[data-markdown-wide][tabindex='0']")
    ).toHaveLength(2)
    expect(template.content.querySelector("details summary")?.textContent).toBe(
      "Details"
    )
    expect(template.content.querySelector("img")?.getAttribute("src")).toMatch(
      /^data:image\/png/
    )
    expect(template.content.querySelector("pre")?.textContent).toContain(
      "<script>"
    )
    expect(result.localImages).toBe(false)
    expect(result.remoteImages).toBe(false)
    expect(result.html).not.toContain("href=")
    expect(exportBody(result.html)).toContain('href="#markdown-bookmark"')
    expect(exportBody(result.html)).toContain(
      'rel="noopener noreferrer" target="_blank"'
    )
  })

  test("removes active HTML and network resources before mounting, including forged managed links", () => {
    const result = preparePreview(`<script>top.pwned=1</script>
      <style>@import 'https://bad.test/style';</style><link href="https://bad.test/font">
      <iframe srcdoc="<script>alert(1)</script>"></iframe><object data="https://bad.test/object"></object>
      <meta http-equiv="refresh" content="0;url=https://bad.test"><base href="https://bad.test">
      <p style="background:url(https://bad.test/bg)" onclick="alert(1)">safe</p>
      <img src="https://bad.test/a" srcset="https://bad.test/b 2x" onerror="alert(1)">
      <img src="./local.png" alt="Missing figure"><img src="data:image/svg+xml;base64,PHN2Zz4=">
      <a href="javascript:alert(1)">bad</a><a data-markdown-link="javascript:alert(1)">forged</a>
      <a href="./sibling.md">relative</a><a name="old-bookmark">named</a>
      <input type="text" value="private"><form action="https://bad.test/post"><button>send</button></form>`)
    expect(result.localImages).toBe(true)
    expect(result.remoteImages).toBe(true)
    expect(result.html).not.toMatch(
      /https:\/\/bad|javascript:|<script|<style|<iframe|<object|<meta|<base|<link|<form|<button|onclick|onerror|srcset|data-markdown-link/
    )
    expect(result.html).toContain('alt="Missing figure"')
    expect(result.html).toContain('id="markdown-old-bookmark"')
    expect(result.html).not.toContain("<input")
  })

  test("namespaces IDs so headings named after DOM properties remain navigable", () => {
    const result = preparePreview(
      '<h1 id="location">Location</h1><h2 id="forms">Forms</h2><a href="#location">Jump</a><a href="#%66orms">Forms</a>'
    )
    expect(result.html).toContain('id="markdown-location"')
    expect(result.html).toContain('id="markdown-forms"')
    expect(result.html).toContain('data-markdown-link="#markdown-location"')
    expect(result.html).toContain('data-markdown-link="#markdown-forms"')
  })

  test("encodes rewritten fragments exactly once for literal percent signs and Unicode", () => {
    const result = preparePreview(
      '<p id="note%20one">Percent</p><p id="章节">Unicode</p><a href="#note%2520one">Percent</a><a href="#章节">Unicode</a><a href="#%zz">Malformed</a>'
    )
    const holder = document.createElement("template")
    holder.innerHTML = result.html
    const links = holder.content.querySelectorAll("a")
    for (const link of Array.from(links).slice(0, 2)) {
      const id = decodeURIComponent(
        link.getAttribute("data-markdown-link")!.slice(1)
      )
      expect(holder.content.getElementById(id)).toBeTruthy()
    }
    expect(links[2]!.getAttribute("data-markdown-link")).toBe("#markdown-%25zz")
    expect(exportBody(result.html)).toContain('href="#markdown-note%2520one"')
  })

  test("exports a safe standalone document with the CSP before styles and valid link targets", () => {
    const prepared = preparePreview(
      '<h1>Title</h1><a href="https://example.com" ping="https://bad.test">External</a>'
    )
    const html = createExportHtmlDocument({
      title: "<x>",
      html: exportBody(prepared.html),
      theme: "clean",
      language: 'en" onload="bad',
      direction: "ltr",
    })
    expect(html.indexOf("Content-Security-Policy")).toBeLessThan(
      html.indexOf("<style>")
    )
    expect(html).toContain("script-src 'none'")
    expect(html).toContain("<title>&lt;x&gt;</title>")
    expect(html).toContain('href="https://example.com"')
    expect(html).not.toContain("bad.test")
    expect(html).toContain("&quot; onload=&quot;bad")
  })
})
