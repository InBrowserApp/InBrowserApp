import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"
import TextLineSorterClient from "./client"
import messages from "./messages/en.json"

const output = () =>
  (screen.getByLabelText(messages.outputLabel) as HTMLTextAreaElement).value
const input = () =>
  screen.getByLabelText(messages.inputLabel) as HTMLTextAreaElement
const enter = (value: string) =>
  fireEvent.change(input(), { target: { value } })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("TextLineSorterClient", () => {
  test("starts empty and updates the read-only output in both directions", () => {
    render(<TextLineSorterClient messages={messages} />)
    expect(input().value).toBe("")
    expect(output()).toBe("")
    expect(
      (
        screen.getByRole("button", {
          name: messages.copyLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(
      (screen.getByLabelText(messages.outputLabel) as HTMLTextAreaElement)
        .readOnly
    ).toBe(true)
    enter("b\na\nb")
    expect(output()).toBe("a\nb\nb")
    fireEvent.change(screen.getByLabelText(messages.orderLabel), {
      target: { value: "descending" },
    })
    expect(output()).toBe("b\nb\na")
    fireEvent.change(screen.getByLabelText(messages.orderLabel), {
      target: { value: "ascending" },
    })
    expect(output()).toBe("a\nb\nb")
  })

  test("applies each option and resets text and all options", () => {
    render(<TextLineSorterClient messages={messages} />)
    enter(" b \na\nA\n b \n\t")
    fireEvent.click(screen.getByLabelText(messages.trimLabel))
    expect(output()).toBe("\nA\na\nb\nb")
    fireEvent.click(screen.getByLabelText(messages.ignoreCaseLabel))
    expect(output()).toBe("\na\nA\nb\nb")
    fireEvent.click(screen.getByLabelText(messages.removeBlankLabel))
    expect(output()).toBe("a\nA\nb\nb")
    fireEvent.click(screen.getByLabelText(messages.deduplicateLabel))
    expect(output()).toBe("a\nb")
    fireEvent.click(screen.getByLabelText(messages.deduplicateLabel))
    expect(output()).toBe("a\nA\nb\nb")
    fireEvent.click(screen.getByLabelText(messages.deduplicateLabel))
    fireEvent.change(screen.getByLabelText(messages.orderLabel), {
      target: { value: "descending" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))
    expect(input().value).toBe("")
    expect(output()).toBe("")
    for (const checkbox of screen.getAllByRole("checkbox")) {
      expect(checkbox.getAttribute("aria-checked")).toBe("false")
    }
    expect(
      (screen.getByLabelText(messages.orderLabel) as HTMLSelectElement).value
    ).toBe("ascending")
    enter("b\na\nb")
    expect(output()).toBe("a\nb\nb")
  })

  test("copies the actual sorted output", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", { clipboard: { writeText } })
    render(<TextLineSorterClient messages={messages} />)
    enter("z\nx\ny")
    fireEvent.click(screen.getByRole("button", { name: messages.copyLabel }))
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("x\ny\nz"))
    expect(
      screen.getByRole("button", { name: messages.copiedLabel })
    ).toBeTruthy()
  })
})
