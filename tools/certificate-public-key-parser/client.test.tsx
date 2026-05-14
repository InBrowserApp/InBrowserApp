import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import CertificatePublicKeyParserClient from "./client"
import { DEFAULT_INPUT, STORAGE_KEYS } from "./client/constants"
import { base64ToArrayBuffer } from "./core/certificate-helpers"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = {
  meta,
  ...messagesCatalog,
} as const

const publicKeyBase64 = DEFAULT_INPUT.match(
  /-----BEGIN PUBLIC KEY-----([\s\S]*?)-----END PUBLIC KEY-----/
)![1]!.replace(/\s+/g, "")

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto)
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.inputLabel,
  }) as HTMLTextAreaElement
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("CertificatePublicKeyParserClient", () => {
  test("renders the default certificate and public key sample", async () => {
    render(<CertificatePublicKeyParserClient messages={messages} />)

    expect(getInput().value).toBe(DEFAULT_INPUT)
    expect(
      await screen.findByText(messages.certificateLabel.replace("{index}", "1"))
    ).toBeTruthy()
    expect(
      screen.getByText(messages.publicKeyLabel.replace("{index}", "1"))
    ).toBeTruthy()
    expect(screen.getAllByText("ECDSA").length).toBeGreaterThan(0)
    expect(
      screen.getByText("DNS: example.com, DNS: www.example.com, IP: 127.0.0.1")
    ).toBeTruthy()
  })

  test("shows an error for invalid input and can restore the sample", async () => {
    render(<CertificatePublicKeyParserClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "invalid input!" } })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        messages.invalidInput
      )
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    expect(
      await screen.findByText(
        "DNS: example.com, DNS: www.example.com, IP: 127.0.0.1"
      )
    ).toBeTruthy()
  })

  test("clears input and persists text input", async () => {
    render(<CertificatePublicKeyParserClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getInput().value).toBe("")
      expect(screen.getByText(messages.resultsEmptyTitle)).toBeTruthy()
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.input)).toBe("")
  })

  test("restores text input from localStorage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.input, "not a certificate")

    render(<CertificatePublicKeyParserClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe("not a certificate")
    })
  })

  test("imports PEM and DER files", async () => {
    render(<CertificatePublicKeyParserClient messages={messages} />)

    const pemFile = new File([DEFAULT_INPUT], "chain.pem", {
      type: "application/x-pem-file",
    })
    fireEvent.change(getFileInput(), { target: { files: [pemFile] } })

    await waitFor(() => {
      expect(getInput().value).toContain("BEGIN CERTIFICATE")
    })
    expect(
      await screen.findByText(messages.certificateLabel.replace("{index}", "1"))
    ).toBeTruthy()

    const der = base64ToArrayBuffer(publicKeyBase64)
    const derFile = new File([der], "public-key.der")
    fireEvent.change(getFileInput(), { target: { files: [derFile] } })

    await waitFor(() => {
      expect(getInput().value).toBe("")
      expect(
        screen.getByText(
          messages.selectedFileHint.replace("{name}", "public-key.der")
        )
      ).toBeTruthy()
    })
    expect(await screen.findByText("public-key.der")).toBeTruthy()
  })
})
