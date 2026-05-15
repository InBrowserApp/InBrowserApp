import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import UuidDecoderClient from "./client"

const messages = {
  meta: {
    name: "UUID Decoder",
    description: "Decode UUID details.",
  },
  uuidLabel: "UUID",
  uuidPlaceholder: "550e8400-e29b-41d4-a716-446655440000",
  inputDescription: "Paste a UUID.",
  decodeResult: "Decoded UUID",
  emptyTitle: "Paste a UUID to decode it",
  emptyDescription: "The decoder shows structure.",
  validTitle: "UUID decoded",
  invalidTitle: "Invalid UUID",
  invalidDescription: "Use 32 hexadecimal digits.",
  normalizedUuid: "Normalized UUID",
  version: "Version",
  variant: "Variant",
  format: "Representations",
  canonical: "Canonical format.",
  hex: "Hexadecimal",
  base64: "Base64",
  decimal: "Decimal",
  octal: "Octal",
  binary: "Binary",
  timeDetails: "Time and node fields",
  unixMilliseconds: "Unix milliseconds",
  utcTime: "UTC time",
  clockSequence: "Clock sequence",
  nodeIdentifier: "Node identifier",
  nodeSourceMac: "MAC-style node",
  nodeSourceRandom: "Random node",
  algorithm: "Algorithm",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  resetLabel: "Reset",
  useCurrentTimeLabel: "Use current time",
  versionLabels: {
    nil: "Nil UUID",
    time: "Version 1 time",
    dce: "Version 2 DCE",
    md5: "Version 3 MD5",
    random: "Version 4 random",
    sha1: "Version 5 SHA-1",
    timeReordered: "Version 6 time",
    unixTime: "Version 7 time",
    custom: "Version 8 custom",
    max: "Max UUID",
    reserved: "Reserved version",
  },
  variantLabels: {
    ncs: "NCS",
    rfc4122: "Standard",
    microsoft: "Microsoft",
    future: "Future",
  },
  algorithmLabels: {
    md5: "MD5 name hash",
    sha1: "SHA-1 name hash",
  },
} as const

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.uuidLabel,
  }) as HTMLInputElement
}

describe("UuidDecoderClient", () => {
  test("renders the default UUID and decoded fields", () => {
    render(<UuidDecoderClient messages={messages} />)

    expect(getInput().value).toBe("550e8400-e29b-41d4-a716-446655440000")
    expect(screen.getByText(messages.validTitle)).toBeTruthy()
    expect(screen.getByText("Version 4 random")).toBeTruthy()
    expect(screen.getByText("Standard")).toBeTruthy()
    expect(screen.getByText("VQ6EAOKbQdSnFkRmVUQAAA==")).toBeTruthy()
  })

  test("shows an invalid state for malformed input", () => {
    render(<UuidDecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "bad uuid" },
    })

    expect(screen.getByText(messages.invalidTitle)).toBeTruthy()
    expect(screen.getByText(messages.invalidDescription)).toBeTruthy()
    expect(screen.queryByText(messages.validTitle)).toBeNull()
  })

  test("shows an empty state when no UUID is entered", () => {
    render(<UuidDecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "" },
    })

    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(screen.queryByText(messages.invalidTitle)).toBeNull()
  })

  test("uses the current time UUID action", () => {
    render(
      <UuidDecoderClient
        messages={messages}
        createCurrentTimeUuid={() => "6ba7b810-9dad-11d1-80b4-00c04fd430c8"}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Use current time" }))

    expect(getInput().value).toBe("6ba7b810-9dad-11d1-80b4-00c04fd430c8")
    expect(screen.getByText("Version 1 time")).toBeTruthy()
    expect(screen.getByText("1998-02-04T22:13:53.151Z")).toBeTruthy()
    expect(screen.getByText("00:C0:4F:D4:30:C8")).toBeTruthy()
  })

  test("restores and persists the last UUID", () => {
    window.localStorage.setItem(
      "tools:uuid-decoder:uuid",
      "a3bb189e-8bf9-3888-9912-ace4e6543002"
    )

    render(<UuidDecoderClient messages={messages} />)

    expect(getInput().value).toBe("a3bb189e-8bf9-3888-9912-ace4e6543002")
    expect(screen.getByText("MD5 name hash")).toBeTruthy()

    fireEvent.change(getInput(), {
      target: { value: "886313e1-3b8a-5372-9b90-0c9aee199e5d" },
    })

    expect(window.localStorage.getItem("tools:uuid-decoder:uuid")).toBe(
      "886313e1-3b8a-5372-9b90-0c9aee199e5d"
    )
  })

  test("resets the UUID to the default example", () => {
    render(<UuidDecoderClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "886313e1-3b8a-5372-9b90-0c9aee199e5d" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))

    expect(getInput().value).toBe("550e8400-e29b-41d4-a716-446655440000")
  })
})
