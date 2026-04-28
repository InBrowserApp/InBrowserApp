import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { HighlightedMarkdown } from "./highlighted-markdown"

afterEach(cleanup)

describe("HighlightedMarkdown", () => {
  test("renders an empty state", () => {
    render(
      <HighlightedMarkdown
        ariaLabel="Markdown output"
        emptyDescription="Paste HTML to convert."
        errorTitle="Error"
        errorDescription="Nope"
        state="empty"
        value=""
      />
    )

    expect(
      screen.getByRole("region", { name: "Markdown output" }).textContent
    ).toContain("Paste HTML to convert.")
  })

  test("renders an error state", () => {
    render(
      <HighlightedMarkdown
        ariaLabel="Markdown output"
        emptyDescription="Paste HTML to convert."
        errorTitle="Error"
        errorDescription="Conversion failed."
        state="error"
        value=""
      />
    )

    const region = screen.getByRole("region", { name: "Markdown output" })
    const alert = within(region).getByRole("alert")
    expect(alert.textContent).toContain("Error")
    expect(alert.textContent).toContain("Conversion failed.")
  })

  test("renders highlighted Markdown output", () => {
    render(
      <HighlightedMarkdown
        ariaLabel="Markdown output"
        emptyDescription="Paste HTML to convert."
        errorTitle="Error"
        errorDescription="Nope"
        state="success"
        value="# Heading\n\n- One"
      />
    )

    const region = screen.getByRole("region", { name: "Markdown output" })
    expect(region.textContent).toContain("# Heading")
    expect(region.querySelector(".hljs")).toBeTruthy()
  })
})
