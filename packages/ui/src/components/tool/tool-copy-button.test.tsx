import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import { ToolCopyButton } from "./tool-copy-button"

afterEach(cleanup)

describe("ToolCopyButton", () => {
  test("renders with copy label", () => {
    render(
      <ToolCopyButton value="text" copyLabel="Copy" copiedLabel="Copied" />
    )
    expect(screen.getByText("Copy")).toBeTruthy()
    expect(screen.getByText("Copy").getAttribute("aria-live")).toBe("polite")
  })

  test("is disabled when value is empty", () => {
    render(<ToolCopyButton value="" copyLabel="Copy" copiedLabel="Copied" />)
    const button = screen.getByRole("button")
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  test("is disabled when disabled prop is true", () => {
    render(
      <ToolCopyButton
        value="text"
        copyLabel="Copy"
        copiedLabel="Copied"
        disabled
      />
    )
    const button = screen.getByRole("button")
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  test("copies value to clipboard on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(
      <ToolCopyButton value="hello" copyLabel="Copy" copiedLabel="Copied" />
    )

    const button = screen.getByRole("button")
    fireEvent.click(button)

    await vi.waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("hello")
      expect(screen.getByText("Copied")).toBeTruthy()
    })
  })

  test("does not copy when disabled", () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(
      <ToolCopyButton
        value="hello"
        copyLabel="Copy"
        copiedLabel="Copied"
        disabled
      />
    )

    fireEvent.click(screen.getByRole("button"))
    expect(writeText).not.toHaveBeenCalled()
  })
})
