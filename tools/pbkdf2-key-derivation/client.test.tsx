import { pbkdf2Sync, webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Pbkdf2KeyDerivationClient from "./client"

const messages = {
  meta: {
    name: "PBKDF2 Key Derivation",
    description:
      "Derive keys from a password and salt with PBKDF2. Configure iterations, hash algorithm, and output length with hex or base64 output.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Derive keys from a password and salt with PBKDF2. Configure iterations, hash algorithm, and output length with hex or base64 output.",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  algorithmLabel: "Algorithm",
  saltFormatLabel: "Salt Format",
  iterationsLabel: "Iterations",
  lengthLabel: "Derived Length (bytes)",
  iterationsInvalidMessage: "Enter a whole number between 1 and 1000000.",
  lengthInvalidMessage: "Enter a number between 16 and 256 bytes.",
  saltLabel: "Salt",
  saltDescription: "Text salt / Import from file",
  textSaltLabel: "Text salt",
  importFromFileLabel: "Import from file",
  saltInvalidHexMessage: "Salt must be valid hex.",
  saltInvalidBase64Message: "Salt must be valid Base64.",
  derivedKeyLabel: "Derived Key",
  derivedKeyDescription: "Derived key for the current password and salt input.",
  emptyStateDescription:
    "Enter a password and provide a salt or import a file to derive a key.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  algorithm: "tools:pbkdf2-key-derivation:algorithm",
  saltFormat: "tools:pbkdf2-key-derivation:salt-format",
  iterations: "tools:pbkdf2-key-derivation:iterations",
  length: "tools:pbkdf2-key-derivation:length",
} as const

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
  window.localStorage.clear()
})

afterEach(cleanup)

function getPasswordInput() {
  return screen.getByLabelText(messages.passwordLabel) as HTMLInputElement
}

function getSaltInput() {
  return screen.getByRole("textbox", {
    name: messages.saltLabel,
  }) as HTMLInputElement
}

function getIterationsInput() {
  return screen.getByLabelText(messages.iterationsLabel) as HTMLInputElement
}

function getLengthInput() {
  return screen.getByLabelText(messages.lengthLabel) as HTMLInputElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function selectOption(label: string, option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: label }))
  fireEvent.click(screen.getByRole("option", { name: option }))
}

function deriveExpectedKey({
  password,
  salt,
  iterations,
  lengthBytes,
  hash,
}: Readonly<{
  password: string
  salt: Buffer
  iterations: number
  lengthBytes: number
  hash: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
}>) {
  const derived = pbkdf2Sync(
    password,
    salt,
    iterations,
    lengthBytes,
    hash.toLowerCase().replace("-", "")
  )

  return {
    hex: derived.toString("hex"),
    base64: derived.toString("base64"),
  }
}

