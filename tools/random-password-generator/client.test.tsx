import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RandomPasswordGeneratorClient from "./client"

const messages = {
  meta: {
    name: "Random Password Generator",
    description:
      "Generate passwords, passphrases, grouped codes, and PINs in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Switch between random passwords, passphrases, grouped codes, and PINs without leaving the page.",
  modeLabel: "Mode",
  randomTabLabel: "Random",
  wordsTabLabel: "Words",
  separatorTabLabel: "Blocks",
  pinTabLabel: "PIN",
  randomLengthLabel: "Length",
  characterSetLabel: "Character set",
  uppercaseLabel: "Uppercase",
  lowercaseLabel: "Lowercase",
  digitsLabel: "Digits",
  symbolsLabel: "Symbols",
  excludeSimilarLabel: "Exclude similar characters (Il1O0)",
  wordsCountLabel: "Word count",
  separatorLabel: "Separator",
  capitalizeWordsLabel: "Capitalize words",
  includeNumberLabel: "Append a number",
  blockLengthLabel: "Block length",
  blockCountLabel: "Block count",
  blockSeparatorLabel: "Block separator",
  pinLengthLabel: "Length",
  allowLeadingZeroLabel: "Allow leading zero",
  resultsTitle: "Results",
  resultsDescription:
    "Generate a fresh value, copy it, hide it on screen, or download it as a text file.",
  resultsPlaceholder: "A generated password will appear here...",
  generateLabel: "Regenerate",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadLabel: "Download",
  hideResultLabel: "Hide result",
  showResultLabel: "Show result",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:password-results"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const view = array as Uint8Array
    view.fill(0)
    return array
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getResultValue() {
  return (
    document.querySelector('[data-slot="password-result-value"]')
      ?.textContent ?? ""
  )
}

describe("RandomPasswordGeneratorClient", () => {
  test("renders the default random mode with a downloadable result", async () => {
    render(<RandomPasswordGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultValue()).toBe("AAAAAAAAAAAAAAAA")
    })

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadLabel,
    })
    expect(downloadLink).toHaveProperty("href", "blob:password-results")
    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(screen.queryByRole("button", { name: /full screen/i })).toBeNull()
    expect(screen.queryByText(/history/i)).toBeNull()
  })

  test("switches to pin mode, disables leading zero, and persists the mode", async () => {
    render(<RandomPasswordGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.pinTabLabel }))
    fireEvent.click(
      screen.getByRole("switch", { name: messages.allowLeadingZeroLabel })
    )

    await waitFor(() => {
      expect(getResultValue()).toBe("100000")
    })

    expect(
      window.localStorage.getItem("tools:random-password-generator:mode")
    ).toBe("pin")
    expect(
      window.localStorage.getItem(
        "tools:random-password-generator:pin:allowLeadingZero"
      )
    ).toBe("false")
  })

  test("restores stored word settings from localStorage", async () => {
    window.localStorage.setItem("tools:random-password-generator:mode", "words")
    window.localStorage.setItem(
      "tools:random-password-generator:words:count",
      "3"
    )
    window.localStorage.setItem(
      "tools:random-password-generator:words:separator",
      "."
    )
    window.localStorage.setItem(
      "tools:random-password-generator:words:capitalize",
      "true"
    )
    window.localStorage.setItem(
      "tools:random-password-generator:words:includeNumber",
      "true"
    )

    render(<RandomPasswordGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.separatorLabel)).toHaveProperty(
        "value",
        "."
      )
      expect(getResultValue()).toBe("Abandon.Abandon.Abandon.0")
    })
  })

  test("toggles result concealment without regenerating the value", async () => {
    render(<RandomPasswordGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getResultValue()).toBe("AAAAAAAAAAAAAAAA")
    })

    const resultValue = document.querySelector(
      '[data-slot="password-result-value"]'
    )

    expect(resultValue).not.toBeNull()
    expect(resultValue?.getAttribute("data-concealed")).toBe("false")

    fireEvent.click(
      screen.getByRole("button", { name: messages.hideResultLabel })
    )

    expect(resultValue?.getAttribute("data-concealed")).toBe("true")
    expect(getResultValue()).toBe("AAAAAAAAAAAAAAAA")

    fireEvent.click(
      screen.getByRole("button", { name: messages.showResultLabel })
    )

    expect(resultValue?.getAttribute("data-concealed")).toBe("false")
  })
})
