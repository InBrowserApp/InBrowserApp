import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CsrGeneratorClient from "./client"
import messagesCatalog from "./messages/en.json"
import { CsrGeneratorError, type CsrOutput } from "./core/csr"
import { createCsr } from "./core/csr"
import type { CsrGeneratorMessages } from "./client/types"

vi.mock("./core/csr", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/csr")>()
  return {
    ...actual,
    createCsr: vi.fn(),
  }
})

const createCsrMock = vi.mocked(createCsr)

const messages: CsrGeneratorMessages = {
  meta: {
    name: "CSR Generator",
    description: "Generate CSRs locally.",
  },
  ...messagesCatalog,
}

beforeEach(() => {
  window.localStorage.clear()
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn(() => "blob:test"),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

describe("CsrGeneratorClient", () => {
  test("shows the empty state and localized validation errors", async () => {
    createCsrMock.mockRejectedValueOnce(
      new CsrGeneratorError("errorMissingSubjectOrSan")
    )
    render(<CsrGeneratorClient messages={messages} />)

    expect(screen.getAllByText(messages.emptyTitle).length).toBeGreaterThan(0)
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByText(messages.errorMissingSubjectOrSan)
    expect(createCsrMock).toHaveBeenCalledWith(
      expect.objectContaining({
        keySource: "generate",
        algorithm: "rsa",
      })
    )
  })

  test("generates a CSR and downloadable private key", async () => {
    createCsrMock.mockResolvedValueOnce({
      csrPem:
        "-----BEGIN CERTIFICATE REQUEST-----\nCSR\n-----END CERTIFICATE REQUEST-----",
      privateKeyPem:
        "-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----",
      keyAlgorithmLabel: "RSA 2048 (SHA-256)",
    } satisfies CsrOutput)
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.commonNameLabel), {
      target: { value: "example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.sanDnsLabel), {
      target: { value: "example.com\nwww.example.com" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByText(messages.csrTitle)
    expect(screen.getByDisplayValue(/BEGIN CERTIFICATE REQUEST/)).toBeTruthy()
    expect(screen.getByDisplayValue(/BEGIN PRIVATE KEY/)).toBeTruthy()
    expect(screen.getByText("RSA 2048 (SHA-256)")).toBeTruthy()
    expect(screen.getByText("CN=example.com")).toBeTruthy()
    expect(screen.getByText("DNS: 2")).toBeTruthy()
  })

  test("imports a private key file without re-exporting the key", async () => {
    createCsrMock.mockResolvedValueOnce({
      csrPem:
        "-----BEGIN CERTIFICATE REQUEST-----\nCSR\n-----END CERTIFICATE REQUEST-----",
      keyAlgorithmLabel: "ECDSA P-256 (SHA-256)",
    } satisfies CsrOutput)
    render(<CsrGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.importKeyLabel))
    fireEvent.change(screen.getByLabelText(messages.commonNameLabel), {
      target: { value: "imported.example" },
    })
    fireEvent.change(screen.getByLabelText(messages.privateKeyFileLabel), {
      target: {
        files: [
          new File(
            ["-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----"],
            "key.pem",
            { type: "application/x-pem-file" }
          ),
        ],
      },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.privateKeyLabel) as HTMLTextAreaElement)
          .value
      ).toContain("BEGIN PRIVATE KEY")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByText(messages.importedKeyNote)
    expect(createCsrMock).toHaveBeenCalledWith(
      expect.objectContaining({
        keySource: "import",
        keyPem: expect.stringContaining("BEGIN PRIVATE KEY"),
      })
    )
    expect(screen.queryByDisplayValue(/BEGIN PRIVATE KEY/)).toBeTruthy()
  })

  test("resets entered values and clears results", async () => {
    createCsrMock.mockResolvedValueOnce({
      csrPem:
        "-----BEGIN CERTIFICATE REQUEST-----\nCSR\n-----END CERTIFICATE REQUEST-----",
      privateKeyPem:
        "-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----",
      keyAlgorithmLabel: "RSA 2048 (SHA-256)",
    } satisfies CsrOutput)
    render(<CsrGeneratorClient messages={messages} />)

    const commonName = screen.getByLabelText(messages.commonNameLabel)
    fireEvent.change(commonName, { target: { value: "reset.example" } })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await screen.findByText(messages.csrTitle)
    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    expect((commonName as HTMLInputElement).value).toBe("")
    expect(screen.getAllByText(messages.emptyTitle).length).toBeGreaterThan(0)
  })
})
