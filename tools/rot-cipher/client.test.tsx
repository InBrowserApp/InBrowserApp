import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import RotCipherClient from "./client"

const messages = {
  meta: { name: "ROT Cipher", description: "Encrypt and decrypt text." },
  rotTypeLabel: "ROT Type",
  inputLabel: "Input Text",
  inputPlaceholder: "Enter text...",
  outputLabel: "Output Text",
  outputPlaceholder: "Converted text...",
  rot13Description: "Letters only (A-Z, a-z)",
  rot5Description: "Digits only (0-9)",
  rot18Description: "Letters + Digits (ROT13 + ROT5)",
  rot47Description: "All printable ASCII (33-126)",
  copyInputLabel: "Copy input",
  copyOutputLabel: "Copy output",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("RotCipherClient", () => {
  test("renders with the default rot13 example", () => {
    render(<RotCipherClient messages={messages} />)

    expect(
      (screen.getByLabelText("Input Text") as HTMLTextAreaElement).value
    ).toBe("Hello World! 12345")
    expect(
      (screen.getByLabelText("Output Text") as HTMLTextAreaElement).value
    ).toBe("Uryyb Jbeyq! 12345")
    expect(screen.getByText("Letters only (A-Z, a-z)")).toBeTruthy()
  })

  test("updates the output when the input changes", () => {
    render(<RotCipherClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Input Text"), {
      target: { value: "test" },
    })

    expect(
      (screen.getByLabelText("Output Text") as HTMLTextAreaElement).value
    ).toBe("grfg")
  })

  test("updates the input when the output changes", () => {
    render(<RotCipherClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Output Text"), {
      target: { value: "grfg" },
    })

    expect(
      (screen.getByLabelText("Input Text") as HTMLTextAreaElement).value
    ).toBe("test")
  })

  test("recomputes output when the rot type changes", () => {
    render(<RotCipherClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "ROT47" }))

    expect(
      (screen.getByLabelText("Output Text") as HTMLTextAreaElement).value
    ).toBe("w6==@ (@C=5P `abcd")
    expect(screen.getByText("All printable ASCII (33-126)")).toBeTruthy()
  })

  test("resets to the default example", () => {
    render(<RotCipherClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Input Text"), {
      target: { value: "changed" },
    })
    fireEvent.click(screen.getByRole("radio", { name: "ROT5" }))
    fireEvent.click(screen.getByText("Reset example"))

    expect(
      (screen.getByLabelText("Input Text") as HTMLTextAreaElement).value
    ).toBe("Hello World! 12345")
    expect(
      (screen.getByLabelText("Output Text") as HTMLTextAreaElement).value
    ).toBe("Uryyb Jbeyq! 12345")
  })

  test("restores state from localStorage on mount", () => {
    window.localStorage.setItem("tools:rot-cipher:input", "12345")
    window.localStorage.setItem("tools:rot-cipher:type", "rot5")

    render(<RotCipherClient messages={messages} />)

    expect(
      (screen.getByLabelText("Input Text") as HTMLTextAreaElement).value
    ).toBe("12345")
    expect(
      (screen.getByLabelText("Output Text") as HTMLTextAreaElement).value
    ).toBe("67890")
    expect(screen.getByText("Digits only (0-9)")).toBeTruthy()

    window.localStorage.removeItem("tools:rot-cipher:input")
    window.localStorage.removeItem("tools:rot-cipher:type")
  })
})
