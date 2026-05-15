import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const coreMocks = vi.hoisted(() => ({
  verifyArgon2Password: vi.fn(),
}))

vi.mock("./core/argon2", () => ({
  verifyArgon2Password: coreMocks.verifyArgon2Password,
}))

import Argon2HashPasswordVerifierClient from "./client"

const messages = {
  meta: {
    name: "Argon2 Password Hash Verifier",
    description: "Verify whether a password matches an encoded Argon2 hash.",
  },
  formLabel: "Verification Input",
  formDescription: "Paste the password and encoded Argon2 PHC hash string.",
  passwordLabel: "Password",
  passwordPlaceholder: "Enter the password to check",
  passwordDescription: "The plain password is never sent anywhere.",
  hashLabel: "Encoded Argon2 hash",
  hashPlaceholder: "$argon2id$v=19$m=65536,t=3,p=4$...",
  hashDescription: "Use the full encoded hash string.",
  secretLabel: "Secret / pepper (optional)",
  secretPlaceholder: "Enter the same secret used when hashing",
  secretDescription: "Only fill this if the original hash used one.",
  showPasswordLabel: "Show password",
  hidePasswordLabel: "Hide password",
  showSecretLabel: "Show secret",
  hideSecretLabel: "Hide secret",
  verifyButtonLabel: "Verify Password",
  verifyingButtonLabel: "Verifying...",
  resetButtonLabel: "Reset",
  resultLabel: "Verification Result",
  resultDescription: "The result reflects the last submitted values.",
  idleTitle: "Ready to verify",
  idleDescription: "Enter a password and encoded Argon2 hash.",
  verifyingTitle: "Checking the password",
  verifyingDescription: "Verification may take a moment.",
  verifiedTitle: "Password matches",
  verifiedDescription: "The supplied password verifies.",
  mismatchTitle: "Password does not match",
  mismatchDescription: "The supplied password did not verify.",
  invalidTitle: "Invalid Argon2 hash",
  invalidDescription: "Check the encoded hash string and secret.",
  hashDetailsLabel: "Hash parameters",
  variantLabel: "Variant",
  versionLabel: "Version",
  memoryCostLabel: "Memory cost",
  iterationsLabel: "Iterations",
  parallelismLabel: "Parallelism",
  saltLengthLabel: "Salt length",
  digestLengthLabel: "Digest length",
  notAvailableLabel: "Not specified",
} as const

const hashInfo = {
  variant: "argon2id",
  version: 19,
  memoryCost: 65536,
  iterations: 3,
  parallelism: 4,
  saltLength: 16,
  digestLength: 32,
} as const

beforeEach(() => {
  coreMocks.verifyArgon2Password.mockReset()
})

afterEach(cleanup)

function renderClient() {
  render(<Argon2HashPasswordVerifierClient messages={messages} />)
}

function fillRequiredInputs() {
  fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
    target: { value: "correct horse battery staple" },
  })
  fillHashInput()
}

function fillHashInput() {
  fireEvent.change(screen.getByLabelText(messages.hashLabel), {
    target: { value: "$argon2id$v=19$m=65536,t=3,p=4$salt$digest" },
  })
}

describe("Argon2HashPasswordVerifierClient", () => {
  test("renders the form and keeps verification disabled until required input exists", () => {
    renderClient()

    expect(screen.getByText(messages.formLabel)).toBeTruthy()
    expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    expect(
      (
        screen.getByRole("button", {
          name: messages.verifyButtonLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)

    fillHashInput()

    expect(
      (
        screen.getByRole("button", {
          name: messages.verifyButtonLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(false)
  })

  test("submits the password, hash, and optional secret", async () => {
    coreMocks.verifyArgon2Password.mockResolvedValueOnce({
      verified: true,
      info: hashInfo,
    })
    renderClient()

    fillRequiredInputs()
    fireEvent.change(screen.getByLabelText(messages.secretLabel), {
      target: { value: "pepper" },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.verifyButtonLabel })
    )

    await screen.findByText(messages.verifiedTitle)
    expect(coreMocks.verifyArgon2Password).toHaveBeenCalledWith({
      password: "correct horse battery staple",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$salt$digest",
      secret: "pepper",
    })
    expect(screen.getByText("65536 KiB")).toBeTruthy()
  })

  test("allows submitting an empty password candidate", async () => {
    coreMocks.verifyArgon2Password.mockResolvedValueOnce({
      verified: false,
      info: hashInfo,
    })
    renderClient()

    fillHashInput()
    fireEvent.click(
      screen.getByRole("button", { name: messages.verifyButtonLabel })
    )

    await screen.findByText(messages.mismatchTitle)
    expect(coreMocks.verifyArgon2Password).toHaveBeenCalledWith({
      password: "",
      hash: "$argon2id$v=19$m=65536,t=3,p=4$salt$digest",
      secret: "",
    })
  })

  test("shows mismatch and invalid states", async () => {
    coreMocks.verifyArgon2Password.mockResolvedValueOnce({
      verified: false,
      info: hashInfo,
    })
    renderClient()

    fillRequiredInputs()
    fireEvent.click(
      screen.getByRole("button", { name: messages.verifyButtonLabel })
    )

    await screen.findByText(messages.mismatchTitle)
    cleanup()

    coreMocks.verifyArgon2Password.mockRejectedValueOnce(
      new Error("invalid hash")
    )
    renderClient()
    fillRequiredInputs()
    fireEvent.click(
      screen.getByRole("button", { name: messages.verifyButtonLabel })
    )

    await screen.findByText(messages.invalidTitle)
  })

  test("ignores stale verification results after input changes", async () => {
    let resolveVerification:
      | ((value: { verified: boolean; info: typeof hashInfo }) => void)
      | undefined
    coreMocks.verifyArgon2Password.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveVerification = resolve
      })
    )
    renderClient()

    fillRequiredInputs()
    fireEvent.click(
      screen.getByRole("button", { name: messages.verifyButtonLabel })
    )
    fireEvent.change(screen.getByLabelText(messages.passwordLabel), {
      target: { value: "edited while loading" },
    })

    resolveVerification?.({ verified: true, info: hashInfo })

    await waitFor(() => {
      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    })
    expect(screen.queryByText(messages.verifiedTitle)).toBeNull()
  })

  test("toggles field visibility and resets all input", () => {
    renderClient()
    fillRequiredInputs()

    const passwordInput = screen.getByLabelText(messages.passwordLabel)
    expect(passwordInput.getAttribute("type")).toBe("password")

    fireEvent.click(
      screen.getByRole("button", { name: messages.showPasswordLabel })
    )
    expect(passwordInput.getAttribute("type")).toBe("text")

    fireEvent.click(
      screen.getByRole("button", { name: messages.resetButtonLabel })
    )

    expect(
      (screen.getByLabelText(messages.passwordLabel) as HTMLInputElement).value
    ).toBe("")
    expect(
      (screen.getByLabelText(messages.hashLabel) as HTMLTextAreaElement).value
    ).toBe("")
  })
})
