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
import * as hashCore from "./core/hmac"

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
  fileGenerationError: "Failed to generate HMAC output for the file.",
  textGenerationError: "Failed to generate HMAC output for the text input.",
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

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

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

  test("removes legacy secrets while restoring text and algorithm preferences", async () => {
    window.localStorage.setItem(STORAGE_KEYS.secretKey, "stored-secret")
    window.localStorage.setItem(STORAGE_KEYS.algorithm, "SHA-512")
    window.localStorage.setItem(STORAGE_KEYS.text, "stored payload")

    render(<HmacGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getSecretKeyInput().value).toBe("super-secret-key")
      expect(getPlainTextInput().value).toBe("stored payload")
    })
    expect(window.localStorage.getItem(STORAGE_KEYS.secretKey)).toBeNull()

    const expected = createExpectedHmac(
      "sha512",
      "stored payload",
      "super-secret-key"
    )
    expect(await screen.findByText(expected.hex)).toBeTruthy()
  })

  test("keeps secret edits in memory while persisting text and algorithm preferences", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem")
    const view = render(<HmacGeneratorClient messages={messages} />)

    fireEvent.change(getSecretKeyInput(), {
      target: { value: "memory-only-secret" },
    })
    fireEvent.change(getPlainTextInput(), {
      target: { value: "saved payload" },
    })
    fireEvent.click(
      screen.getByRole("combobox", { name: messages.algorithmLabel })
    )
    fireEvent.click(await screen.findByRole("option", { name: "SHA-384" }))

    const expected = createExpectedHmac(
      "sha384",
      "saved payload",
      "memory-only-secret"
    )
    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(window.localStorage.getItem(STORAGE_KEYS.secretKey)).toBeNull()
    expect(window.localStorage.getItem(STORAGE_KEYS.text)).toBe("saved payload")
    expect(window.localStorage.getItem(STORAGE_KEYS.algorithm)).toBe("SHA-384")
    expect(setItemSpy).not.toHaveBeenCalledWith(
      STORAGE_KEYS.secretKey,
      expect.anything()
    )

    view.unmount()
    render(<HmacGeneratorClient messages={messages} />)

    expect(getSecretKeyInput().value).toBe("super-secret-key")
    expect(getPlainTextInput().value).toBe("saved payload")
    expect(
      await screen.findByText(
        createExpectedHmac("sha384", "saved payload", "super-secret-key").hex
      )
    ).toBeTruthy()
  })

  test("uses localized fallbacks for unknown text and file failures", async () => {
    vi.spyOn(hashCore, "generateHmac").mockRejectedValue({ message: "unknown" })
    const localizedMessages = {
      ...messages,
      fileGenerationError: "ファイルからの生成に失敗しました。",
      textGenerationError: "テキストからの生成に失敗しました。",
    }

    render(<HmacGeneratorClient messages={localizedMessages} />)

    expect(
      await screen.findByText(localizedMessages.textGenerationError)
    ).toBeTruthy()

    fireEvent.change(getFileInput(), {
      target: { files: [new File(["content"], "broken.txt")] },
    })

    expect(
      await screen.findByText(localizedMessages.fileGenerationError)
    ).toBeTruthy()
    expect(screen.queryByText(localizedMessages.textGenerationError)).toBeNull()
  })

  test("preserves Error messages from failed hashing", async () => {
    vi.spyOn(hashCore, "generateHmac").mockRejectedValue(
      new Error("Input read failed")
    )

    render(<HmacGeneratorClient messages={messages} />)

    expect(await screen.findByText("Input read failed")).toBeTruthy()
  })
})
