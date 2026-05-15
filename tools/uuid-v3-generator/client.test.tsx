import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidV3GeneratorClient from "./client"

const messages = {
  meta: {
    name: "UUID v3 Generator",
    description:
      "Generate deterministic name-based UUID v3 identifiers from a namespace UUID and name.",
  },
  optionsTitle: "Inputs",
  optionsDescription:
    "Choose a namespace UUID and name. UUID v3 hashes both values, so the same pair always returns the same UUID.",
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
  resultTitle: "UUID v3",
  resultDescription:
    "The result updates locally as you edit the namespace or name.",
  resultLabel: "Generated UUID",
  resultPlaceholder: "Generated UUID will appear here…",
  resultInvalidPlaceholder: "Fix the namespace UUID to generate a result.",
  copyUuidLabel: "Copy UUID",
  copiedLabel: "Copied",
  versionBadgeLabel: "Version 3",
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

function getResultInput() {
  return screen.getByLabelText(messages.resultLabel) as HTMLInputElement
}

describe("UuidV3GeneratorClient", () => {
  test("renders the default UUID v3 result", () => {
    render(<UuidV3GeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
      "value",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
    )
    expect(screen.getByLabelText(messages.nameLabel)).toHaveProperty(
      "value",
      "example.com"
    )
    expect(getResultInput()).toHaveProperty(
      "value",
      "9073926b-929f-31c2-abc9-fad77ae3e8eb"
    )
  })

  test("updates the UUID and persists inputs when values change", async () => {
    render(<UuidV3GeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.namespaceLabel), {
      target: { value: "6ba7b811-9dad-11d1-80b4-00c04fd430c8" },
    })
    fireEvent.change(screen.getByLabelText(messages.nameLabel), {
      target: { value: "https://example.com/docs" },
    })

    await waitFor(() => {
      expect(getResultInput().value).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u
      )
    })

    expect(
      window.localStorage.getItem("tools:uuid-v3-generator:namespace")
    ).toBe("6ba7b811-9dad-11d1-80b4-00c04fd430c8")
    expect(window.localStorage.getItem("tools:uuid-v3-generator:name")).toBe(
      "https://example.com/docs"
    )
  })

  test("restores saved inputs from localStorage", async () => {
    window.localStorage.setItem(
      "tools:uuid-v3-generator:namespace",
      "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
    )
    window.localStorage.setItem("tools:uuid-v3-generator:name", "1.3.6.1")

    render(<UuidV3GeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
        "value",
        "6ba7b812-9dad-11d1-80b4-00c04fd430c8"
      )
      expect(screen.getByLabelText(messages.nameLabel)).toHaveProperty(
        "value",
        "1.3.6.1"
      )
    })
  })

  test("applies namespace presets", () => {
    render(<UuidV3GeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: messages.namespaceUrlLabel })
    )

    expect(screen.getByLabelText(messages.namespaceLabel)).toHaveProperty(
      "value",
      "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
    )
  })

  test("shows an error and disables copying for invalid namespaces", () => {
    render(<UuidV3GeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.namespaceLabel), {
      target: { value: "invalid" },
    })

    expect(screen.getByText(messages.namespaceInvalid)).toBeTruthy()
    expect(getResultInput()).toHaveProperty("value", "")
    expect(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    ).toHaveProperty("disabled", true)
  })

  test("copies the generated UUID", async () => {
    render(<UuidV3GeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    )

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "9073926b-929f-31c2-abc9-fad77ae3e8eb"
      )
    })
  })
})
