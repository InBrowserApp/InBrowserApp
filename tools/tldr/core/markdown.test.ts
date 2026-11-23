// @vitest-environment jsdom

import { expect, it } from "vitest"
import { renderPage } from "./markdown"

it("extracts command examples, unwraps placeholders and preserves literal braces", () => {
  const result = renderPage(
    [
      "# git",
      "",
      "Read more in the docs.",
      "",
      "> See `{{git}}` at <https://git-scm.com>.",
      "",
      "`git commit {{[-m|--message]}} {{message}}`",
      "",
      "`git stash show {{stash@{0}}}`",
      "",
      "```sh",
      String.raw`docker inspect '\{\{range\}\}' {{container}}`,
      "```",
    ].join("\n")
  )

  const examples = result.filter((section) => section.type === "example")
  expect(examples).toMatchObject([
    { type: "example", command: "git commit [-m|--message] message" },
    { type: "example", command: "git stash show stash@{0}" },
    { type: "example", command: "docker inspect '{{range}}' container" },
  ])
  expect(examples[0]?.parts).toEqual([
    { text: "git commit ", kind: "text" },
    { text: "[-m|--message]", kind: "options" },
    { text: " ", kind: "text" },
    { text: "message", kind: "value" },
  ])
  expect(examples[2]?.parts).toEqual([
    { text: "docker inspect '{{range}}' ", kind: "text" },
    { text: "container", kind: "value" },
  ])
  expect(result[0]).toMatchObject({
    html: expect.stringContaining("<h2>git</h2>"),
  })
  expect(result[0]).toMatchObject({
    html: expect.stringContaining("<code>git</code>"),
  })
  expect(result[0]).toMatchObject({
    html: expect.stringContaining('href="https://git-scm.com"'),
  })
})

it("removes scripts and unsafe URLs from upstream content", () => {
  const [section] = renderPage(
    "# Example\n\n<script>alert(1)</script>\n\n[Link](javascript:alert(1))"
  )
  expect(section).toMatchObject({
    html: expect.stringContaining("<p><a>Link</a></p>"),
  })
  expect(section).not.toMatchObject({
    html: expect.stringMatching(/script|href=|alert/),
  })
})
