import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import PgpKeyGeneratorClient from "./client"
import { generatePgpKeyPair } from "./core/pgp-keygen"
import type { PgpKeyGeneratorMessages } from "./client/types"
import enMessages from "./messages/en.json"
import enMeta from "./meta/en.json"

vi.mock("./core/pgp-keygen", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/pgp-keygen")>()

  return {
    ...actual,
    generatePgpKeyPair: vi.fn(),
  }
})

const messages = {
  meta: enMeta,
  ...enMessages,
} satisfies PgpKeyGeneratorMessages

const mockedGeneratePgpKeyPair = vi.mocked(generatePgpKeyPair)

describe("PgpKeyGeneratorClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockedGeneratePgpKeyPair.mockResolvedValue({
      publicKey: "-----BEGIN PGP PUBLIC KEY BLOCK-----\nPUBLIC",
      privateKey: "-----BEGIN PGP PRIVATE KEY BLOCK-----\nPRIVATE",
      revocationCertificate: "-----BEGIN PGP PUBLIC KEY BLOCK-----\nREVOCATION",
      fingerprint: "ABCD 1234",
      keyID: "DEADBEEF",
      userID: "Alice <alice@example.com>",
    })

    let urlCounter = 0
    vi.stubGlobal(
      "URL",
      Object.assign({}, globalThis.URL, {
        createObjectURL: vi.fn(() => `blob:pgp-${++urlCounter}`),
        revokeObjectURL: vi.fn(),
      })
    )
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it("renders the empty state and keeps generation disabled without identity", () => {
    render(<PgpKeyGeneratorClient messages={messages} />)

    expect(screen.getByRole("status").textContent).toBe(messages.emptyTitle)
    expect(screen.getAllByText(messages.emptyTitle)).toHaveLength(2)
    expect(
      screen
        .getByRole("button", { name: messages.generateLabel })
        .hasAttribute("disabled")
    ).toBe(true)
  })

  it("generates a key pair and renders copyable output sections", async () => {
    render(<PgpKeyGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.nameLabel), {
      target: { value: "Alice" },
    })
    fireEvent.change(screen.getByLabelText(messages.emailLabel), {
      target: { value: "alice@example.com" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText("ABCD 1234")).toBeTruthy()
    })

    expect(mockedGeneratePgpKeyPair).toHaveBeenCalledWith({
      name: "Alice",
      email: "alice@example.com",
      comment: "",
      passphrase: "",
      algorithm: "ecc",
      rsaKeySize: 4096,
      expirationDays: 0,
    })
    expect(screen.getByLabelText(messages.publicKeyTitle)).toBeTruthy()
    expect(screen.getByLabelText(messages.privateKeyTitle)).toBeTruthy()
    expect(
      screen.getByLabelText(messages.revocationCertificateTitle)
    ).toBeTruthy()
    await waitFor(() => {
      expect(
        screen.getAllByRole("link", { name: messages.downloadLabel })
      ).toHaveLength(3)
    })
  })

  it("passes RSA options, expiration, and passphrase to generation", async () => {
    render(<PgpKeyGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.emailLabel), {
      target: { value: "bob@example.com" },
    })
    fireEvent.change(screen.getByLabelText(messages.passphraseLabel), {
      target: { value: "secret" },
    })
    fireEvent.click(screen.getByRole("radio", { name: messages.rsaLabel }))
    fireEvent.click(screen.getByRole("radio", { name: "2048" }))
    fireEvent.change(screen.getByLabelText(messages.expirationDaysLabel), {
      target: { value: "90" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedGeneratePgpKeyPair).toHaveBeenCalledWith({
        name: "",
        email: "bob@example.com",
        comment: "",
        passphrase: "secret",
        algorithm: "rsa",
        rsaKeySize: 2048,
        expirationDays: 90,
      })
    })
    expect(screen.getByText(messages.protectedLabel)).toBeTruthy()
  })

  it("restores non-secret preferences from localStorage", () => {
    window.localStorage.setItem(
      "tools:pgp-key-generator:preferences",
      JSON.stringify({
        algorithm: "rsa",
        rsaKeySize: 3072,
        expirationDays: "365",
      })
    )

    render(<PgpKeyGeneratorClient messages={messages} />)

    expect(
      screen
        .getByRole("radio", { name: messages.rsaLabel })
        .getAttribute("data-state")
    ).toBe("on")
    expect(
      screen.getByRole("radio", { name: "3072" }).getAttribute("data-state")
    ).toBe("on")
    expect(
      (screen.getByLabelText(messages.expirationDaysLabel) as HTMLInputElement)
        .value
    ).toBe("365")
  })

  it("shows validation errors and generation failures", async () => {
    mockedGeneratePgpKeyPair.mockRejectedValueOnce(new Error("OpenPGP failed"))

    render(<PgpKeyGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.nameLabel), {
      target: { value: "Alice" },
    })
    fireEvent.change(screen.getByLabelText(messages.expirationDaysLabel), {
      target: { value: "-1" },
    })

    expect(screen.getByText(messages.expirationInvalidError)).toBeTruthy()

    fireEvent.change(screen.getByLabelText(messages.expirationDaysLabel), {
      target: { value: "0" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText("OpenPGP failed")).toBeTruthy()
    })
  })
})
