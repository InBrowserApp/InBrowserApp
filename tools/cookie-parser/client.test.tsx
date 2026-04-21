import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import CookieParserClient from "./client"

const messages = {
  meta: {
    name: "Cookie Parser",
    description:
      "Parse Cookie and Set-Cookie headers into structured JSON for inspection.",
  },
  headerTypeLabel: "Header Type",
  cookieHeaderLabel: "Cookie",
  setCookieHeaderLabel: "Set-Cookie",
  inputLabel: "Input",
  inputPlaceholder: "Paste Cookie or Set-Cookie headers here...",
  parsedJsonLabel: "Parsed JSON",
  emptyOutputDescription: "Parsed output will appear here...",
  cookieCountLabel: "Cookies",
  invalidCountLabel: "Invalid",
  invalidFragmentsLabel: "Invalid fragments",
  noCookiesTitle: "No cookies found",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadJsonLabel: "Download JSON",
  resetLabel: "Reset example",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("CookieParserClient", () => {
  test("renders the default cookie example", () => {
    render(<CookieParserClient messages={messages} />)

    expect(screen.getAllByText(messages.meta.description).length).toBe(2)
    expect((screen.getByLabelText("Input") as HTMLTextAreaElement).value).toBe(
      "Cookie: session=abc123; theme=light; logged_in=true"
    )
    expect(
      screen.getByRole("region", { name: "Parsed JSON" }).textContent
    ).toContain('"type": "cookie"')
    expect(screen.getByText("Cookies: 3")).toBeTruthy()
  })

  test("switches to the set-cookie example when the current input is default", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Set-Cookie" }))

    expect(
      (screen.getByLabelText("Input") as HTMLTextAreaElement).value
    ).toContain("Set-Cookie: session=abc123")
    expect(
      screen.getByRole("region", { name: "Parsed JSON" }).textContent
    ).toContain('"type": "set-cookie"')
    expect(
      screen.getByRole("region", { name: "Parsed JSON" }).textContent
    ).toContain('"samesite": "Lax"')
  })

  test("preserves custom input when switching header types", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: "Set-Cookie: mode=compact; Secure" },
    })
    fireEvent.click(screen.getByRole("radio", { name: "Set-Cookie" }))

    expect((screen.getByLabelText("Input") as HTMLTextAreaElement).value).toBe(
      "Set-Cookie: mode=compact; Secure"
    )
  })

  test("shows an alert when no valid cookies are found", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: "Cookie: token" },
    })

    expect(screen.getByRole("alert").textContent).toContain(
      messages.noCookiesTitle
    )
  })

  test("shows invalid fragments separately", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: "Cookie: a=1; token; =bad" },
    })

    expect(screen.getByText(messages.invalidFragmentsLabel)).toBeTruthy()
    expect(screen.getByText("token")).toBeTruthy()
    expect(screen.getByText("=bad")).toBeTruthy()
  })

  test("resets to the active header type example", () => {
    render(<CookieParserClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Set-Cookie" }))
    fireEvent.change(screen.getByLabelText("Input"), {
      target: { value: "Set-Cookie: theme=light" },
    })
    fireEvent.click(screen.getByText("Reset example"))

    expect(
      (screen.getByLabelText("Input") as HTMLTextAreaElement).value
    ).toContain("Set-Cookie: session=abc123")
  })

  test("restores state from localStorage on mount", () => {
    window.localStorage.setItem("tools:cookie-parser:type", "set-cookie")
    window.localStorage.setItem(
      "tools:cookie-parser:input",
      "Set-Cookie: stored=1; Secure"
    )

    render(<CookieParserClient messages={messages} />)

    expect((screen.getByLabelText("Input") as HTMLTextAreaElement).value).toBe(
      "Set-Cookie: stored=1; Secure"
    )
    expect(
      screen.getByRole("region", { name: "Parsed JSON" }).textContent
    ).toContain('"secure": true')
  })
})
