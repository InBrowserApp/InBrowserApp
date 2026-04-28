import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import meta from "./meta/en.json"
import messages from "./messages/en.json"
import UrlParserBuilderClient from "./client"
import { RESET_URL, SAMPLE_URL, STORAGE_KEY } from "./constants"

const localizedMessages = { meta, ...messages } as const

function getControlValue(label: string) {
  const element = screen.getByLabelText(label) as
    | HTMLInputElement
    | HTMLTextAreaElement

  return element.value
}

afterEach(() => {
  window.localStorage.clear()
  cleanup()
})

describe("UrlParserBuilderClient", () => {
  test("restores a stored URL and exposes parsed fields", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      "https://marina@example.com/store?ref=team#reviews"
    )

    render(<UrlParserBuilderClient messages={localizedMessages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.urlLabel)).toBeTruthy()
    })

    expect(getControlValue(messages.urlLabel)).toBe(
      "https://marina@example.com/store?ref=team#reviews"
    )
    expect(getControlValue(messages.finalUrlLabel)).toBe(
      "https://marina@example.com/store?ref=team#reviews"
    )
    expect(getControlValue(messages.protocolLabel)).toBe("https")
    expect(getControlValue(messages.usernameLabel)).toBe("marina")
    expect(getControlValue(messages.hostnameLabel)).toBe("example.com")
    expect(getControlValue(messages.pathLabel)).toBe("/store")
    expect(getControlValue(messages.fragmentLabel)).toBe("reviews")
    expect(getControlValue(`${messages.paramKeyLabel} 1`)).toBe("ref")
    expect(getControlValue(`${messages.paramValueLabel} 1`)).toBe("team")
  })

  test("updates the final URL when component fields change", async () => {
    render(<UrlParserBuilderClient messages={localizedMessages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    const protocolInput = screen.getByLabelText(messages.protocolLabel)
    const hostnameInput = screen.getByLabelText(messages.hostnameLabel)
    const pathInput = screen.getByLabelText(messages.pathLabel)

    fireEvent.change(protocolInput, { target: { value: "http" } })
    fireEvent.change(hostnameInput, { target: { value: "docs.inbrowser.app" } })
    fireEvent.change(pathInput, { target: { value: "/guides/url parsing" } })

    await waitFor(() => {
      expect(getControlValue(messages.finalUrlLabel)).toBe(
        "http://docs.inbrowser.app/guides/url%20parsing"
      )
    })
  })

  test("shows a parse error for invalid input and recovers through reset", async () => {
    render(<UrlParserBuilderClient messages={localizedMessages} />)

    fireEvent.change(screen.getByLabelText(messages.urlLabel), {
      target: { value: "broken" },
    })

    expect(screen.getByText(messages.parseErrorTitle)).toBeTruthy()
    expect(getControlValue(messages.finalUrlLabel)).toBe("")

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getControlValue(messages.urlLabel)).toBe(RESET_URL)
    })
  })

  test("adds, edits, and removes structured query parameters", async () => {
    render(<UrlParserBuilderClient messages={localizedMessages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(getControlValue(messages.urlLabel)).toBe(RESET_URL)
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.addParamLabel })
    )

    const keyInput = screen.getByLabelText(`${messages.paramKeyLabel} 1`)
    const valueInput = screen.getByLabelText(`${messages.paramValueLabel} 1`)

    fireEvent.change(keyInput, { target: { value: "q" } })
    fireEvent.change(valueInput, { target: { value: "coffee beans" } })

    await waitFor(() => {
      expect(getControlValue(messages.finalUrlLabel)).toBe(
        "https://example.com/?q=coffee+beans"
      )
    })

    fireEvent.click(screen.getByLabelText(messages.removeParamLabel))

    await waitFor(() => {
      expect(getControlValue(messages.finalUrlLabel)).toBe(RESET_URL)
    })
  })

  test("loads the sample URL from the action button", async () => {
    render(<UrlParserBuilderClient messages={localizedMessages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(getControlValue(messages.urlLabel)).toBe(SAMPLE_URL)
    })
  })
})
