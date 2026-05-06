import { webcrypto } from "node:crypto"

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import SshPublicKeyFingerprintClient from "./client"
import { DEFAULT_INPUT, STORAGE_KEYS } from "./client/constants"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = {
  meta,
  ...messagesCatalog,
} as const

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

describe("SshPublicKeyFingerprintClient", () => {
  test("renders the default sample and calculated fingerprints", async () => {
    render(<SshPublicKeyFingerprintClient messages={messages} />)

    expect(getInput().value).toBe(DEFAULT_INPUT)
    expect(
      screen.getAllByText(messages.resultsDescription).length
    ).toBeGreaterThan(0)
    expect(
      (await screen.findAllByText(messages.fingerprintSha256Label)).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText(messages.fingerprintMd5Label).length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText("ssh-ed25519").length).toBeGreaterThan(0)
    expect(screen.getAllByText("ssh-rsa").length).toBeGreaterThan(0)
  })

  test("shows an error for invalid input and can restore the sample", async () => {
    render(<SshPublicKeyFingerprintClient messages={messages} />)

    fireEvent.change(getInput(), { target: { value: "invalid" } })

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        messages.errorNoKeys
      )
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitFor(() => {
      expect(screen.getAllByText("ssh-ed25519").length).toBeGreaterThan(0)
    })
  })

  test("clears the input and shows the empty state", async () => {
    render(<SshPublicKeyFingerprintClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getInput().value).toBe("")
      expect(screen.getByText(messages.resultsEmptyTitle)).toBeTruthy()
    })
  })

  test("imports a public key file", async () => {
    render(<SshPublicKeyFingerprintClient messages={messages} />)

    const file = new File([DEFAULT_INPUT.split("\n")[0]!], "id_ed25519.pub", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toContain("ssh-ed25519")
    })
    await waitFor(() => {
      expect(screen.getAllByText("ssh-ed25519").length).toBeGreaterThan(0)
    })
    await waitFor(() => {
      expect(screen.queryAllByText("ssh-rsa")).toHaveLength(0)
    })
  })

  test("restores and persists input with localStorage", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.input,
      DEFAULT_INPUT.split("\n")[0]!
    )

    render(<SshPublicKeyFingerprintClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).not.toContain("ssh-rsa")
    })

    fireEvent.change(getInput(), { target: { value: "" } })

    expect(window.localStorage.getItem(STORAGE_KEYS.input)).toBe("")
  })
})
