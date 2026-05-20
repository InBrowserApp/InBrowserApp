import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CsrGeneratorClient from "./client"
import { CsrGeneratorError, type CsrResult } from "./core/csr"
import type { CsrGeneratorMessages } from "./client/types"

const { generateMock } = vi.hoisted(() => ({
  generateMock: vi.fn(
    async (): Promise<CsrResult> => ({
      csrPem:
        "-----BEGIN CERTIFICATE REQUEST-----\nMIIBcjCC\n-----END CERTIFICATE REQUEST-----\n",
      privateKeyPem:
        "-----BEGIN PRIVATE KEY-----\nMIIE\n-----END PRIVATE KEY-----\n",
      keyAlgorithmLabel: "RSA 2048 (SHA-256)",
    })
  ),
}))

vi.mock("./core/csr", async () => {
  const actual =
    await vi.importActual<typeof import("./core/csr")>("./core/csr")

  return {
    ...actual,
    generateCsr: generateMock,
  }
})

const messages: CsrGeneratorMessages = {
  meta: { name: "CSR Generator", description: "Generate CSRs locally." },
  optionsTitle: "Request options",
  optionsDescription: "Set the key, subject, and SAN entries.",
  keySourceLabel: "Key source",
  keySourceGenerate: "Generate new",
  keySourceImport: "Import existing",
  algorithmLabel: "Algorithm",
  algorithmRsa: "RSA",
  algorithmEcdsa: "ECDSA",
  rsaKeySizeLabel: "RSA key size",
  rsaHashLabel: "Signature hash",
  ecCurveLabel: "Curve",
  importLabel: "Private key (PKCS#8 PEM)",
  importPlaceholder: "PEM here",
  importDescription: "Paste a PKCS#8 PEM",
  subjectTitle: "Subject",
  subjectDescription: "Subject DN",
  subjectCommonNameLabel: "Common Name",
  subjectCommonNamePlaceholder: "example.com",
  subjectOrganizationLabel: "Organization",
  subjectOrganizationalUnitLabel: "Organizational Unit",
  subjectCountryLabel: "Country",
  subjectCountryPlaceholder: "ISO code",
  subjectStateLabel: "State",
  subjectLocalityLabel: "Locality",
  subjectEmailLabel: "Email",
  sanTitle: "SAN",
  sanDescription: "SAN entries",
  sanDnsLabel: "DNS",
  sanDnsPlaceholder: "example.com",
  sanIpLabel: "IP",
  sanIpPlaceholder: "10.0.0.1",
  sanEmailLabel: "Email SAN",
  sanEmailPlaceholder: "admin@example.com",
  sanUriLabel: "URI",
  sanUriPlaceholder: "https://example.com",
  generateLabel: "Generate CSR",
  generatingLabel: "Generating",
  resetLabel: "Reset",
  outputTitle: "Generated CSR",
  outputDescription: "Copy or download.",
  emptyTitle: "No CSR yet",
  emptyDescription: "Generate to begin.",
  errorTitle: "Could not generate CSR",
  errorMissingSubjectOrSan: "Subject or SAN required.",
  errorMissingPrivateKey: "Key required.",
  errorInvalidPem: "Invalid PEM.",
  errorUnsupportedPem: "Unsupported PEM.",
  errorLegacyPem: "Legacy PEM.",
  errorEncryptedKey: "Encrypted PEM.",
  errorUnsupportedKeyType: "Unsupported key type.",
  errorUnsupportedCurve: "Unsupported curve.",
  errorInvalidSanIp: "Invalid IP SAN: {detail}",
  errorWebCryptoUnavailable: "No Web Crypto.",
  errorImportFailed: "Import failed.",
  errorGenerationFailed: "Generation failed.",
  csrTitle: "CSR",
  csrDescription: "PEM",
  privateKeyTitle: "Private key",
  privateKeyDescription: "PEM",
  privateKeyWarningTitle: "Private key stays local",
  privateKeyWarningDescription: "Local only.",
  keyAlgorithmLabel: "Key algorithm",
  copyCsrLabel: "Copy CSR",
  copyPrivateKeyLabel: "Copy private key",
  copiedLabel: "Copied",
  downloadCsrLabel: "Download .csr",
  downloadPrivateKeyLabel: "Download .pem",
}

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

