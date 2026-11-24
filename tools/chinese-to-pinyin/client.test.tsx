import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import PinyinConverter from "./client"
import messages from "./messages/en.json"

const example = "你好，世界！"
const input = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.inputLabel,
  })
const output = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", {
    name: messages.outputLabel,
  })

function clickButton(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("tries an example, switches the tone format, copies the result, and clears the text", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  render(<PinyinConverter messages={messages} example={example} />)
  expect(output().readOnly).toBe(true)
  expect(output().value).toBe("")

  clickButton(messages.exampleLabel)
  expect(input().value).toBe(example)
  expect(output().value).toBe("nǐ hǎo，shì jiè！")
  expect(document.activeElement).toBe(output())

  fireEvent.change(input(), { target: { value: "重慶銀行" } })
  expect(
    screen.getByRole<HTMLButtonElement>("button", {
      name: messages.exampleLabel,
    }).disabled
  ).toBe(true)
  fireEvent.click(screen.getByRole("radio", { name: messages.plainLabel }))
  expect(output().value).toBe("chong qing yin hang")
  fireEvent.click(screen.getByRole("radio", { name: messages.numbersLabel }))
  clickButton(messages.copyLabel)
  await waitFor(() => {
    expect(writeText).toHaveBeenCalledWith("chong2 qing4 yin2 hang2")
    expect(
      screen.getByRole("button", { name: messages.copiedLabel })
    ).toBeTruthy()
  })

  clickButton(messages.clearLabel)
  expect(input().value).toBe("")
  expect(output().value).toBe("")
  fireEvent.change(input(), { target: { value: "你好" } })
  expect(output().value).toBe("ni3 hao3")
})

test("keeps the result available when clipboard access fails", async () => {
  const writeText = vi.fn().mockRejectedValue(new Error("Clipboard denied"))
  vi.stubGlobal("navigator", { clipboard: { writeText } })
  render(<PinyinConverter messages={messages} example={example} />)
  clickButton(messages.exampleLabel)
  clickButton(messages.copyLabel)
  expect(
    await screen.findByRole("button", { name: messages.copyFailedLabel })
  ).toBeTruthy()
  expect(output().value).toBe("nǐ hǎo，shì jiè！")
})
