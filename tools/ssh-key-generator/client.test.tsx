import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import SshKeyGeneratorClient from "./client"

const { generateMock } = vi.hoisted(() => ({
  generateMock: vi.fn(async (options: { algorithm: "ed25519" | "rsa" }) => ({
    algorithm: options.algorithm,
    bits: options.algorithm === "rsa" ? 2048 : 256,
    comment: "user@example.com",
    fingerprintSha256: "SHA256:testfingerprint",
    keyType: options.algorithm === "rsa" ? "ssh-rsa" : "ssh-ed25519",
    privateKey:
      "-----BEGIN OPENSSH PRIVATE KEY-----\ntest\n-----END OPENSSH PRIVATE KEY-----\n",
    publicKey: `${options.algorithm === "rsa" ? "ssh-rsa" : "ssh-ed25519"} AAAA user@example.com`,
  })),
}))

vi.mock("./core/ssh-keygen", () => ({
  DEFAULT_RSA_KEY_SIZE: 4096,
  RSA_KEY_SIZES: [2048, 3072, 4096],
  generateSshKeyPair: generateMock,
  isRsaKeySize: (value: number) => [2048, 3072, 4096].includes(value),
}))

const messages = {
  meta: {
    name: "SSH Key Generator",
    description: "Generate SSH keys locally.",
  },
  optionsTitle: "Key options",
  optionsDescription: "Generate an OpenSSH key pair locally.",
  algorithmLabel: "Algorithm",
  algorithmEd25519: "Ed25519",
  algorithmRsa: "RSA",
  algorithmDescription: "Choose a key algorithm.",
  rsaSizeLabel: "RSA key size",
  rsaSizeDescription: "Choose the RSA modulus size.",
  commentLabel: "Key comment",
  commentPlaceholder: "user@example.com",
  commentDescription: "Optional public key comment.",
  generateLabel: "Generate key pair",
  generatingLabel: "Generating...",
  resetLabel: "Reset",
  outputTitle: "Generated key pair",
  outputDescription: "Copy or download the keys.",
  emptyTitle: "No key pair generated yet",
  emptyDescription: "Choose options, then generate a key pair.",
  errorTitle: "Could not generate key pair",
  errorWebCryptoUnavailable: "Web Crypto is unavailable.",
  errorGenerationFailed: "Key generation failed.",
  publicKeyTitle: "Public key",
  publicKeyDescription: "Share this public key.",
  privateKeyTitle: "Private key",
  privateKeyDescription: "Store this private key securely.",
  fingerprintLabel: "SHA-256 fingerprint",
  keyDetailsLabel: "Generated SSH key details",
  keyTypeLabel: "Key type",
  keySizeLabel: "Key size",
  commentValueLabel: "Comment",
  bitsLabel: "bits",
  noCommentLabel: "No comment",
  generatedSummary: "{algorithm} key",
  copyPublicKeyLabel: "Copy public key",
  copyPrivateKeyLabel: "Copy private key",
  copyFingerprintLabel: "Copy fingerprint",
  copiedLabel: "Copied",
  downloadPublicKeyLabel: "Download .pub",
  downloadPrivateKeyLabel: "Download private key",
  privateKeyWarningTitle: "Private key stays local",
  privateKeyWarningDescription: "The generated private key is unencrypted.",
} as const

beforeEach(() => {
  window.localStorage.clear()
  generateMock.mockClear()
  URL.createObjectURL = vi.fn(() => "blob:test")
  URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("SshKeyGeneratorClient", () => {
  test("renders an empty state before generation", () => {
    render(<SshKeyGeneratorClient messages={messages} />)

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toBeTruthy()
  })

  test("generates an Ed25519 key pair with a comment", async () => {
    render(<SshKeyGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.commentLabel), {
      target: { value: "user@example.com" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith({
        algorithm: "ed25519",
        comment: "user@example.com",
        rsaKeySize: 4096,
      })
    })
    expect(screen.getByLabelText(messages.publicKeyTitle)).toHaveProperty(
      "value",
      "ssh-ed25519 AAAA user@example.com"
    )
    expect(screen.getByText("SHA256:testfingerprint")).toBeTruthy()
    expect(
      window.localStorage.getItem("tools:ssh-key-generator:algorithm")
    ).toBe("ed25519")
  })

  test("generates an RSA key pair with the selected size", async () => {
    render(<SshKeyGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: messages.algorithmRsa }))
    fireEvent.click(screen.getByRole("radio", { name: "2048" }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith({
        algorithm: "rsa",
        comment: "",
        rsaKeySize: 2048,
      })
    })
    expect(screen.getByText("ssh-rsa")).toBeTruthy()
    expect(
      window.localStorage.getItem("tools:ssh-key-generator:rsa-key-size")
    ).toBe("2048")
  })

  test("resets options and clears generated output", async () => {
    render(<SshKeyGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )
    await screen.findByLabelText(messages.privateKeyTitle)

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.queryByLabelText(messages.privateKeyTitle)).toBeNull()
  })

  test("shows a Web Crypto specific error", async () => {
    generateMock.mockRejectedValueOnce(new Error("WEB_CRYPTO_UNAVAILABLE"))
    render(<SshKeyGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    expect(
      await screen.findByText(messages.errorWebCryptoUnavailable)
    ).toBeTruthy()
  })

  test("restores stored algorithm and RSA size", () => {
    window.localStorage.setItem("tools:ssh-key-generator:algorithm", "rsa")
    window.localStorage.setItem("tools:ssh-key-generator:rsa-key-size", "3072")

    render(<SshKeyGeneratorClient messages={messages} />)

    expect(
      screen
        .getByRole("radio", { name: messages.algorithmRsa })
        .getAttribute("data-state")
    ).toBe("on")
    expect(
      screen.getByRole("radio", { name: "3072" }).getAttribute("data-state")
    ).toBe("on")
  })
})
