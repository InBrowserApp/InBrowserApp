import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidMaxGeneratorClient from "./client"
import { MAX_UUID, MAX_UUID_HEX, MAX_UUID_URN } from "./core/max-uuid"

const messages = {
  meta: {
    name: "Max UUID Generator",
    description: "Generate the RFC 9562 max UUID value in your browser.",
  },
  valueTitle: "Max UUID",
  valueDescription: "Copy the all-ones UUID.",
  canonicalLabel: "Canonical UUID",
  rawHexLabel: "32-digit hex",
  urnLabel: "UUID URN",
  copyUuidLabel: "Copy UUID",
  copyHexLabel: "Copy hex",
  copyUrnLabel: "Copy URN",
  copiedLabel: "Copied",
  detailsTitle: "Reference",
  detailsDescription: "The max UUID is fixed.",
  allBitsLabel: "Bits",
  allBitsValue: "128 bits set to one",
  versionLabel: "Version",
  versionValue: "Special form",
  variantLabel: "Variant",
  variantValue: "All bits set",
  stableLabel: "Regeneration",
  stableValue: "Always returns the same value",
} as const

beforeEach(() => {
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: {
      writeText: vi.fn().mockResolvedValue(undefined),
    },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("UuidMaxGeneratorClient", () => {
  test("renders the max UUID representations and reference details", () => {
    render(<UuidMaxGeneratorClient messages={messages} />)

    expect(screen.getByText(MAX_UUID)).toBeTruthy()
    expect(screen.getByText(MAX_UUID_HEX)).toBeTruthy()
    expect(screen.getByText(MAX_UUID_URN)).toBeTruthy()
    expect(screen.getByText(messages.allBitsValue)).toBeTruthy()
    expect(screen.getAllByText(messages.versionValue)).toHaveLength(1)
    expect(screen.getAllByText(messages.stableValue)).toHaveLength(2)

    for (const value of [MAX_UUID, MAX_UUID_HEX, MAX_UUID_URN]) {
      const code = screen.getByText(value)

      expect(code.getAttribute("dir")).toBe("ltr")
      expect(code.getAttribute("translate")).toBe("no")
    }
  })

  test("copies each representation", async () => {
    render(<UuidMaxGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    )
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(MAX_UUID)
    })

    fireEvent.click(screen.getByRole("button", { name: messages.copyHexLabel }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        MAX_UUID_HEX
      )
    })

    fireEvent.click(screen.getByRole("button", { name: messages.copyUrnLabel }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        MAX_UUID_URN
      )
    })
  })
})
