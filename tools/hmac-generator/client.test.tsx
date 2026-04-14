import { createHmac, webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import HmacGeneratorClient from "./client"

const messages = {
  meta: {
    name: "HMAC Generator",
    description: "Generate HMAC output directly in your browser.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Set the secret key and HMAC algorithm for the current signature.",
  secretKeyLabel: "Secret Key",
  secretKeyPlaceholder: "Enter your secret key",
  algorithmLabel: "Algorithm",
  inputLabel: "Input",
  plainTextLabel: "Plain text",
  plainTextDescription:
    "Paste or type any UTF-8 text, including file contents or API payloads.",
  importFromFileLabel: "Import from file",
  hmacOutputLabel: "HMAC Output",
  hmacOutputDescription:
    "HMAC output for the current text input and secret key.",
  emptyStateDescription:
    "Enter a secret key and provide text or import a file to generate HMAC output.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  text: "tools:hmac-generator:text",
  secretKey: "tools:hmac-generator:secret-key",
  algorithm: "tools:hmac-generator:algorithm",
} as const

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
  window.localStorage.clear()
})

afterEach(cleanup)

function getPlainTextInput() {
  return screen.getByRole("textbox", {
    name: messages.plainTextLabel,
  }) as HTMLTextAreaElement
}

function getSecretKeyInput() {
  return screen.getByLabelText(messages.secretKeyLabel) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function createExpectedHmac(
  algorithm: "sha1" | "sha256" | "sha384" | "sha512",
  text: string,
  secretKey: string
) {
  return {
    hex: createHmac(algorithm, secretKey).update(text).digest("hex"),
    base64: createHmac(algorithm, secretKey).update(text).digest("base64"),
  }
}

describe("HmacGeneratorClient", () => {
  test("renders the default example and its HMAC output", async () => {
    render(<HmacGeneratorClient messages={messages} />)

    const expected = createExpectedHmac(
      "sha256",
      "Hello, authenticated browser-native world!",
      "super-secret-key"
    )

    expect(getPlainTextInput().value).toBe(
      "Hello, authenticated browser-native world!"
    )
    expect(getSecretKeyInput().value).toBe("super-secret-key")
    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(screen.getByText(expected.base64)).toBeTruthy()
  })

  test("updates HMAC output when text and secret key change", async () => {
    render(<HmacGeneratorClient messages={messages} />)

    fireEvent.change(getSecretKeyInput(), {
      target: { value: "another-secret" },
    })
    fireEvent.change(getPlainTextInput(), {
      target: { value: "payload" },
    })

    const expected = createExpectedHmac("sha256", "payload", "another-secret")

    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(screen.getByText(expected.base64)).toBeTruthy()
  })

  test("imports a file and renders HMAC output", async () => {
    render(<HmacGeneratorClient messages={messages} />)

    const file = new File(["hello from file"], "payload.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("payload.txt")).toBeTruthy()
    })

    const expected = createExpectedHmac(
      "sha256",
      "hello from file",
      "super-secret-key"
    )

    expect(
      screen.queryByRole("textbox", { name: messages.plainTextLabel })
    ).toBeNull()
    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(screen.getByText(expected.base64)).toBeTruthy()
  })

  test("shows idle state without a secret key", async () => {
    render(<HmacGeneratorClient messages={messages} />)

    fireEvent.change(getSecretKeyInput(), {
      target: { value: "" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
    })
  })

  test("restores stored configuration values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.secretKey, "stored-secret")
    window.localStorage.setItem(STORAGE_KEYS.algorithm, "SHA-512")
    window.localStorage.setItem(STORAGE_KEYS.text, "stored payload")

    render(<HmacGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getSecretKeyInput().value).toBe("stored-secret")
      expect(getPlainTextInput().value).toBe("stored payload")
    })

    const expected = createExpectedHmac(
      "sha512",
      "stored payload",
      "stored-secret"
    )
    expect(await screen.findByText(expected.hex)).toBeTruthy()
  })
})
