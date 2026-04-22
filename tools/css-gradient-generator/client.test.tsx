import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import CssGradientGeneratorClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"

const messages = {
  ...messagesCatalog,
  meta,
}

describe("CssGradientGeneratorClient", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:mock"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    })
  })

  it("renders, applies presets, and switches output format", async () => {
    render(<CssGradientGeneratorClient messages={messages} />)

    const cssOutput = screen.getByLabelText(messages.outputTitle)
    expect((cssOutput as HTMLTextAreaElement).value).toContain(
      "linear-gradient("
    )

    fireEvent.click(
      screen.getByRole("button", { name: messages.preset.sunset })
    )
    await waitFor(() => {
      expect((cssOutput as HTMLTextAreaElement).value).toContain("#FDBA74")
    })

    fireEvent.click(screen.getByText(messages.format.rgba))
    await waitFor(() => {
      expect((cssOutput as HTMLTextAreaElement).value).toContain("rgba(")
    })

    const svgDownloadLink = screen.getByRole("link", {
      name: messages.downloadSvg,
    })
    expect(svgDownloadLink.getAttribute("download")).toBe("css-gradient.svg")
  })

  it("shows an error for invalid JSON imports", () => {
    render(<CssGradientGeneratorClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.jsonPlaceholder), {
      target: { value: "{" },
    })
    fireEvent.click(screen.getByRole("button", { name: messages.loadJson }))

    expect(screen.queryByText(messages.invalidJson)).not.toBeNull()
  })

  it("adds and drags stops from the gradient track", async () => {
    const { container } = render(
      <CssGradientGeneratorClient messages={messages} />
    )
    const track = screen.getByTestId("gradient-track")
    const rect = {
      bottom: 64,
      height: 64,
      left: 0,
      right: 200,
      toJSON() {
        return this
      },
      top: 0,
      width: 200,
      x: 0,
      y: 0,
    }

    Object.defineProperty(track, "getBoundingClientRect", {
      configurable: true,
      value: () => rect,
    })

    const countStopInputs = () =>
      screen.getAllByLabelText(messages.stopPosition).length

    expect(countStopInputs()).toBe(3)
    fireEvent.pointerDown(track, { clientX: 150 })
    await waitFor(() => {
      expect(countStopInputs()).toBe(4)
    })

    const handles = container.querySelectorAll(
      'button[aria-label^="' + messages.stopPosition + ' "]'
    )
    fireEvent.pointerDown(handles[0]!, { clientX: 0 })
    await waitFor(() => {
      fireEvent.pointerMove(window, { clientX: 180 })
      const values = screen
        .getAllByLabelText(messages.stopPosition)
        .map((input) => Number((input as HTMLInputElement).value))

      expect(values).not.toContain(0)
    })
    fireEvent.pointerUp(window)
  })
})
