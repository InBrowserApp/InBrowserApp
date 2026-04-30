import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import CssBoxShadowGeneratorClient from "./client"

import type { CssBoxShadowMessages } from "./client/types"

const messages: CssBoxShadowMessages = {
  meta: {
    name: "CSS Box Shadow Generator",
    description: "Create multi-layer box-shadow values with live preview.",
  },
  layersTitle: "Layers",
  layerTitle: "Layer {index}",
  addLayerLabel: "Add layer",
  removeLayerLabel: "Remove",
  moveUpLabel: "Move up",
  moveDownLabel: "Move down",
  layerSettingsTitle: "Layer settings",
  offsetXLabel: "Offset X",
  offsetYLabel: "Offset Y",
  blurLabel: "Blur",
  spreadLabel: "Spread",
  colorLabel: "Color",
  alphaLabel: "Alpha",
  insetLabel: "Inset",
  unitPixels: "px",
  previewTitle: "Preview",
  outputTitle: "CSS output",
  outputHint: "Copy the box-shadow value into your CSS.",
  darkBackgroundLabel: "Dark background",
  invalidColorMessage: "Invalid color format",
  copyLabel: "Copy",
  copiedLabel: "Copied",
}

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe("CssBoxShadowGeneratorClient", () => {
  it("renders the default layer and css output", () => {
    render(<CssBoxShadowGeneratorClient messages={messages} />)

    expect(screen.getByText("Layers")).toBeTruthy()
    expect(screen.getByTestId("layer-card-0")).toBeTruthy()
    expect(screen.getByTestId("shadow-output").textContent).toBe(
      "box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.2);"
    )
  })

  it("adds a layer and updates the output when controls change", () => {
    render(<CssBoxShadowGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByTestId("add-layer"))
    fireEvent.click(screen.getByTestId("layer-card-1").querySelector("button")!)
    fireEvent.change(screen.getByTestId("offset-x-input"), {
      target: { value: "32" },
    })
    fireEvent.change(screen.getByTestId("alpha-input"), {
      target: { value: "50" },
    })
    fireEvent.click(screen.getByTestId("inset-switch"))

    expect(screen.getByTestId("shadow-output").textContent).toContain(
      "inset 32px 8px 24px 0px rgba(0, 0, 0, 0.502)"
    )
  })

  it("restores persisted layers and preview theme", () => {
    window.localStorage.setItem(
      "tools:css-box-shadow-generator:layers",
      JSON.stringify([
        {
          id: "stored-layer",
          offsetX: 4,
          offsetY: 12,
          blur: 30,
          spread: 3,
          color: "#FF000080",
          inset: false,
        },
      ])
    )
    window.localStorage.setItem(
      "tools:css-box-shadow-generator:active-layer-id",
      "stored-layer"
    )
    window.localStorage.setItem(
      "tools:css-box-shadow-generator:dark-background",
      "true"
    )

    render(<CssBoxShadowGeneratorClient messages={messages} />)

    expect(screen.getByTestId("shadow-output").textContent).toBe(
      "box-shadow: 4px 12px 30px 3px rgba(255, 0, 0, 0.502);"
    )
    expect(
      screen.getByTestId("dark-background-switch").getAttribute("aria-pressed")
    ).toBe("true")
  })

  it("copies the generated css output", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    })

    render(<CssBoxShadowGeneratorClient messages={messages} />)
    fireEvent.click(screen.getByRole("button", { name: "Copy" }))

    expect(writeText).toHaveBeenCalledWith(
      "box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.2);"
    )
  })
})
