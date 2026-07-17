import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import Ipv6UlaGeneratorClient from "./client"

const messages = {
  meta: {
    name: "IPv6 ULA Generator",
    description: "Generate an RFC 4193 IPv6 ULA prefix.",
  },
  generatorTitle: "Generated site prefix",
  generatorDescription: "One locally assigned RFC 4193 /48.",
  sitePrefixLabel: "IPv6 ULA site prefix",
  generatingLabel: "Generating a secure prefix…",
  regenerateLabel: "Generate new prefix",
  copySitePrefixLabel: "Copy site prefix",
  copyGlobalIdLabel: "Copy Global ID",
  copySelectedSubnetLabel: "Copy selected /64",
  copyFirstSubnetLabel: "Copy first /64",
  copyLastSubnetLabel: "Copy last /64",
  copiedLabel: "Copied",
  detailsTitle: "Prefix details",
  detailsDescription: "Locally assigned ULA fields.",
  globalIdLabel: "Global ID",
  ulaSpaceLabel: "ULA space",
  ulaSpaceValue: "fc00::/7",
  localBitLabel: "Locally assigned bit",
  localBitValue: "1 (locally assigned)",
  prefixLengthLabel: "Site prefix length",
  prefixLengthValue: "/48",
  randomSourceLabel: "Random source",
  randomSourceValue: "Web Crypto API",
  subnetCapacityLabel: "Available /64 subnets",
  layoutTitle: "Address layout",
  layoutDescription: "A /48 leaves 16 subnet bits.",
  localPrefixSegmentLabel: "Local prefix",
  globalIdSegmentLabel: "Global ID",
  subnetIdSegmentLabel: "Subnet ID",
  interfaceIdSegmentLabel: "Interface ID",
  bitsLabel: "{count} bits",
  plannerTitle: "Plan a /64 subnet",
  plannerDescription: "Choose a hexadecimal Subnet ID.",
  subnetIdLabel: "Subnet ID",
  subnetIdDescription: "Enter one to four hexadecimal digits.",
  subnetIdPlaceholder: "0000",
  subnetIdInvalid: "Use one to four hexadecimal digits.",
  selectedSubnetLabel: "Selected /64",
  boundariesTitle: "Allocation boundaries",
  boundariesDescription: "First and last /64.",
  firstSubnetLabel: "First /64",
  lastSubnetLabel: "Last /64",
  privacyTitle: "Generated locally",
  privacyDescription: "No identifiers leave this browser.",
  reuseTitle: "Record and reuse this prefix",
  reuseDescription: "Statistically unique, not guaranteed unique.",
  errorTitle: "Secure randomness is unavailable",
  cryptoUnavailableMessage: "No insecure fallback was used.",
} as const

const FIRST_RANDOM_BYTES = [0x12, 0x34, 0x56, 0x78, 0x9a]
const SECOND_RANDOM_BYTES = [0xab, 0xcd, 0xef, 0x01, 0x23]
let generationCount = 0

