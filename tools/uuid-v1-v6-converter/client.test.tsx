import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import UuidV1V6ConverterClient from "./client"

const messages = {
  meta: {
    name: "UUID v1 ↔ v6 Converter",
    description: "Convert between UUID v1 and UUID v6 formats.",
  },
  v1Title: "UUID v1",
  v1Description: "Paste a time-based UUID v1 to produce UUID v6.",
  v1Label: "UUID v1 input",
  v1Placeholder: "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f",
  v6Title: "UUID v6",
  v6Description: "Paste a reordered UUID v6 to recover UUID v1.",
  v6Label: "UUID v6 input",
  v6Placeholder: "1f034bdc-1ed6-67f0-b3fe-02d71e841f4f",
  copyV1Label: "Copy UUID v1",
  copyV6Label: "Copy UUID v6",
  copiedLabel: "Copied",
  loadSampleLabel: "Load sample",
  clearLabel: "Clear",
  emptyHint:
    "Input stays in your browser. Compact, uppercase, URN, and braced UUIDs are normalized before conversion.",
  invalidV1Format: "Enter a 32-character or canonical UUID v1 value.",
  invalidV1Version: "This UUID does not have the v1 version nibble.",
  invalidV1Variant: "This UUID is not an RFC 4122 variant UUID.",
  invalidV6Format: "Enter a 32-character or canonical UUID v6 value.",
  invalidV6Version: "This UUID does not have the v6 version nibble.",
  invalidV6Variant: "This UUID is not an RFC 4122 variant UUID.",
} as const

const V1_SAMPLE = "c1ed67f0-34bd-11f0-b3fe-02d71e841f4f"
const V6_SAMPLE = "1f034bdc-1ed6-67f0-b3fe-02d71e841f4f"

describe("UuidV1V6ConverterClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(cleanup)

  test("renders the default sample conversion", () => {
    render(<UuidV1V6ConverterClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.v1Label) as HTMLInputElement).value
    ).toBe(V1_SAMPLE)
    expect(
      (screen.getByLabelText(messages.v6Label) as HTMLInputElement).value
    ).toBe(V6_SAMPLE)
  })

  test("converts edited UUID v1 input to UUID v6", async () => {
    render(<UuidV1V6ConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.v1Label), {
      target: { value: V1_SAMPLE.toUpperCase() },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.v6Label) as HTMLInputElement).value
      ).toBe(V6_SAMPLE)
    })
  })

  test("converts edited UUID v6 input to UUID v1", async () => {
    render(<UuidV1V6ConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.v6Label), {
      target: { value: V6_SAMPLE },
    })

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.v1Label) as HTMLInputElement).value
      ).toBe(V1_SAMPLE)
    })
  })

  test("shows validation feedback and clears the opposite field", async () => {
    render(<UuidV1V6ConverterClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.v1Label), {
      target: { value: "not-a-uuid" },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidV1Format)).toBeTruthy()
    })
    expect(
      (screen.getByLabelText(messages.v6Label) as HTMLInputElement).value
    ).toBe("")
  })

  test("clears and reloads the sample", async () => {
    render(<UuidV1V6ConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.v1Label) as HTMLInputElement).value
      ).toBe("")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.v6Label) as HTMLInputElement).value
      ).toBe(V6_SAMPLE)
    })
  })

  test("restores the saved source side from localStorage", async () => {
    window.localStorage.setItem("tools:uuid-v1-v6-converter:source", "v6")
    window.localStorage.setItem("tools:uuid-v1-v6-converter:value", V6_SAMPLE)

    render(<UuidV1V6ConverterClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.v1Label) as HTMLInputElement).value
      ).toBe(V1_SAMPLE)
    })
  })
})
