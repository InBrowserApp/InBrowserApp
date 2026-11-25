import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import UnicodeNormalizer from "./client"
import messages from "./messages/en.json"

const input = () =>
  screen.getByLabelText<HTMLTextAreaElement>(messages.inputLabel)
const output = () =>
  screen.getByLabelText<HTMLTextAreaElement>(messages.outputLabel)
const button = (name: string) =>
  screen.getByRole<HTMLButtonElement>("button", { name })

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("normalizes pasted text live across all four forms without changing the input", () => {
  render(<UnicodeNormalizer messages={messages} />)
  const text = "Cafe\u0301 Ａ①ﬁ\n"
  fireEvent.change(input(), { target: { value: text } })
  expect(output().value).toBe("Café Ａ①ﬁ\n")
  expect(output().readOnly).toBe(true)
  expect(screen.getByRole("status").textContent).toBe(messages.changedLabel)

  fireEvent.click(screen.getByRole("radio", { name: "NFD" }))
  expect(output().value).toBe(text)
  expect(screen.getByRole("status").textContent).toBe(messages.unchangedLabel)

  fireEvent.click(screen.getByRole("radio", { name: "NFKC" }))
  expect(output().value).toBe("Café A1fi\n")

  fireEvent.click(screen.getByRole("radio", { name: "NFKD" }))
  expect(output().value).toBe("Cafe\u0301 A1fi\n")
  expect(input().value).toBe(text)
})

test("shows Unicode code points, including supplementary characters, and marks a truncated preview", () => {
  render(<UnicodeNormalizer messages={messages} />)
  fireEvent.change(input(), { target: { value: "e\u0301🙂" + "x".repeat(41) } })
  const [original, normalized] = Array.from(
    document.querySelectorAll("dd code"),
    (code) => code.textContent
  )
  expect(original).toMatch(/^U\+0065 U\+0301 U\+1F642 /)
  expect(normalized).toMatch(/^U\+00E9 U\+1F642 /)
  expect(original?.split(" ")).toHaveLength(41)
  expect(original).toMatch(/ …$/)
})

test("loads an example, copies the full result, and clears both fields", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  render(<UnicodeNormalizer messages={messages} />)

  const copy = button(messages.copyLabel)
  expect(copy.disabled).toBe(true)
  fireEvent.click(button(messages.exampleLabel))
  expect(button(messages.exampleLabel).disabled).toBe(true)
  expect(document.activeElement).toBe(input())
  fireEvent.click(screen.getByRole("radio", { name: "NFKC" }))
  fireEvent.click(copy)
  await waitFor(() => expect(writeText).toHaveBeenCalledWith("Café · ABC 1 fi"))

  fireEvent.click(button(messages.clearLabel))
  expect(input().value).toBe("")
  expect(output().value).toBe("")
  expect(copy.disabled).toBe(true)
  expect(document.activeElement).toBe(input())
  expect(screen.queryByText(messages.codePointsLabel)).toBeNull()
})