beforeEach(() => {
  generationCount = 0
  vi.spyOn(globalThis.crypto, "getRandomValues").mockImplementation((array) => {
    const bytes = array as Uint8Array
    bytes.set(generationCount === 0 ? FIRST_RANDOM_BYTES : SECOND_RANDOM_BYTES)
    generationCount += 1
    return array
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getOutput(label: string) {
  return screen.getByLabelText(label) as HTMLOutputElement
}

describe("Ipv6UlaGeneratorClient", () => {
  test("does not generate random values while rendering static HTML", () => {
    const html = renderToString(
      <Ipv6UlaGeneratorClient messages={messages} language="en" />
    )

    expect(globalThis.crypto.getRandomValues).not.toHaveBeenCalled()
    expect(html).not.toContain("fd12:3456:789a")
    expect(html).toContain(messages.generatingLabel)
  })

  test("generates a /48 after mount and renders canonical planning outputs", async () => {
    render(<Ipv6UlaGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getOutput(messages.sitePrefixLabel).textContent).toBe(
        "fd12:3456:789a::/48"
      )
    })

    expect(getOutput(messages.selectedSubnetLabel).textContent).toBe(
      "fd12:3456:789a::/64"
    )
    expect(getOutput(messages.firstSubnetLabel).textContent).toBe(
      "fd12:3456:789a::/64"
    )
    expect(getOutput(messages.lastSubnetLabel).textContent).toBe(
      "fd12:3456:789a:ffff::/64"
    )
    expect(screen.getAllByText("123456789a").length).toBeGreaterThan(0)
    expect(screen.getByText("65,536")).toBeTruthy()

    for (const heading of [
      messages.generatorTitle,
      messages.detailsTitle,
      messages.plannerTitle,
    ]) {
      expect(
        screen.getByRole("heading", { level: 2, name: heading })
      ).toBeTruthy()
    }

    expect(
      screen
        .getByRole("group", { name: messages.layoutTitle })
        .getAttribute("dir")
    ).toBe("ltr")

    expect(
      screen
        .getByRole("button", { name: messages.copySitePrefixLabel })
        .closest('[data-slot="card-footer"]')
        ?.classList.contains("flex-wrap")
    ).toBe(true)

    const [randomBuffer] = vi.mocked(globalThis.crypto.getRandomValues).mock
      .calls[0]!
    expect(randomBuffer).toBeInstanceOf(Uint8Array)
    expect(randomBuffer.byteLength).toBe(5)

    for (const label of [
      messages.sitePrefixLabel,
      messages.selectedSubnetLabel,
      messages.firstSubnetLabel,
      messages.lastSubnetLabel,
    ]) {
      const output = getOutput(label)
      expect(output.tagName).toBe("OUTPUT")
      expect(output.getAttribute("dir")).toBe("ltr")
      expect(output.getAttribute("translate")).toBe("no")
    }
  })

  test("regenerates the prefix while preserving the selected Subnet ID", async () => {
    render(<Ipv6UlaGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getOutput(messages.sitePrefixLabel).textContent).toBe(
        "fd12:3456:789a::/48"
      )
    })

    const input = screen.getByLabelText(
      messages.subnetIdLabel
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: "00a0" } })
    expect(getOutput(messages.selectedSubnetLabel).textContent).toBe(
      "fd12:3456:789a:a0::/64"
    )

    fireEvent.click(
      screen.getByRole("button", { name: messages.regenerateLabel })
    )

    await waitFor(() => {
      expect(getOutput(messages.sitePrefixLabel).textContent).toBe(
        "fdab:cdef:123::/48"
      )
    })
    expect(input.value).toBe("00a0")
    expect(getOutput(messages.selectedSubnetLabel).textContent).toBe(
      "fdab:cdef:123:a0::/64"
    )
  })

  test("validates the Subnet ID and recovers with canonical lowercase output", async () => {
    render(<Ipv6UlaGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getOutput(messages.sitePrefixLabel).textContent).not.toBe("")
    })

    const input = screen.getByLabelText(
      messages.subnetIdLabel
    ) as HTMLInputElement
    fireEvent.change(input, { target: { value: "gggg" } })

    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(screen.getByText(messages.subnetIdInvalid)).toBeTruthy()
    expect(getOutput(messages.selectedSubnetLabel).textContent).toBe("—")
    expect(
      screen.getByRole("button", {
        name: messages.copySelectedSubnetLabel,
      })
    ).toHaveProperty("disabled", true)

    fireEvent.change(input, { target: { value: "F" } })

    expect(input.getAttribute("aria-invalid")).toBe("false")
    expect(screen.queryByText(messages.subnetIdInvalid)).toBeNull()
    expect(getOutput(messages.selectedSubnetLabel).textContent).toBe(
      "fd12:3456:789a:f::/64"
    )
  })

  test("shows a Web Crypto error and disables every copy action", () => {
    vi.restoreAllMocks()
    vi.stubGlobal("crypto", {})

    render(<Ipv6UlaGeneratorClient messages={messages} language="en" />)

    expect(screen.getByText(messages.errorTitle)).toBeTruthy()
    expect(getOutput(messages.sitePrefixLabel).textContent).toBe("")

    for (const label of [
      messages.copySitePrefixLabel,
      messages.copyGlobalIdLabel,
      messages.copySelectedSubnetLabel,
      messages.copyFirstSubnetLabel,
      messages.copyLastSubnetLabel,
    ]) {
      expect(screen.getByRole("button", { name: label })).toHaveProperty(
        "disabled",
        true
      )
    }
  })

  test("copies the canonical site prefix with live feedback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    })
    render(<Ipv6UlaGeneratorClient messages={messages} language="en" />)

    await waitFor(() => {
      expect(getOutput(messages.sitePrefixLabel).textContent).not.toBe("")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.copySitePrefixLabel })
    )

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("fd12:3456:789a::/48")
      const feedback = screen.getByText(messages.copiedLabel)
      expect(feedback.getAttribute("aria-live")).toBe("polite")
    })
  })
})
