import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Argon2HashPasswordClient from "./client"
import { STORAGE_KEYS } from "./client/constants"
import { generateArgon2Hash } from "./core/argon2"

vi.mock("./core/argon2", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/argon2")>()

  return {
    ...actual,
    generateArgon2Hash: vi.fn(async () => "encoded-argon2-hash"),
    generateRandomSalt: vi.fn(() => "AAECAwQFBgcICQoLDA0ODw=="),
  }
})

const messages = {
  meta: {
    name: "Argon2 Hash Password",
    description:
      "Generate encoded Argon2 password hashes in the browser with configurable algorithm, memory, iterations, parallelism, salt, and optional secret",
  },
  configurationLabel: "Configuration",
  configurationDescription:
    "Create an encoded Argon2 password hash without sending the password, salt, or secret to a server.",
  passwordLabel: "Password",
  passwordPlaceholder: "Password to hash",
  algorithmLabel: "Algorithm",
  secretLabel: "Secret",
  secretPlaceholder: "Optional server-side pepper",
  secretDescription:
    "Leave blank unless your application verifies hashes with the same secret value.",
  parametersLabel: "Parameters",
  parametersDescription:
    "Tune the work factor for the environment that will verify the password.",
  iterationsLabel: "Iterations",
  memorySizeLabel: "Memory Size (KiB)",
  parallelismLabel: "Parallelism",
  hashLengthLabel: "Hash Length (bytes)",
  iterationsInvalidMessage: "Enter a whole number between 1 and 12.",
  memorySizeInvalidMessage: "Enter a whole number between 8 and 262144 KiB.",
  memoryDependencyInvalidMessage:
    "Memory size must be at least 8 KiB per parallel lane.",
  parallelismInvalidMessage: "Enter a whole number between 1 and 16.",
  hashLengthInvalidMessage: "Enter a whole number between 4 and 64 bytes.",
  estimatedMemoryLabel: "Estimated memory",
  saltLabel: "Salt (Base64)",
  saltDescription:
    "Use a unique random salt for every password. The salt is encoded as Base64 and stored inside the final Argon2 hash string.",
  saltInvalidBase64Message: "Salt must be valid Base64.",
  saltTooShortMessage: "Salt must decode to at least 8 bytes.",
  generateSaltLabel: "Generate random salt",
  hashResultLabel: "Hash Result",
  hashResultDescription:
    "Encoded Argon2 hash for the current password and parameters.",
  generateHashLabel: "Generate hash",
  generatingHashLabel: "Generating…",
  emptyStateTitle: "Ready to hash",
  emptyStateDescription:
    "Enter a password, keep or generate a salt, then generate an encoded Argon2 hash.",
  invalidConfigurationMessage:
    "Fix the password, salt, and parameter fields before generating a hash.",
  hashErrorMessage: "Failed to generate the Argon2 password hash.",
  copyHashLabel: "Copy hash",
  copiedLabel: "Copied",
  encodedHashLabel: "Encoded Hash",
} as const

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
})

afterEach(cleanup)

function renderClient() {
  render(<Argon2HashPasswordClient messages={messages} />)
}

function getPasswordInput() {
  return screen.getByLabelText(messages.passwordLabel) as HTMLInputElement
}

function getSaltInput() {
  return screen.getByRole("textbox", {
    name: messages.saltLabel,
  }) as HTMLInputElement
}

function getMemorySizeInput() {
  return screen.getByLabelText(messages.memorySizeLabel) as HTMLInputElement
}

function getParallelismInput() {
  return screen.getByLabelText(messages.parallelismLabel) as HTMLInputElement
}

function getHashLengthInput() {
  return screen.getByLabelText(messages.hashLengthLabel) as HTMLInputElement
}

function selectOption(label: string, option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: label }))
  fireEvent.click(screen.getByRole("option", { name: option }))
}

describe("Argon2HashPasswordClient", () => {
  test("starts with generated salt and an idle result", async () => {
    renderClient()

    expect(screen.getByText(messages.emptyStateTitle)).toBeTruthy()
    expect(
      screen.getByText(`${messages.estimatedMemoryLabel}: 64 MiB`)
    ).toBeTruthy()

    await waitFor(() => {
      expect(getSaltInput().value).toBe("AAECAwQFBgcICQoLDA0ODw==")
    })
  })

  test("generates an encoded hash from valid form values", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), {
      target: { value: "correct horse battery staple" },
    })
    fireEvent.change(getMemorySizeInput(), { target: { value: "8" } })
    fireEvent.change(getHashLengthInput(), { target: { value: "16" } })
    selectOption(messages.algorithmLabel, "Argon2i")

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateHashLabel })
    )

    expect(await screen.findByText("encoded-argon2-hash")).toBeTruthy()
    expect(generateArgon2Hash).toHaveBeenCalledWith(
      expect.objectContaining({
        algorithm: "argon2i",
        password: "correct horse battery staple",
        memorySize: 8,
        hashLength: 16,
      })
    )
  })

  test("validates salt and memory dependency before generating", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter2" } })
    fireEvent.change(getSaltInput(), { target: { value: "AAECAw==" } })

    expect(await screen.findByText(messages.saltTooShortMessage)).toBeTruthy()

    fireEvent.change(getSaltInput(), { target: { value: "!!!!" } })
    expect(
      await screen.findByText(messages.saltInvalidBase64Message)
    ).toBeTruthy()

    fireEvent.change(getSaltInput(), {
      target: { value: "AAECAwQFBgcICQoLDA0ODw==" },
    })
    fireEvent.change(getMemorySizeInput(), { target: { value: "8" } })
    fireEvent.change(getParallelismInput(), { target: { value: "2" } })

    expect(
      await screen.findByText(messages.memoryDependencyInvalidMessage)
    ).toBeTruthy()

    expect(
      (
        screen.getByRole("button", {
          name: messages.generateHashLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })

  test("clears stale output when inputs change", async () => {
    renderClient()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter2" } })
    fireEvent.change(getMemorySizeInput(), { target: { value: "8" } })
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateHashLabel })
    )

    expect(await screen.findByText("encoded-argon2-hash")).toBeTruthy()

    fireEvent.change(getPasswordInput(), { target: { value: "hunter3" } })

    expect(screen.getByText(messages.emptyStateTitle)).toBeTruthy()
    expect(screen.queryByText("encoded-argon2-hash")).toBeNull()
  })

  test("restores and persists non-secret configuration values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.algorithm, "argon2d")
    window.localStorage.setItem(STORAGE_KEYS.iterations, "2")
    window.localStorage.setItem(STORAGE_KEYS.memorySize, "16")
    window.localStorage.setItem(STORAGE_KEYS.parallelism, "2")
    window.localStorage.setItem(STORAGE_KEYS.hashLength, "24")

    renderClient()

    expect(await screen.findByText("Argon2d")).toBeTruthy()
    expect(
      (screen.getByLabelText(messages.iterationsLabel) as HTMLInputElement)
        .value
    ).toBe("2")
    expect(getMemorySizeInput().value).toBe("16")
    expect(getParallelismInput().value).toBe("2")
    expect(getHashLengthInput().value).toBe("24")

    fireEvent.change(getMemorySizeInput(), { target: { value: "32" } })

    expect(window.localStorage.getItem(STORAGE_KEYS.memorySize)).toBe("32")
    expect(
      window.localStorage.getItem("tools:argon2-hash-password:password")
    ).toBeNull()
  })
})
