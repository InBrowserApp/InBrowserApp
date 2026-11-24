import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import ChineseTextConverterClient from "./client"
import messages from "./messages/en.json"
import traditionalMessages from "./messages/zh-TW.json"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.doUnmock("opencc-js")
})

describe("Chinese text converter", () => {
  test("converts phrases live and keeps paragraph breaks and mixed text", async () => {
    render(<ChineseTextConverterClient lang="en" messages={messages} />)

    const original = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.inputLabel,
    })
    const converted = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.outputLabel,
    })
    const copy = screen.getByRole<HTMLButtonElement>("button", {
      name: messages.copyLabel,
    })
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined)
    const source = "头发、发展\n\n里面的软件和鼠标。说话。 Hello 123 🙂"
    const standard = "頭髮、發展\n\n裏面的軟件和鼠標。說話。 Hello 123 🙂"
    const taiwan = "頭髮、發展\n\n裡面的軟件和鼠標。說話。 Hello 123 🙂"
    const taiwanVocabulary =
      "頭髮、發展\n\n裡面的軟體和滑鼠。說話。 Hello 123 🙂"
    const hongKong = "頭髮、發展\n\n裏面的軟件和鼠標。説話。 Hello 123 🙂"

    expect(copy.disabled).toBe(true)
    fireEvent.change(original, { target: { value: source } })
    await waitFor(() => expect(converted.value).toBe(standard))
    expect(converted.readOnly).toBe(true)

    const variants = screen.getByRole("combobox", {
      name: messages.variantLabel,
    })
    for (const [value, expected] of [
      ["tw", taiwan],
      ["twp", taiwanVocabulary],
      ["hk", hongKong],
    ]) {
      fireEvent.change(variants, { target: { value } })
      expect(converted.value).toBe(expected)
      expect(original.value).toBe(source)
    }

    fireEvent.click(copy)
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(hongKong))
    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    expect(original.value).toBe("")
    expect(document.activeElement).toBe(original)
    expect(converted.value).toBe("")
    expect(copy.disabled).toBe(true)
  })

  test("uses the Taiwan vocabulary preset by default on the zh-TW page", async () => {
    render(
      <ChineseTextConverterClient lang="zh-TW" messages={traditionalMessages} />
    )

    const direction = screen.getByRole<HTMLSelectElement>("combobox", {
      name: traditionalMessages.directionLabel,
    })
    const original = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: traditionalMessages.inputLabel,
    })
    const converted = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: traditionalMessages.outputLabel,
    })

    expect(direction.value).toBe("toSimplified")
    const variants = screen.getByRole<HTMLSelectElement>("combobox", {
      name: traditionalMessages.variantLabel,
    })
    expect(variants.value).toBe("twp")
    fireEvent.click(
      screen.getByRole("button", { name: traditionalMessages.exampleLabel })
    )
    await waitFor(() =>
      expect(converted.value).toBe(
        "后来，发型师帮我剪了头发。\n我把照片发给了朋友。"
      )
    )

    fireEvent.change(original, { target: { value: "軟體和滑鼠" } })
    expect(converted.value).toBe("软件和鼠标")

    const source = original.value
    fireEvent.change(direction, { target: { value: "toTraditional" } })
    expect(original.value).toBe(source)
    fireEvent.change(original, { target: { value: "软件" } })
    expect(converted.value).toBe("軟體")
  })

  test("keeps pasted text available when the dictionary fails to load", async () => {
    vi.doMock("opencc-js", () => {
      throw new Error("Unavailable")
    })
    render(<ChineseTextConverterClient lang="en" messages={messages} />)

    const original = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: messages.inputLabel,
    })
    fireEvent.change(original, { target: { value: "头发" } })
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe(messages.loadError)
    )
    expect(original.value).toBe("头发")
  })
})
