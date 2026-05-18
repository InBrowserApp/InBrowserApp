import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import UuidNilGeneratorClient from "./client"
import { NIL_UUID, NIL_UUID_HEX, NIL_UUID_URN } from "./core/nil-uuid"

const messages = {
  meta: {
    name: "Nil UUID Generator",
    description: "Generate and copy the standardized all-zero nil UUID.",
  },
  valueTitle: "Nil UUID",
  valueDescription: "Copy the all-zero UUID.",
  canonicalLabel: "Canonical UUID",
  rawHexLabel: "32-digit hex",
  urnLabel: "UUID URN",
  copyUuidLabel: "Copy UUID",
  copyHexLabel: "Copy hex",
  copyUrnLabel: "Copy URN",
  copiedLabel: "Copied",
  detailsTitle: "Reference",
  detailsDescription: "The nil UUID is fixed.",
  allBitsLabel: "Bits",
  allBitsValue: "128 zero bits",
  versionLabel: "Version",
  versionValue: "None",
  variantLabel: "Variant",
  variantValue: "None",
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

describe("UuidNilGeneratorClient", () => {
  test("renders the nil UUID representations and reference details", () => {
    render(<UuidNilGeneratorClient messages={messages} />)

    expect(screen.getByText(NIL_UUID)).toBeTruthy()
    expect(screen.getByText(NIL_UUID_HEX)).toBeTruthy()
    expect(screen.getByText(NIL_UUID_URN)).toBeTruthy()
    expect(screen.getByText(messages.allBitsValue)).toBeTruthy()
    expect(screen.getAllByText(messages.versionValue)).toHaveLength(2)
    expect(screen.getAllByText(messages.stableValue)).toHaveLength(2)
  })

  test("copies each representation", async () => {
    render(<UuidNilGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.copyUuidLabel })
    )
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(NIL_UUID)
    })

    fireEvent.click(screen.getByRole("button", { name: messages.copyHexLabel }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        NIL_UUID_HEX
      )
    })

    fireEvent.click(screen.getByRole("button", { name: messages.copyUrnLabel }))
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenLastCalledWith(
        NIL_UUID_URN
      )
    })
  })
})
