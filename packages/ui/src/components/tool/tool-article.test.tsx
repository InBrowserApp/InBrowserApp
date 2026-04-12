import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { ToolArticle } from "./tool-article"

afterEach(cleanup)

describe("ToolArticle", () => {
  test("includes typography selectors for markdown content", () => {
    const { container } = render(
      <ToolArticle className="custom-class">
        <h3>Subheading</h3>
        <p>Body</p>
        <blockquote>Quote</blockquote>
        <code>value</code>
      </ToolArticle>
    )

    const article = container.querySelector("article")
    expect(article).toBeTruthy()
    expect(article?.className).toContain("[&_h2]:text-xl")
    expect(article?.className).not.toContain("sm:[&_h2]:text-2xl")
    expect(article?.className).toContain("[&_h3]:text-lg")
    expect(article?.className).not.toContain("sm:[&_h3]:text-xl")
    expect(article?.className).toContain("[&_h4]:text-base")
    expect(article?.className).not.toContain("sm:[&_h4]:text-lg")
    expect(article?.className).toContain("[&_blockquote]:border-l-2")
    expect(article?.className).toContain("[&_code]:font-mono")
    expect(article?.className).toContain("[&_code]:font-normal")
    expect(article?.className).not.toContain("[&_code]:font-semibold")
    expect(article?.className).toContain("[&_table]:border-collapse")
    expect(article?.className).toContain("custom-class")
  })
})
