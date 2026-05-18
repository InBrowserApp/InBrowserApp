import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV5GeneratorClient from "./client"

const messages = {
  meta: {
    name: "UUID v5 Generator",
    description:
      "Generate deterministic name-based UUID v5 identifiers locally.",
  },
  optionsTitle: "Inputs",
  optionsDescription:
    "Choose a namespace UUID and name. UUID v5 hashes both values, so the same pair always returns the same UUID.",
  namespaceLabel: "Namespace UUID",
  namespaceDescription:
    "Use one of the standard namespaces or paste any valid UUID.",
  namespaceInvalid: "Enter a valid namespace UUID.",
  namespacePresetLegend: "Standard namespaces",
  namespacePresetDescription:
    "DNS, URL, OID, and X.500 are the standard namespace UUIDs defined for name-based UUIDs.",
  namespaceDnsLabel: "DNS",
  namespaceUrlLabel: "URL",
  namespaceOidLabel: "OID",
  namespaceX500Label: "X.500 DN",
  nameLabel: "Name",
  nameDescription:
    "This can be a domain, URL, path, username, or any stable string you want to identify.",
  namePlaceholder: "example.com",
  resultTitle: "UUID v5",
  resultDescription:
    "The result updates locally as you edit the namespace or name.",
  resultLabel: "Generated UUID",
  resultPlaceholder: "Generated UUID will appear here...",
  resultInvalidPlaceholder: "Fix the namespace UUID to generate a result.",
  copyUuidLabel: "Copy UUID",
  copiedLabel: "Copied",
  versionBadgeLabel: "Version 5",
  variantBadgeLabel: "RFC 4122 variant",
  deterministicBadgeLabel: "Deterministic",
} as const

beforeEach(() => {
  window.localStorage.clear()
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function renderClient() {
  render(<UuidV5GeneratorClient messages={messages} />)
}

function getResultInput() {
  return screen.getByLabelText(messages.resultLabel) as HTMLInputElement
}

describe("UuidV5GeneratorClient", () => {
  test("generates the default DNS example", async () => {
    renderClient()

    expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
      "value",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
    )
    expect(screen.getByLabelText(messages.nameLabel)).toHaveProperty(
      "value",
      "example.com"
    )

    await waitFor(() => {
      expect(getResultInput()).toHaveProperty(
        "value",
        "cfbff0d1-9375-5685-968c-48ce8b15ae17"
      )
    })
  })

  test("updates the UUID and persists inputs when values change", async () => {
    renderClient()

    fireEvent.change(screen.getByLabelText(messages.nameLabel), {
      target: { value: "www.widgets.com" },
    })

    await waitFor(() => {
      expect(getResultInput()).toHaveProperty(
        "value",
        "21f7f8de-8051-5b89-8680-0195ef798b6a"
      )
    })

    expect(window.localStorage.getItem("tools:uuid-v5-generator:name")).toBe(
      "www.widgets.com"
    )
  })

  test("applies namespace presets", () => {
    renderClient()

    fireEvent.click(
      screen.getByRole("radio", { name: messages.namespaceUrlLabel })
    )

    expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
      "value",
      "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
    )
  })

  test("shows validation feedback for invalid namespaces", () => {
    renderClient()

    fireEvent.change(screen.getByLabelText(messages.namespaceLabel), {
      target: { value: "not-a-uuid" },
    })

    expect(screen.getByText(messages.namespaceInvalid)).toBeTruthy()
    expect(getResultInput()).toHaveProperty("value", "")
    expect(
      screen
        .getByLabelText(messages.namespaceLabel)
        .getAttribute("aria-invalid")
    ).toBe("true")
    expect(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    ).toHaveProperty("disabled", true)
  })

  test("restores saved inputs from localStorage", async () => {
    window.localStorage.setItem(
      "tools:uuid-v5-generator:namespace",
      "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
    )
    window.localStorage.setItem("tools:uuid-v5-generator:name", "saved-name")

    renderClient()

    await waitFor(() => {
      expect(screen.getByLabelText(messages.nameLabel)).toHaveProperty(
        "value",
        "saved-name"
      )
      expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
        "value",
        "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
      )
    })
  })

  test("copies the generated UUID", async () => {
    renderClient()

    await waitFor(() => {
      expect(getResultInput().value).toBe(
        "cfbff0d1-9375-5685-968c-48ce8b15ae17"
      )
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    )

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "cfbff0d1-9375-5685-968c-48ce8b15ae17"
      )
    })
  })
})
