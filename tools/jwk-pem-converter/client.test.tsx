import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import JwkPemConverterClient from "./client"
import {
  DEFAULT_JWK_INPUT,
  DEFAULT_PEM_INPUT,
  LEGACY_INPUT_STORAGE_KEYS,
  STORAGE_KEYS,
} from "./client/constants"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = {
  meta,
  ...messagesCatalog,
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:jwk-pem-output"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function getOutput() {
  return screen.queryByLabelText(
    messages.outputTitle
  ) as HTMLTextAreaElement | null
}

async function waitForOutputToContain(text: string) {
  await waitFor(() => {
    expect(getOutput()?.value).toContain(text)
  })
}

describe("JwkPemConverterClient", () => {
  test("renders the default JWK example and can clear and restore it", async () => {
    render(<JwkPemConverterClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.jwkInputTitle) as HTMLTextAreaElement)
        .value
    ).toBe(DEFAULT_JWK_INPUT)
    expect(
      screen.getByLabelText(messages.jwkInputTitle).getAttribute("dir")
    ).toBe("ltr")

    await waitForOutputToContain("BEGIN PRIVATE KEY")
    expect(screen.getByText(messages.outputDescription)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getOutput()).toBeNull()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitForOutputToContain("BEGIN PRIVATE KEY")
  })

  test("shows invalid JWK errors and can import a replacement file", async () => {
    render(<JwkPemConverterClient messages={messages} />)

    const importButtons = screen.getAllByRole("button", {
      name: messages.importFromFileLabel,
    })
    expect(importButtons).toHaveLength(1)

    fireEvent.change(screen.getByLabelText(messages.jwkInputTitle), {
      target: { value: "{" },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        messages.errorInvalidJson
      )
    })

    const file = new File([DEFAULT_JWK_INPUT], "key.jwk.json", {
      type: "application/json",
    })

    fireEvent.change(document.querySelector("input[type='file']")!, {
      target: { files: [file] },
    })

    await waitForOutputToContain("BEGIN PRIVATE KEY")
  })

  test("persists preferences but not key material", async () => {
    for (const key of LEGACY_INPUT_STORAGE_KEYS) {
      window.localStorage.setItem(key, "stale private key")
    }
    window.localStorage.setItem(STORAGE_KEYS.mode, "pem")
    window.localStorage.setItem(STORAGE_KEYS.prettyJson, "false")

    render(<JwkPemConverterClient messages={messages} />)

    expect(
      screen
        .getByRole("radio", { name: messages.tabPemToJwk })
        .getAttribute("aria-checked")
    ).toBe("true")

    fireEvent.change(screen.getByLabelText(messages.pemInputTitle), {
      target: { value: "new private key material" },
    })

    await waitFor(() => {
      for (const key of LEGACY_INPUT_STORAGE_KEYS) {
        expect(window.localStorage.getItem(key)).toBeNull()
      }
    })
    expect(window.localStorage.getItem(STORAGE_KEYS.mode)).toBe("pem")
    expect(window.localStorage.getItem(STORAGE_KEYS.prettyJson)).toBe("false")
  })

  test("shows JWKS key selection controls and can switch to public output", async () => {
    render(<JwkPemConverterClient messages={messages} />)

    const jwks = JSON.stringify(
      {
        keys: [
          {
            kid: "alpha",
            crv: "Ed25519",
            d: "IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4",
            x: "cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE",
            kty: "OKP",
          },
          {
            kid: "beta",
            crv: "Ed25519",
            d: "IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4",
            x: "cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE",
            kty: "OKP",
          },
        ],
      },
      null,
      2
    )

    fireEvent.change(screen.getByLabelText(messages.jwkInputTitle), {
      target: { value: jwks },
    })

    expect(screen.getByText(messages.keySelectHint)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("radio", { name: messages.outputTypePublic })
    )

    await waitForOutputToContain("BEGIN PUBLIC KEY")
  })

  test("converts PEM input, toggles compact JSON, and reports warnings", async () => {
    render(<JwkPemConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.tabPemToJwk }))

    expect(
      (screen.getByLabelText(messages.pemInputTitle) as HTMLTextAreaElement)
        .value
    ).toBe(DEFAULT_PEM_INPUT)

    await waitForOutputToContain('"kty": "OKP"')
    expect(
      screen.getByLabelText(messages.outputTitle).getAttribute("dir")
    ).toBe("ltr")

    fireEvent.click(screen.getByRole("switch", { name: messages.prettyJson }))

    await waitFor(() => {
      expect(getOutput()?.value).toContain('"kty":"OKP"')
      expect(getOutput()?.value.includes("\n")).toBe(false)
    })

    fireEvent.change(screen.getByLabelText(messages.pemInputTitle), {
      target: {
        value:
          `${DEFAULT_PEM_INPUT}\n` +
          "-----BEGIN CERTIFICATE-----\nAQID\n-----END CERTIFICATE-----",
      },
    })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        messages.errorUnsupportedPemLabel
      )
    })
  })
})
