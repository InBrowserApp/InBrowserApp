import { fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { describe, expect, test, vi } from "vitest"

import { PrettierInputCard } from "./prettier-input-card"

const messages = {
  meta: {
    name: "Prettier Code Formatter",
    description: "",
  },
  inputLabel: "Source code",
  inputDescription: "Paste code to format it with Prettier.",
  inputPlaceholder: "Paste your code here...",
  outputLabel: "Formatted output",
  outputDescription: "",
  outputEmptyDescription: "",
  formattingLabel: "",
  formatErrorLabel: "",
  optionsLabel: "",
  optionsDescription: "",
  languageLabel: "",
  printWidthLabel: "",
  tabWidthLabel: "",
  indentationLegend: "",
  styleLegend: "",
  useTabsLabel: "",
  semicolonsLabel: "",
  singleQuotesLabel: "",
  trailingCommaLabel: "",
  trailingCommaNoneLabel: "",
  trailingCommaEs5Label: "",
  trailingCommaAllLabel: "",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  importFromFileLabel: "Import from file",
  formatNowLabel: "Format now",
  formatPausedHint: "Large input detected.",
  copyFormattedLabel: "",
  copiedLabel: "",
  downloadFormattedLabel: "",
} as const

describe("PrettierInputCard", () => {
  test("wires the textarea and primary toolbar actions", () => {
    const fileInputRef = createRef<HTMLInputElement>()
    const onUseSample = vi.fn()
    const onClear = vi.fn()
    const onSourceCodeChange = vi.fn()
    const onFileChange = vi.fn()

    render(
      <PrettierInputCard
        fileInputRef={fileInputRef}
        hasInputError={true}
        isPendingLargeFormat={false}
        messages={messages}
        sourceCode={"const answer=42"}
        onClear={onClear}
        onFileChange={onFileChange}
        onFormatNow={vi.fn()}
        onSourceCodeChange={onSourceCodeChange}
        onUseSample={onUseSample}
      />
    )

    const input = screen.getByLabelText(messages.importFromFileLabel)
    const clickSpy = vi.spyOn(input, "click")

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.inputLabel }),
      {
        target: { value: "const next=1" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromFileLabel })
    )
    fireEvent.change(input, {
      target: {
        files: [new File(["const next=1"], "demo.ts", { type: "text/plain" })],
      },
    })

    expect(
      screen
        .getByRole("textbox", { name: messages.inputLabel })
        .getAttribute("aria-invalid")
    ).toBe("true")
    expect(onSourceCodeChange).toHaveBeenCalledWith("const next=1")
    expect(onUseSample).toHaveBeenCalledOnce()
    expect(onClear).toHaveBeenCalledOnce()
    expect(clickSpy).toHaveBeenCalledOnce()
    expect(onFileChange).toHaveBeenCalledOnce()
  })

  test("shows the explicit format action when large input is paused", () => {
    const onFormatNow = vi.fn()

    render(
      <PrettierInputCard
        fileInputRef={createRef<HTMLInputElement>()}
        hasInputError={false}
        isPendingLargeFormat={true}
        messages={messages}
        sourceCode=""
        onClear={vi.fn()}
        onFileChange={vi.fn()}
        onFormatNow={onFormatNow}
        onSourceCodeChange={vi.fn()}
        onUseSample={vi.fn()}
      />
    )

    expect(screen.getByText(messages.formatPausedHint)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.formatNowLabel })
    )

    expect(onFormatNow).toHaveBeenCalledOnce()
  })
})
