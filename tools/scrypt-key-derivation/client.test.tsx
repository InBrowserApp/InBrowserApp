import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import ScryptKeyDerivationClient from "./client"

const messages = {
  meta: {
    name: "scrypt Key Derivation",
    description:
      "Derive keys from a password and salt with scrypt. Configure N, r, p, and output length with hex or base64 output.",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Derive keys from a password and salt with scrypt. Configure N, r, p, and output length with hex or base64 output.",
  passwordLabel: "Password",
  passwordPlaceholder: "Password",
  saltFormatLabel: "Salt Format",
  costFactorLabel: "N (Cost Factor)",
  blockSizeLabel: "r (Block Size)",
  parallelismLabel: "p (Parallelism)",
  lengthLabel: "Derived Length (bytes)",
  costFactorRangeInvalidMessage: "Enter a whole number between 2 and 524288.",
  costFactorPowerInvalidMessage: "N must be a power of 2.",
  costFactorMemoryInvalidMessage:
    "N and r exceed the browser memory limit. Lower N or r.",
  blockSizeInvalidMessage: "Enter a whole number between 1 and 64.",
  parallelismInvalidMessage: "Enter a whole number between 1 and 32.",
  lengthInvalidMessage: "Enter a number between 16 and 256 bytes.",
  memoryEstimateLabel: "Estimated memory",
  saltLabel: "Salt",
  saltDescription: "Plain text / Random salt / Import from file",
  textSaltLabel: "Plain text",
  importFromFileLabel: "Import from file",
  generateSaltLabel: "Generate random salt",
  saltInvalidHexMessage: "Salt must be valid hex.",
  saltInvalidBase64Message: "Salt must be valid Base64.",
  derivedKeyLabel: "Derived Key",
  derivedKeyDescription:
    "Derived key for the current password, salt, and scrypt parameters.",
  emptyStateDescription:
    "Enter a password and provide a salt or import a file to derive a key.",
  deriveError: "Failed to derive the key from the provided input.",
  hexLabel: "Hexadecimal",
  base64Label: "Base64",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEYS = {
  saltFormat: "tools:scrypt-key-derivation:salt-format",
  costFactor: "tools:scrypt-key-derivation:cost-factor",
  blockSize: "tools:scrypt-key-derivation:block-size",
  parallelism: "tools:scrypt-key-derivation:parallelism",
  length: "tools:scrypt-key-derivation:length",
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

function getCostFactorInput() {
  return screen.getByLabelText(messages.costFactorLabel) as HTMLInputElement
}

function getBlockSizeInput() {
  return screen.getByLabelText(messages.blockSizeLabel) as HTMLInputElement
}

function getParallelismInput() {
  return screen.getByLabelText(messages.parallelismLabel) as HTMLInputElement
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

function setFastParams() {
  fireEvent.change(getCostFactorInput(), { target: { value: "16" } })
  fireEvent.change(getBlockSizeInput(), { target: { value: "1" } })
  fireEvent.change(getParallelismInput(), { target: { value: "1" } })
  fireEvent.change(getLengthInput(), { target: { value: "16" } })
}

function renderClient() {
  render(<ScryptKeyDerivationClient messages={messages} />)
}

describe("ScryptKeyDerivationClient", () => {
  test("starts in the idle state", () => {
    renderClient()

    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()
    expect(getSaltInput().getAttribute("placeholder")).toBe(messages.saltLabel)
    expect(
      screen.getByText(`${messages.memoryEstimateLabel}: 16 MiB`)
    ).toBeTruthy()
  })

  test("derives a key from password and text salt", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), {
      target: { value: "correct horse battery staple" },
    })
    fireEvent.change(getSaltInput(), { target: { value: "pepper" } })
    setFastParams()

    const expected = {
      hex: "7fafc85b2864a44d60fa856f438357db",
      base64: "f6/IWyhkpE1g+oVvQ4NX2w==",
    }

    expect(await screen.findByText(expected.hex)).toBeTruthy()
    expect(screen.getByText(expected.base64)).toBeTruthy()
  })

  test("imports a file salt and can switch back to text mode", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter2" } })
    setFastParams()
    fireEvent.change(getFileInput(), {
      target: {
        files: [
          new File(["raw-salt"], "salt.bin", {
            type: "application/octet-stream",
          }),
        ],
      },
    })

    await waitFor(() => {
      expect(screen.getByText("salt.bin")).toBeTruthy()
    })

    const expected = {
      hex: "9bbd0d2f2688e29c59ee53bf5826024c",
      base64: "m70NLyaI4pxZ7lO/WCYCTA==",
    }

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

  test("generates a random salt for the selected format", async () => {
    renderClient()

    selectOption(messages.saltFormatLabel, "Hex")
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateSaltLabel })
    )

    await waitFor(() => {
      expect(getSaltInput().value).toMatch(/^[\da-f]{32}$/)
    })
  })

  test("validates hex salt input before deriving", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter2" } })
    setFastParams()
    selectOption(messages.saltFormatLabel, "Hex")
    fireEvent.change(getSaltInput(), { target: { value: "abc" } })

    expect(await screen.findByText(messages.saltInvalidHexMessage)).toBeTruthy()
    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()

    fireEvent.change(getSaltInput(), { target: { value: "706570706572" } })

    const expected = {
      hex: "1cf4f2f8d64da16e2ce041bc7c93c2a2",
      base64: "HPTy+NZNoW4s4EG8fJPCog==",
    }

    expect(await screen.findByText(expected.hex)).toBeTruthy()
  })

  test("restores and persists stored configuration values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.saltFormat, "base64")
    window.localStorage.setItem(STORAGE_KEYS.costFactor, "16")
    window.localStorage.setItem(STORAGE_KEYS.blockSize, "1")
    window.localStorage.setItem(STORAGE_KEYS.parallelism, "2")
    window.localStorage.setItem(STORAGE_KEYS.length, "24")

    renderClient()

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: messages.saltFormatLabel })
          .textContent
      ).toContain("Base64")
      expect(getCostFactorInput().value).toBe("16")
      expect(getBlockSizeInput().value).toBe("1")
      expect(getParallelismInput().value).toBe("2")
      expect(getLengthInput().value).toBe("24")
    })

    fireEvent.change(getParallelismInput(), { target: { value: "3" } })

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.saltFormat)).toBe(
        "base64"
      )
      expect(window.localStorage.getItem(STORAGE_KEYS.parallelism)).toBe("3")
    })
  })

  test("blocks invalid scrypt parameters", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter2" } })
    fireEvent.change(getSaltInput(), { target: { value: "pepper" } })
    fireEvent.change(getCostFactorInput(), { target: { value: "24" } })

    expect(
      await screen.findByText(messages.costFactorPowerInvalidMessage)
    ).toBeTruthy()
    expect(screen.getByText(messages.emptyStateDescription)).toBeTruthy()

    fireEvent.change(getCostFactorInput(), { target: { value: "524288" } })
    fireEvent.change(getBlockSizeInput(), { target: { value: "2" } })

    expect(
      await screen.findByText(messages.costFactorMemoryInvalidMessage)
    ).toBeTruthy()
  })
})
