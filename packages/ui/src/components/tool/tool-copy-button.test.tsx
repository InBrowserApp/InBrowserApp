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
    expect(screen.getByRole("button").getAttribute("data-size")).toBe("sm")
  })

  test("uses a custom accessible label", () => {
    render(
      <ToolCopyButton
        value="text"
        copyLabel="Copy"
        copiedLabel="Copied"
        ariaLabel="Copy Foot value"
      />
    )

    expect(screen.getByRole("button", { name: "Copy Foot value" })).toBeTruthy()
  })

  test("visually hides the status label at icon size", () => {
    render(
      <ToolCopyButton
        value="text"
        copyLabel="Copy"
        copiedLabel="Copied"
        size="icon-sm"
      />
    )

    const button = screen.getByRole("button", { name: "Copy" })
    expect(button.getAttribute("data-size")).toBe("icon-sm")
    expect(screen.getByText("Copy").classList.contains("sr-only")).toBe(true)
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

  test("announces the copied state with a custom accessible label", async () => {
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
        ariaLabel="Copy Foot value"
        size="icon-sm"
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Copy Foot value" }))

    await vi.waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Copied: Copy Foot value" })
      ).toBeTruthy()
      expect(screen.getByText("Copied").classList.contains("sr-only")).toBe(
        true
      )
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
