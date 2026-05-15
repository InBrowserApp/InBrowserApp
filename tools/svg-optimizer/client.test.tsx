import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import meta from "./meta/en.json"
import localizedMessages from "./messages/en.json"

vi.mock("./client/optimize-svg", () => {
  return {
    optimizeSvgMarkup: vi.fn(async () => '<svg viewBox="0 0 1 1"/>'),
  }
})

import SvgOptimizerClient from "./client"
import { optimizeSvgMarkup } from "./client/optimize-svg"

const mockedOptimizeSvgMarkup = vi.mocked(optimizeSvgMarkup)
const messages = { meta, ...localizedMessages }

function createSvgFile(name = "icon.svg") {
  return new File(
    [
      '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><!-- note --><rect width="24" height="24"/></svg>',
    ],
    name,
    {
      type: "image/svg+xml",
    }
  )
}

beforeEach(() => {
  mockedOptimizeSvgMarkup.mockClear()

  let urlCounter = 0
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:svg-optimizer-${++urlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: vi.fn(async () => undefined),
    },
  })
})

afterEach(cleanup)

describe("SvgOptimizerClient", () => {
  test("renders empty input, options, and result states", () => {
    render(<SvgOptimizerClient messages={messages} />)

    expect(screen.getByText(messages.inputTitle)).toBeTruthy()
    expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
    expect(
      (
        screen.getByRole("button", {
          name: messages.optimizeLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })

  test("rejects unsupported files", () => {
    render(<SvgOptimizerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-optimizer-file-input"), {
      target: {
        files: [new File(["png"], "icon.png", { type: "image/png" })],
      },
    })

    expect(screen.getByText(messages.invalidFileTypeError)).toBeTruthy()
    expect(mockedOptimizeSvgMarkup).not.toHaveBeenCalled()
  })

  test("uploads an SVG file and optimizes it", async () => {
    render(<SvgOptimizerClient messages={messages} />)

    fireEvent.change(screen.getByTestId("svg-optimizer-file-input"), {
      target: {
        files: [createSvgFile("logo.svg")],
      },
    })

    await waitFor(() => {
      expect(screen.getByText("logo.svg")).toBeTruthy()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.optimizeLabel })
    )

    await waitFor(() => {
      expect(mockedOptimizeSvgMarkup).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText(messages.outputCodeLabel)).toBeTruthy()
    expect(
      screen
        .getByRole("region", { name: messages.outputCodeLabel })
        .querySelector(".hljs-name")
    ).toBeTruthy()
    await waitFor(() => {
      expect(
        screen
          .getByRole("link", { name: messages.downloadLabel })
          .getAttribute("download")
      ).toBe("logo.optimized.svg")
    })
  })

  test("loads sample SVG, toggles an option, and copies output", async () => {
    render(<SvgOptimizerClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )
    fireEvent.click(screen.getByLabelText(messages.removeDimensionsLabel))
    fireEvent.click(
      screen.getByRole("button", { name: messages.optimizeLabel })
    )

    await waitFor(() => {
      expect(mockedOptimizeSvgMarkup).toHaveBeenCalledTimes(1)
    })

    const [, options] = mockedOptimizeSvgMarkup.mock.calls[0]!
    expect(options.removeDimensions).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: messages.copyLabel }))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        '<svg viewBox="0 0 1 1"/>'
      )
    })
    expect(screen.getByText(messages.copiedLabel)).toBeTruthy()
  })

  test("shows optimization failures", async () => {
    mockedOptimizeSvgMarkup.mockRejectedValueOnce(new Error("fail"))

    render(<SvgOptimizerClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.loadSampleLabel })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.optimizeLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.optimizeFailedError)).toBeTruthy()
    })
  })
})