describe("Pbkdf2KeyDerivationClient", () => {
  test("starts in the idle state", () => {
    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
    expect(getSaltInput().getAttribute("placeholder")).toBe(messages.saltLabel)
  })

  test("derives a key from password and text salt", async () => {
    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    fireEvent.change(getPasswordInput(), {
      target: { value: "correct horse battery staple" },
    })
    fireEvent.change(getSaltInput(), {
      target: { value: "pepper" },
    })
    fireEvent.change(getIterationsInput(), {
      target: { value: "2" },
    })
    fireEvent.change(getLengthInput(), {
      target: { value: "16" },
    })

    const expected = deriveExpectedKey({
      password: "correct horse battery staple",
      salt: Buffer.from("pepper", "utf8"),
      iterations: 2,
      lengthBytes: 16,
      hash: "SHA-256",
    })

    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(screen.getByText(expected.base64)).toBeTruthy()
  })

  test("imports a file salt and can switch back to text mode", async () => {
    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    fireEvent.change(getPasswordInput(), {
      target: { value: "hunter2" },
    })
    fireEvent.change(getIterationsInput(), {
      target: { value: "2" },
    })
    fireEvent.change(getLengthInput(), {
      target: { value: "16" },
    })

    const file = new File(["raw-salt"], "salt.bin", {
      type: "application/octet-stream",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(screen.getByText("salt.bin")).toBeTruthy()
    })

    const expected = deriveExpectedKey({
      password: "hunter2",
      salt: Buffer.from("raw-salt"),
      iterations: 2,
      lengthBytes: 16,
      hash: "SHA-256",
    })

    expect(
      screen.queryByRole("textbox", { name: messages.saltLabel })
    ).toBeNull()
    expect(await screen.findByText(expected.hex)).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.textSaltLabel })
    )

    expect(
      screen.getByRole("textbox", { name: messages.saltLabel })
    ).toBeTruthy()
  })

  test("validates hex salt input before deriving", async () => {
    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    fireEvent.change(getPasswordInput(), {
      target: { value: "hunter2" },
    })
    fireEvent.change(getIterationsInput(), {
      target: { value: "2" },
    })
    fireEvent.change(getLengthInput(), {
      target: { value: "16" },
    })
    selectOption(messages.saltFormatLabel, "Hex")

    fireEvent.change(getSaltInput(), {
      target: { value: "abc" },
    })

    expect(await screen.findByText(messages.saltInvalidHexMessage)).toBeTruthy()
    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()

    fireEvent.change(getSaltInput(), {
      target: { value: "706570706572" },
    })

    const expected = deriveExpectedKey({
      password: "hunter2",
      salt: Buffer.from("pepper"),
      iterations: 2,
      lengthBytes: 16,
      hash: "SHA-256",
    })

    expect(await screen.findByText(expected.hex)).toBeTruthy()
  })

  test("restores and persists stored configuration values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.algorithm, "SHA-512")
    window.localStorage.setItem(STORAGE_KEYS.saltFormat, "base64")
    window.localStorage.setItem(STORAGE_KEYS.iterations, "2")
    window.localStorage.setItem(STORAGE_KEYS.length, "16")

    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: messages.algorithmLabel })
          .textContent
      ).toContain("SHA-512")
      expect(
        screen.getByRole("combobox", { name: messages.saltFormatLabel })
          .textContent
      ).toContain("Base64")
      expect(getIterationsInput().value).toBe("2")
      expect(getLengthInput().value).toBe("16")
    })

    fireEvent.change(getIterationsInput(), {
      target: { value: "3" },
    })
    selectOption(messages.algorithmLabel, "SHA-1")

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.algorithm)).toBe("SHA-1")
      expect(window.localStorage.getItem(STORAGE_KEYS.saltFormat)).toBe(
        "base64"
      )
      expect(window.localStorage.getItem(STORAGE_KEYS.iterations)).toBe("3")
      expect(window.localStorage.getItem(STORAGE_KEYS.length)).toBe("16")
    })
  })

  test("surfaces Web Crypto errors in the result card", async () => {
    vi.stubGlobal("crypto", undefined)

    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    fireEvent.change(getPasswordInput(), {
      target: { value: "hunter2" },
    })
    fireEvent.change(getSaltInput(), {
      target: { value: "pepper" },
    })
    fireEvent.change(getIterationsInput(), {
      target: { value: "2" },
    })
    fireEvent.change(getLengthInput(), {
      target: { value: "16" },
    })

    expect(
      await screen.findByText(
        "PBKDF2 key derivation requires Web Crypto support."
      )
    ).toBeTruthy()
  })

  test("blocks invalid length values", async () => {
    render(<Pbkdf2KeyDerivationClient messages={messages} />)

    fireEvent.change(getPasswordInput(), {
      target: { value: "hunter2" },
    })
    fireEvent.change(getSaltInput(), {
      target: { value: "pepper" },
    })
    fireEvent.change(getIterationsInput(), {
      target: { value: "2" },
    })
    fireEvent.change(getLengthInput(), {
      target: { value: "8" },
    })

    expect(await screen.findByText(messages.lengthInvalidMessage)).toBeTruthy()
    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
  })
})
