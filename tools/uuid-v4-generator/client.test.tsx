import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV4GeneratorClient from "./client"

const messages = {
  meta: {
    name: "UUID v4 Generator",
    description:
      "Generate a random RFC 4122/RFC 9562 UUID v4 locally in your browser.",
  },
  resultTitle: "Generated UUID",
  resultDescription:
    "Generate one canonical lowercase UUID v4 and copy it when it is ready.",
  uuidLabel: "UUID v4",
  regenerateLabel: "Regenerate",
  copyLabel: "Copy UUID",
  copiedLabel: "Copied",
  detailsTitle: "Format details",
  detailsDescription:
    "UUID v4 values use random bytes plus fixed version and variant bits.",
  versionLabel: "Version",
  versionValue: "4, random",
  variantLabel: "Variant",
  variantValue: "RFC 4122",
  entropyLabel: "Random bits",
  entropyValue: "122 bits",
  privacyTitle: "Local generation",
  privacyDescription:
    "The UUID is generated with Web Crypto in this browser tab.",
  errorTitle: "Cannot generate UUID",
  cryptoUnavailableMessage: "Web Crypto random values are not available.",
} as const

let byteOffset = 0

beforeEach(() => {
  byteOffset = 0

  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const bytes = new Uint8Array(
      array.buffer,
      array.byteOffset,
      array.byteLength
    )

    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = (byteOffset + index) % 256
    }

    byteOffset = (byteOffset + bytes.length) % 256
    return array
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getUuidOutput() {
  return screen.getByLabelText(messages.uuidLabel) as HTMLOutputElement
}

describe("UuidV4GeneratorClient", () => {
  test("does not generate a UUID while rendering static HTML", () => {
    const html = renderToString(<UuidV4GeneratorClient messages={messages} />)

    expect(globalThis.crypto.getRandomValues).not.toHaveBeenCalled()
    expect(html).not.toMatch(
      /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/u
    )
  })

  test("generates an initial UUID after mounting and renders format details", async () => {
    render(<UuidV4GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getUuidOutput().textContent).toBe(
        "00010203-0405-4607-8809-0a0b0c0d0e0f"
      )
    })
    expect(screen.getByText(messages.versionValue).textContent).toBe(
      messages.versionValue
    )
    expect(screen.getByText(messages.entropyValue).textContent).toBe(
      messages.entropyValue
    )
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).not.toHaveProperty("disabled", true)
  })

  test("regenerates a new UUID on demand", async () => {
    render(<UuidV4GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getUuidOutput().textContent).toBe(
        "00010203-0405-4607-8809-0a0b0c0d0e0f"
      )
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.regenerateLabel })
    )

    await waitFor(() => {
      expect(getUuidOutput().textContent).toBe(
        "10111213-1415-4617-9819-1a1b1c1d1e1f"
      )
    })
  })

  test("shows an error when Web Crypto is unavailable", () => {
    vi.restoreAllMocks()
    vi.stubGlobal("crypto", {})

    render(<UuidV4GeneratorClient messages={messages} />)

    expect(screen.getByText(messages.errorTitle).textContent).toBe(
      messages.errorTitle
    )
    expect(getUuidOutput().textContent).toBe("")
    expect(
      screen.getByRole("button", { name: messages.copyLabel })
    ).toHaveProperty("disabled", true)
  })
})
