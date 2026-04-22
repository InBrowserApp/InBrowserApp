import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Bip39MnemonicGeneratorClient from "./client"

const messages = {
  meta: {
    name: "BIP39 Mnemonic Generator",
    description:
      "Generate, validate, and convert BIP39 mnemonic phrases in your browser.",
  },
  optionsTitle: "Options",
  optionsDescription:
    "Generate a fresh seed phrase, validate an imported mnemonic, or convert raw entropy without leaving the browser.",
  modeLabel: "Mode",
  generateTabLabel: "Generate",
  validateTabLabel: "Validate",
  convertTabLabel: "Convert",
  wordlistLabel: "Wordlist",
  wordCountLabel: "Word count",
  validationMnemonicLabel: "Mnemonic phrase",
  entropyInputLabel: "Entropy (hex)",
  conversionMnemonicLabel: "Mnemonic phrase",
  entropyBitsLabel: "Entropy: {bits} bits",
  resultsTitle: "Results",
  resultsDescription:
    "Review the generated phrase, checksum state, or conversion output in the active mode.",
  generatedMnemonicLabel: "Generated mnemonic",
  generatedEntropyLabel: "Generated entropy",
  validationEmptyLabel:
    "Paste a mnemonic phrase to check the checksum and recover the source entropy.",
  validationWordCountLabel: "Word count: {count}",
  validationEntropyLabel: "Recovered entropy",
  validationValidLabel: "Valid",
  validationInvalidLabel: "Invalid",
  validationValidMessage:
    "The selected wordlist and checksum both match this mnemonic.",
  validationInvalidMessage:
    "This phrase does not match the selected BIP39 wordlist or checksum.",
  entropyToMnemonicLabel: "Entropy to mnemonic",
  entropyToMnemonicPlaceholder:
    "A mnemonic phrase will appear here after you enter valid entropy.",
  mnemonicToEntropyLabel: "Mnemonic to entropy",
  mnemonicToEntropyPlaceholder:
    "Entropy will appear here after you enter a valid mnemonic phrase.",
  entropyInvalidMessage:
    "Enter 128, 160, 192, 224, or 256 bits of hexadecimal entropy.",
  mnemonicInvalidMessage:
    "Enter a valid mnemonic phrase to recover the original entropy.",
  generatedPlaceholder: "A generated seed phrase will appear here.",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  downloadLabel: "Download",
  regenerateLabel: "Regenerate",
} as const

const ZERO_ENTROPY_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:bip39-mnemonic"),
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

describe("Bip39MnemonicGeneratorClient", () => {
  test("renders a default generated mnemonic and entropy", async () => {
    render(<Bip39MnemonicGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(
        screen.getByLabelText(messages.generatedMnemonicLabel)
      ).toHaveProperty("value", ZERO_ENTROPY_MNEMONIC)
    })

    expect(
      screen.getByLabelText(messages.generatedEntropyLabel)
    ).toHaveProperty("value", "00000000000000000000000000000000")
    expect(
      screen.getByRole("link", { name: messages.downloadLabel })
    ).toHaveProperty("href", "blob:bip39-mnemonic")
  })

  test("restores stored validate state from localStorage", async () => {
    window.localStorage.setItem(
      "tools:bip39-mnemonic-generator:tab",
      "validate"
    )
    window.localStorage.setItem(
      "tools:bip39-mnemonic-generator:validate:mnemonic",
      ZERO_ENTROPY_MNEMONIC
    )

    render(<Bip39MnemonicGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText(messages.validationValidMessage)).toBeTruthy()
    })

    expect(screen.getByText(messages.validationValidLabel)).toBeTruthy()
    expect(
      screen.getByLabelText(messages.validationEntropyLabel)
    ).toHaveProperty("value", "00000000000000000000000000000000")
  })

  test("switches to convert mode and derives both outputs", async () => {
    render(<Bip39MnemonicGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.convertTabLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.entropyInputLabel), {
      target: { value: "00000000000000000000000000000000" },
    })
    fireEvent.change(screen.getByLabelText(messages.conversionMnemonicLabel), {
      target: { value: ZERO_ENTROPY_MNEMONIC },
    })

    await waitFor(() => {
      expect(
        screen.getByLabelText(messages.entropyToMnemonicLabel)
      ).toHaveProperty("value", ZERO_ENTROPY_MNEMONIC)
    })

    expect(
      screen.getByLabelText(messages.mnemonicToEntropyLabel)
    ).toHaveProperty("value", "00000000000000000000000000000000")
  })

  test("shows validation errors for invalid conversion input", async () => {
    render(<Bip39MnemonicGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.convertTabLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.entropyInputLabel), {
      target: { value: "1234" },
    })
    fireEvent.change(screen.getByLabelText(messages.conversionMnemonicLabel), {
      target: { value: "not a real mnemonic" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.entropyInvalidMessage)).toBeTruthy()
    })

    expect(screen.getByText(messages.mnemonicInvalidMessage)).toBeTruthy()
  })
})
