import { render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { FormatOptionsPanel } from "./format-options-panel"

const messages = {
  toolbarLabel: "Conversion controls",
  importFromFileLabel: "Import from file",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  inputLabel: "HTML input",
  inputDescription:
    "Paste raw HTML or import an .html, .htm, or .txt file from this device.",
  inputPlaceholder: "Paste HTML here...",
  optionsTitle: "Markdown style",
  optionsDescription:
    "Choose the heading, list, and code block format that best matches your target Markdown flavor.",
  headingStyleLabel: "Headings",
  headingStyleAtxLabel: "ATX (# Heading)",
  headingStyleSetextLabel: "Setext (Heading + underline)",
  bulletStyleLabel: "Bullets",
  bulletStyleDashLabel: "Dash (-)",
  bulletStyleAsteriskLabel: "Asterisk (*)",
  bulletStylePlusLabel: "Plus (+)",
  codeBlockStyleLabel: "Code blocks",
  codeBlockStyleFencedLabel: "Fenced triple backticks",
  codeBlockStyleIndentedLabel: "Indented blocks",
  outputLabel: "Markdown output",
  outputDescription:
    "The converted Markdown updates automatically as you edit the HTML.",
  outputEmptyDescription: "Paste or import HTML to generate Markdown.",
  copyMarkdownLabel: "Copy Markdown",
  downloadMarkdownLabel: "Download Markdown",
  copiedLabel: "Copied",
  conversionErrorTitle: "The HTML could not be converted.",
} as const

describe("FormatOptionsPanel", () => {
  test("renders the three Markdown style selectors", () => {
    render(
      <FormatOptionsPanel
        messages={messages}
        headingStyle="atx"
        bulletListMarker="-"
        codeBlockStyle="fenced"
        onHeadingStyleChange={vi.fn()}
        onBulletListMarkerChange={vi.fn()}
        onCodeBlockStyleChange={vi.fn()}
      />
    )

    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.headingStyleLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.bulletStyleLabel })
    ).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.codeBlockStyleLabel })
    ).toBeTruthy()
  })
})
