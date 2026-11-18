import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ChineseUppercaseNumberConverterClient from "./client"
import messages from "./messages/en.json"

const props = { lang: "en", messages }

const STORAGE_KEYS = {
  variant: "tools:chinese-uppercase-number-converter:variant",
  number: "tools:chinese-uppercase-number-converter:number",
} as const

function getNumberInput() {
  return screen.getByRole("textbox", {
    name: messages.numberLabel,
  }) as HTMLInputElement
}

function getUppercaseInput() {
  return screen.getByRole("textbox", {
    name: messages.uppercaseLabel,
  }) as HTMLTextAreaElement
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("ChineseUppercaseNumberConverterClient", () => {
  test("renders the default number and uppercase value", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1234.56")
    })

    expect(getUppercaseInput().value).toBe("壹仟贰佰叁拾肆元伍角陆分")
  })

  test("defaults to traditional on zh-TW without saving a preference", () => {
    const { unmount } = render(
      <ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />
    )

    expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    fireEvent.change(getNumberInput(), { target: { value: "12" } })
    expect(getUppercaseInput().value).toBe("壹拾貳圓整")
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBeNull()

    unmount()
    render(<ChineseUppercaseNumberConverterClient {...props} />)
    expect(getUppercaseInput().value).toBe("壹拾贰元整")
  })

  test("updates the uppercase field when the number changes", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.03" },
    })

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹拾贰元零叁分")
    })
  })

  test("keeps pasted uppercase text until the user changes its style", () => {
    render(<ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />)

    const original = "  負壹圓參角伍分  "
    fireEvent.change(getUppercaseInput(), {
      target: { value: original },
    })
    expect(getNumberInput().value).toBe("-1.35")
    expect(getUppercaseInput().value).toBe(original)
    expect(window.localStorage.getItem(STORAGE_KEYS.number)).toBe("-1.35")

    fireEvent.click(
      screen.getByRole("radio", { name: messages.simplifiedLabel })
    )
    expect(getNumberInput().value).toBe("-1.35")
    expect(getUppercaseInput().value).toBe("负壹元叁角伍分")
  })

  test("copies and restores a signed amount without rewriting the input", async () => {
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue()
    const { unmount } = render(
      <ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />
    )
    fireEvent.change(getNumberInput(), { target: { value: "-1,234.50" } })
    expect(getNumberInput().value).toBe("-1,234.50")
    expect(getUppercaseInput().value).toBe("負壹仟貳佰參拾肆圓伍角")
    fireEvent.click(
      screen.getByRole("button", { name: messages.copyNumberLabel })
    )
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("-1234.50")
      expect(
        screen.getByRole("button", { name: messages.copiedLabel })
      ).toBeTruthy()
    })

    unmount()
    render(<ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />)
    expect(getNumberInput().value).toBe("-1,234.50")
    expect(getUppercaseInput().value).toBe("負壹仟貳佰參拾肆圓伍角")
  })

  test("switches to traditional output", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.traditionalLabel })
    )

    await waitFor(() => {
      expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    })
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBe(
      "traditional"
    )
  })

  test("shows validation feedback for invalid numbers", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getNumberInput(), {
      target: { value: "12.345" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.numberTooManyDecimals)).toBeTruthy()
    })

    expect(getUppercaseInput().value).toBe("")
  })

  test("keeps incorrectly grouped input and clears both copy actions", () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getNumberInput(), { target: { value: "1,2" } })

    expect(getNumberInput().value).toBe("1,2")
    expect(getUppercaseInput().value).toBe("")
    expect(screen.getByRole("alert").textContent).toBe(
      messages.numberInvalidFormat
    )
    expect(getNumberInput().getAttribute("aria-invalid")).toBe("true")
    for (const name of [
      messages.copyNumberLabel,
      messages.copyUppercaseLabel,
    ]) {
      expect(
        screen.getByRole<HTMLButtonElement>("button", { name }).disabled
      ).toBe(true)
    }

    fireEvent.change(getNumberInput(), { target: { value: "1,200" } })
    expect(screen.queryByRole("alert")).toBeNull()
    expect(getUppercaseInput().value).toBe("壹仟贰佰元整")
  })

  test("shows validation feedback for invalid uppercase text", async () => {
    render(<ChineseUppercaseNumberConverterClient {...props} />)

    fireEvent.change(getUppercaseInput(), {
      target: { value: "ABC" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.uppercaseInvalidCharacters)).toBeTruthy()
    })

    expect(getNumberInput().value).toBe("")

    fireEvent.click(
      screen.getByRole("radio", { name: messages.traditionalLabel })
    )
    expect(getUppercaseInput().value).toBe("ABC")
  })

  test.each([
    ["en", "traditional", "壹拾貳圓伍角"],
    ["zh-TW", "simplified", "壹拾贰元伍角"],
  ])(
    "restores the %s page's saved %s preference and number",
    (lang, variant, output) => {
      window.localStorage.setItem(STORAGE_KEYS.variant, variant)
      window.localStorage.setItem(STORAGE_KEYS.number, "12.5")

      render(<ChineseUppercaseNumberConverterClient {...props} lang={lang} />)

      expect(getNumberInput().value).toBe("12.5")
      expect(getUppercaseInput().value).toBe(output)
      expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBe(variant)
    }
  )

  test("persists number edits and resets to defaults", async () => {
    window.localStorage.setItem(STORAGE_KEYS.variant, "simplified")
    render(<ChineseUppercaseNumberConverterClient {...props} lang="zh-TW" />)

    fireEvent.change(getNumberInput(), {
      target: { value: "99" },
    })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.number)).toBe("99")
    })

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getNumberInput().value).toBe("1234.56")
    })

    expect(getUppercaseInput().value).toBe("壹仟貳佰參拾肆圓伍角陸分")
    expect(window.localStorage.getItem(STORAGE_KEYS.variant)).toBeNull()
  })
})
