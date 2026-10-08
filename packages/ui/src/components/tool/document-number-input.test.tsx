import { afterEach, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { DocumentNumberInput } from "./document-number-input"

afterEach(cleanup)
test("keeps intermediate edits and submits once on Enter or blur", () => {
  const onCommit = vi.fn()
  render(
    <DocumentNumberInput
      aria-label="Zoom"
      value={187}
      min={25}
      max={400}
      onCommit={onCommit}
    />
  )
  const input = screen.getByLabelText("Zoom") as HTMLInputElement
  for (const value of ["", "1", "10", "100"]) {
    fireEvent.change(input, { target: { value } })
    expect(input.value).toBe(value)
    expect(onCommit).not.toHaveBeenCalled()
  }
  fireEvent.keyDown(input, { key: "Enter" })
  fireEvent.blur(input)
  expect(onCommit).toHaveBeenCalledExactlyOnceWith(100)
  fireEvent.change(input, { target: { value: "125" } })
  fireEvent.blur(input)
  expect(onCommit).toHaveBeenLastCalledWith(125)
})
test("cancels invalid edits and follows external navigation", () => {
  const onCommit = vi.fn()
  const props = { "aria-label": "Page", min: 1, max: 30, onCommit }
  const { rerender } = render(<DocumentNumberInput {...props} value={2} />)
  const input = screen.getByLabelText("Page") as HTMLInputElement
  for (const value of ["", "0", "31", "1.5", "2"]) {
    fireEvent.change(input, { target: { value } })
    fireEvent.blur(input)
    expect(input.value).toBe("2")
  }
  fireEvent.change(input, { target: { value: "12" } })
  fireEvent.keyDown(input, { key: "Escape" })
  fireEvent.blur(input)
  expect(input.value).toBe("2")
  expect(onCommit).not.toHaveBeenCalled()
  fireEvent.change(input, { target: { value: "1" } })
  rerender(<DocumentNumberInput {...props} value={3} />)
  expect(input.value).toBe("3")
  fireEvent.blur(input)
  expect(onCommit).not.toHaveBeenCalled()
})