describe("CsrGeneratorClient", () => {
  test("renders an empty output state before generation", () => {
    render(<CsrGeneratorClient messages={messages} />)

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toBeTruthy()
  })

  test("generates a CSR with the default settings", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByLabelText(messages.csrTitle)).toHaveProperty(
      "value",
      "-----BEGIN CERTIFICATE REQUEST-----\nMIIBcjCC\n-----END CERTIFICATE REQUEST-----\n"
    )
    expect(screen.getAllByText("RSA 2048 (SHA-256)").length).toBeGreaterThan(0)
    expect(window.localStorage.getItem("tools:csr-generator:algorithm")).toBe(
      "rsa"
    )
  })

  test("switches to ECDSA and forwards the curve choice", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.algorithmEcdsa })
    )
    fireEvent.click(screen.getByRole("radio", { name: "P-384" }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith(
        expect.objectContaining({ algorithm: "ecdsa", ecCurve: "P-384" })
      )
    })
  })

  test("switches RSA key size and signature hash", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "3072" }))
    fireEvent.click(screen.getByRole("radio", { name: "SHA-512" }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith(
        expect.objectContaining({ rsaKeySize: 3072, rsaHash: "SHA-512" })
      )
    })
  })

  test("switches to import mode and forwards the PEM input", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.keySourceImport })
    )
    fireEvent.change(screen.getByLabelText(messages.importLabel), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\nAAA\n-----END PRIVATE KEY-----",
      },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith(
        expect.objectContaining({ keySource: "import" })
      )
    })
  })

  test("collects subject and SAN entries", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.subjectCommonNameLabel), {
      target: { value: "test.example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.subjectOrganizationLabel), {
      target: { value: "Test Org" },
    })
    fireEvent.change(
      screen.getByLabelText(messages.subjectOrganizationalUnitLabel),
      { target: { value: "Test OU" } }
    )
    fireEvent.change(screen.getByLabelText(messages.subjectCountryLabel), {
      target: { value: "us" },
    })
    fireEvent.change(screen.getByLabelText(messages.subjectStateLabel), {
      target: { value: "CA" },
    })
    fireEvent.change(screen.getByLabelText(messages.subjectLocalityLabel), {
      target: { value: "San Francisco" },
    })
    fireEvent.change(screen.getByLabelText(messages.subjectEmailLabel), {
      target: { value: "admin@example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.sanDnsLabel), {
      target: { value: "test.example.com\nwww.example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.sanIpLabel), {
      target: { value: "10.0.0.1" },
    })
    fireEvent.change(screen.getByLabelText(messages.sanEmailLabel), {
      target: { value: "san@example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.sanUriLabel), {
      target: { value: "https://example.com" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(generateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.objectContaining({
            commonName: "test.example.com",
            organization: "Test Org",
            organizationalUnit: "Test OU",
            country: "US",
            state: "CA",
            locality: "San Francisco",
            emailAddress: "admin@example.com",
          }),
          san: expect.objectContaining({
            dns: ["test.example.com", "www.example.com"],
            ip: ["10.0.0.1"],
            email: ["san@example.com"],
            uri: ["https://example.com"],
          }),
        })
      )
    })
  })

  test("renders the import-mode hash selector and download links", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.keySourceImport })
    )
    expect(
      screen.queryByRole("radio", { name: messages.algorithmRsa })
    ).toBeNull()

    const importInput = screen.getByLabelText(
      messages.importLabel
    ) as HTMLTextAreaElement
    fireEvent.change(importInput, {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\nAAA\n-----END PRIVATE KEY-----\n",
      },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByLabelText(messages.csrTitle)

    expect(
      await screen.findByRole("link", { name: messages.downloadCsrLabel })
    ).toHaveProperty("href", "blob:test")
    expect(
      await screen.findByRole("link", {
        name: messages.downloadPrivateKeyLabel,
      })
    ).toHaveProperty("href", "blob:test")
  })

  test("hides the private key panel when no key was generated", async () => {
    generateMock.mockResolvedValueOnce({
      csrPem:
        "-----BEGIN CERTIFICATE REQUEST-----\nMIIBcjCC\n-----END CERTIFICATE REQUEST-----\n",
      keyAlgorithmLabel: "RSA 2048 (SHA-256)",
    })

    render(<CsrGeneratorClient messages={messages} />)
    fireEvent.click(
      screen.getByRole("radio", { name: messages.keySourceImport })
    )
    fireEvent.change(screen.getByLabelText(messages.importLabel), {
      target: {
        value: "-----BEGIN PRIVATE KEY-----\nAAA\n-----END PRIVATE KEY-----\n",
      },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )
    await screen.findByLabelText(messages.csrTitle)

    expect(screen.queryByLabelText(messages.privateKeyTitle)).toBeNull()
  })

  test("shows the localized message for known error codes", async () => {
    generateMock.mockRejectedValueOnce(
      new CsrGeneratorError("MISSING_SUBJECT_OR_SAN")
    )

    render(<CsrGeneratorClient messages={messages} />)
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    expect(
      await screen.findByText(messages.errorMissingSubjectOrSan)
    ).toBeTruthy()
  })

  test("interpolates the detail token for parameterised errors", async () => {
    generateMock.mockRejectedValueOnce(
      new CsrGeneratorError("INVALID_SAN_IP", "not-an-ip")
    )

    render(<CsrGeneratorClient messages={messages} />)
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    expect(await screen.findByText("Invalid IP SAN: not-an-ip")).toBeTruthy()
  })

  test("resets all options and clears the output", async () => {
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "3072" }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )
    await screen.findByLabelText(messages.csrTitle)

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.queryByLabelText(messages.csrTitle)).toBeNull()
    expect(
      screen.getByRole("radio", { name: "2048" }).getAttribute("data-state")
    ).toBe("on")
  })

  test("restores stored preferences on mount", () => {
    window.localStorage.setItem("tools:csr-generator:key-source", "generate")
    window.localStorage.setItem("tools:csr-generator:algorithm", "ecdsa")
    window.localStorage.setItem("tools:csr-generator:ec-curve", "P-521")
    window.localStorage.setItem("tools:csr-generator:rsa-key-size", "4096")
    window.localStorage.setItem("tools:csr-generator:rsa-hash", "SHA-384")
    window.localStorage.setItem(
      "tools:csr-generator:subject",
      JSON.stringify({
        commonName: "restored.example.com",
        organization: "",
        organizationalUnit: "",
        country: "",
        state: "",
        locality: "",
        emailAddress: "",
      })
    )
    window.localStorage.setItem(
      "tools:csr-generator:san-dns",
      JSON.stringify("restored.example.com")
    )

    render(<CsrGeneratorClient messages={messages} />)

    expect(
      screen
        .getByRole("radio", { name: messages.algorithmEcdsa })
        .getAttribute("data-state")
    ).toBe("on")
    expect(
      screen.getByRole("radio", { name: "P-521" }).getAttribute("data-state")
    ).toBe("on")
    const commonNameInput = screen.getByLabelText(
      messages.subjectCommonNameLabel
    ) as HTMLInputElement
    expect(commonNameInput.value).toBe("restored.example.com")
    const sanDnsInput = screen.getByLabelText(
      messages.sanDnsLabel
    ) as HTMLTextAreaElement
    expect(sanDnsInput.value).toBe("restored.example.com")
  })

  test("ignores corrupt persisted JSON entries", () => {
    window.localStorage.setItem("tools:csr-generator:subject", "{not json")
    window.localStorage.setItem("tools:csr-generator:san-dns", "{not json")

    render(<CsrGeneratorClient messages={messages} />)

    const commonNameInput = screen.getByLabelText(
      messages.subjectCommonNameLabel
    ) as HTMLInputElement
    expect(commonNameInput.value).toBe("example.com")
  })

  test("ignores unknown persisted values", () => {
    window.localStorage.setItem("tools:csr-generator:algorithm", "not-real")
    window.localStorage.setItem("tools:csr-generator:rsa-key-size", "999")

    render(<CsrGeneratorClient messages={messages} />)

    expect(
      screen
        .getByRole("radio", { name: messages.algorithmRsa })
        .getAttribute("data-state")
    ).toBe("on")
    expect(
      screen.getByRole("radio", { name: "2048" }).getAttribute("data-state")
    ).toBe("on")
  })
})
