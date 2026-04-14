import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import FaviconAssetsGeneratorClient from "./client"

vi.mock("./client/generate-favicon-assets", () => ({
  generateFaviconAssets: vi.fn(),
}))

import { generateFaviconAssets } from "./client/generate-favicon-assets"

const mockedGenerateFaviconAssets = vi.mocked(generateFaviconAssets)

let objectUrlCounter = 0

function createImageFile() {
  return new File([new Uint8Array(2048)], "logo.svg", {
    type: "image/svg+xml",
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

async function uploadSourceFile(file = createImageFile()) {
  fireEvent.change(getFileInput(), { target: { files: [file] } })

  await waitFor(() => {
    expect(screen.getByText("Change image")).toBeTruthy()
  })

  return file
}

beforeEach(() => {
  objectUrlCounter = 0
  mockedGenerateFaviconAssets.mockReset()
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => `blob:mock-url-${++objectUrlCounter}`),
      revokeObjectURL: vi.fn(),
    })
  )
})

afterEach(cleanup)

describe("FaviconAssetsGeneratorClient", () => {
  test("renders the empty state and disables generation before upload", () => {
    render(<FaviconAssetsGeneratorClient />)

    expect(screen.getByText("Source icon")).toBeTruthy()
    expect(screen.getByText("Generated bundle")).toBeTruthy()
    expect(screen.getByText("Platform previews")).toBeTruthy()
    expect(
      screen.getByText("Upload an image and generate the bundle.")
    ).toBeTruthy()

    const generateButton = screen.getByRole("button", {
      name: "Generate assets",
    }) as HTMLButtonElement

    expect(generateButton.disabled).toBe(true)
  })

  test("loads the demo icon from the source card", async () => {
    render(<FaviconAssetsGeneratorClient />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Use demo icon",
      })
    )

    await waitFor(() => {
      expect(screen.getByText("Change image")).toBeTruthy()
    })

    expect(
      screen.getByText((value) => value.includes("demo-favicon.svg"))
    ).toBeTruthy()
    expect(screen.getByTestId("google-search-result-preview")).toBeTruthy()
    expect(screen.getByTestId("desktop-light-tab-preview")).toBeTruthy()
    expect(screen.getByTestId("desktop-dark-tab-preview")).toBeTruthy()
    expect(screen.getByTestId("ios-home-screen-preview")).toBeTruthy()
    expect(screen.getByTestId("pwa-any-preview")).toBeTruthy()
    expect(screen.getByTestId("pwa-maskable-preview")).toBeTruthy()
    expect(
      screen.getByText("SVG icons may not render correctly in dark tabs.")
    ).toBeTruthy()
  })

  test("opens the desktop dedicated-image panel", async () => {
    render(<FaviconAssetsGeneratorClient />)

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Dedicated image",
      })[0] as HTMLButtonElement
    )

    expect(
      screen.getByText(
        "Use a dedicated source when browser tabs and search results need a different icon than the shared one."
      )
    ).toBeTruthy()
  })

  test("uploads a source image, generates a bundle, and exposes the zip download", async () => {
    const sourceFile = createImageFile()

    mockedGenerateFaviconAssets.mockResolvedValueOnce({
      files: [
        { name: "favicon.ico", size: 4096, type: "image/x-icon" },
        {
          name: "site.webmanifest",
          size: 256,
          type: "application/manifest+json",
        },
      ],
      headMarkup: '<link rel="manifest" href="/site.webmanifest">',
      manifestText: '{\n  "name": "App"\n}',
      zipBlob: new Blob(["zip"], { type: "application/zip" }),
    })

    render(<FaviconAssetsGeneratorClient />)

    await uploadSourceFile(sourceFile)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate assets",
      })
    )

    await waitFor(() => {
      expect(mockedGenerateFaviconAssets).toHaveBeenCalledTimes(1)
    })

    expect(mockedGenerateFaviconAssets).toHaveBeenCalledWith({
      sourceFile,
      site: expect.objectContaining({ name: "App", assetPath: "/" }),
      desktop: expect.objectContaining({ useOriginalSvg: true }),
      ios: expect.objectContaining({ backgroundColor: "#FFFFFF" }),
      pwa: expect.objectContaining({ includeMaskable: true }),
    })

    await waitFor(() => {
      expect(screen.getByText("favicon.ico")).toBeTruthy()
    })

    const downloadLink = screen.getByRole("link", {
      name: "Download favicon-assets.zip",
    })

    expect(downloadLink.getAttribute("download")).toBe("favicon-assets.zip")
    expect(downloadLink.getAttribute("href")).toMatch(/^blob:mock-url-\d+$/)
    expect(
      screen.getByDisplayValue((value) =>
        value.includes('<link rel="manifest" href="/site.webmanifest">')
      )
    ).toBeTruthy()
    expect(
      screen.getByDisplayValue((value) => value.includes('"name": "App"'))
    ).toBeTruthy()
  })

  test("surfaces generation errors", async () => {
    mockedGenerateFaviconAssets.mockRejectedValueOnce(new Error("BAD_SOURCE"))

    render(<FaviconAssetsGeneratorClient />)

    await uploadSourceFile()

    fireEvent.click(
      screen.getByRole("button", {
        name: "Generate assets",
      })
    )

    await waitFor(() => {
      expect(
        screen.getByText("The favicon bundle could not be generated.")
      ).toBeTruthy()
    })

    expect(screen.getByText("BAD_SOURCE")).toBeTruthy()
  })
})
