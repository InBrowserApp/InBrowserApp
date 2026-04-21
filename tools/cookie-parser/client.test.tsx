import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CookieParserClient from "./client"

const messages = {
  meta: {
    name: "Cookie Parser",
    description:
      "Parse Cookie and Set-Cookie headers into structured JSON for inspection.",
  },
  configurationLabel: "Options",
  configurationDescription:
    "Choose whether the pasted text should be parsed as a Cookie header or Set-Cookie headers.",
  headerTypeLabel: "Header Type",
  headerCookieLabel: "Cookie",
  headerSetCookieLabel: "Set-Cookie",
  inputLabel: "Input",
  inputDescription:
    "Paste raw HTTP header text here. Header prefixes are optional.",
  inputPlaceholder: "Paste Cookie or Set-Cookie headers here...",
  outputLabel: "Parsed JSON",
  outputDescription:
    "Review the structured cookie data, then copy or download the JSON.",
  outputPlaceholder: "Parsed JSON will appear here...",
  copyOutputLabel: "Copy JSON",
  downloadJsonLabel: "Download JSON",
  copiedLabel: "Copied",
  resetExampleLabel: "Reset example",
  noCookiesFoundLabel: "No cookies found",
  invalidSegmentsLabel: "Skipped invalid segments",
} as const

const STORAGE_KEYS = {
  headerType: "tools:cookie-parser:type",
  input: "tools:cookie-parser:input",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:cookie-parser-output"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getInputTextarea() {
  return screen.getByRole("textbox", {
    name: messages.inputLabel,
  }) as HTMLTextAreaElement
}

function getOutputTextarea() {
  return screen.getByRole("textbox", {
    name: messages.outputLabel,
  }) as HTMLTextAreaElement
}

function selectHeaderType(option: string) {
  fireEvent.click(
    screen.getByRole("combobox", { name: messages.headerTypeLabel })
  )
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("CookieParserClient", () => {
  test("renders the default cookie example and parsed JSON", () => {
    render(<CookieParserClient messages={messages} />)

    expect(getInputTextarea().value).toContain("Cookie: session=abc123")
    expect(getOutputTextarea().value).toContain('"type": "cookie"')
    expect(getOutputTextarea().value).toContain('"logged_in"')
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("switches to set-cookie mode and updates the sample", async () => {
    render(<CookieParserClient messages={messages} />)

    selectHeaderType(messages.headerSetCookieLabel)

    expect(getInputTextarea().value).toContain("Set-Cookie: session=abc123")

    await waitFor(() => {
      expect(getOutputTextarea().value).toContain('"type": "set-cookie"')
      expect(getOutputTextarea().value).toContain('"httponly": true')
    })
  })

  test("preserves custom input when switching header type", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: "Cookie: theme=dark" },
    })

    selectHeaderType(messages.headerSetCookieLabel)

    expect(getInputTextarea().value).toBe("Cookie: theme=dark")
  })

  test("shows skipped invalid segments when parsing partially invalid input", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: "Cookie: token; a=1" },
    })

    expect(screen.getByText(messages.invalidSegmentsLabel)).toBeTruthy()
    expect(screen.getByText("token")).toBeTruthy()
  })

  test("shows a no cookies alert when parsing yields no cookie pairs", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(getInputTextarea(), {
      target: { value: "Cookie:" },
    })

    expect(screen.getByText(messages.noCookiesFoundLabel)).toBeTruthy()
  })

  test("restores header type and input from localStorage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.headerType, "set-cookie")
    window.localStorage.setItem(
      STORAGE_KEYS.input,
      "Set-Cookie: token=abc; Path=/; Secure"
    )

    render(<CookieParserClient messages={messages} />)

    expect(
      screen.getByRole("combobox", { name: messages.headerTypeLabel })
        .textContent
    ).toContain(messages.headerSetCookieLabel)
    expect(getInputTextarea().value).toBe(
      "Set-Cookie: token=abc; Path=/; Secure"
    )

    await waitFor(() => {
      expect(getOutputTextarea().value).toContain('"secure": true')
    })
  })

  test("persists the input and header type to localStorage", () => {
    render(<CookieParserClient messages={messages} />)

    selectHeaderType(messages.headerSetCookieLabel)
    fireEvent.change(getInputTextarea(), {
      target: { value: "Set-Cookie: lang=en; Path=/" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.headerType)).toBe(
      "set-cookie"
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.input)).toBe(
      "Set-Cookie: lang=en; Path=/"
    )
  })

  test("resets the current example", async () => {
    render(<CookieParserClient messages={messages} />)

    selectHeaderType(messages.headerSetCookieLabel)
    fireEvent.change(getInputTextarea(), {
      target: { value: "Set-Cookie: changed=1" },
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.resetExampleLabel })
    )

    expect(getInputTextarea().value).toContain("Set-Cookie: session=abc123")

    await waitFor(() => {
      expect(getOutputTextarea().value).toContain('"type": "set-cookie"')
    })
  })

  test("renders a downloadable JSON file", () => {
    render(<CookieParserClient messages={messages} />)

    const downloadLink = screen.getByRole("link", {
      name: messages.downloadJsonLabel,
    })

    expect(downloadLink.getAttribute("href")).toBe("blob:cookie-parser-output")
    expect(downloadLink.getAttribute("download")).toBe("cookies.json")
  })
})
