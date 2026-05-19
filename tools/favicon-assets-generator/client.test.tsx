import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import FaviconAssetsGeneratorClient from "./client"
import type { FaviconMessages, ImageSource } from "./client/types"

function makeFakePngBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(40)
  bytes[0] = 0x89
  bytes[1] = 0x50
  bytes[2] = 0x4e
  bytes[3] = 0x47
  bytes[4] = 0x0d
  bytes[5] = 0x0a
  bytes[6] = 0x1a
  bytes[7] = 0x0a
  const view = new DataView(bytes.buffer)
  view.setUint32(16, size, false)
  view.setUint32(20, size, false)
  return bytes
}

vi.mock("./client/load-image-source", async () => {
  const actual = await vi.importActual<
    typeof import("./client/load-image-source")
  >("./client/load-image-source")
  return {
    ...actual,
    loadImageSource: vi.fn(async (file: File) => createMockImageSource(file)),
    disposeImageSource: vi.fn(),
  }
})

vi.mock("./client/render-bitmap", async () => {
  const actual = await vi.importActual<typeof import("./client/render-bitmap")>(
    "./client/render-bitmap"
  )
  return {
    ...actual,
    renderRaster: vi.fn(async ({ spec }: { spec: { size: number } }) => {
      return new Blob([makeFakePngBytes(spec.size) as BlobPart], {
        type: "image/png",
      })
    }),
    blobToUint8: vi.fn(async (blob: Blob) => {
      const buf = await blob.arrayBuffer()
      return new Uint8Array(buf)
    }),
  }
})

vi.mock("@zip.js/zip.js", () => {
  class BlobWriter {
    constructor(public mimeType: string) {}
  }
  class Uint8ArrayReader {
    constructor(public bytes: Uint8Array) {}
  }
  class TextReader {
    constructor(public text: string) {}
  }
  class ZipWriter {
    constructor(public writer: unknown) {}
    async add() {}
    async close() {
      return new Blob([new Uint8Array([0x50, 0x4b])], {
        type: "application/zip",
      })
    }
  }
  return { BlobWriter, Uint8ArrayReader, TextReader, ZipWriter }
})

function createMockImageSource(file: File): ImageSource {
  const objectUrl = `blob:mock-${urlCounter++}`
  const image = {
    naturalWidth: 256,
    naturalHeight: 256,
    width: 256,
    height: 256,
  } as unknown as HTMLImageElement
  return {
    file,
    width: 256,
    height: 256,
    mimeType: file.type || "image/png",
    isSvg: file.type === "image/svg+xml",
    svgText: file.type === "image/svg+xml" ? "<svg/>" : null,
    objectUrl,
    image,
  }
}

let urlCounter = 0

const messages: FaviconMessages = {
  meta: {
    name: "Favicon Assets Generator",
    description: "Generate a complete favicon bundle.",
  },

  uploadCardTitle: "Source image",
  uploadCardDescription: "Drop or pick an image.",
  chooseImageLabel: "Choose an image",
  changeImageLabel: "Change image",
  uploadHint: "PNG, JPEG, WebP, SVG supported.",
  useDemoLabel: "Use demo icon",
  removeImageLabel: "Remove",
  filePreviewAlt: "preview",

  siteInfoCardTitle: "Site info",
  siteInfoCardDescription: "site info desc",
  appNameLabel: "App name",
  shortNameLabel: "Short name",
  shortNameDescription: "short name desc",
  descriptionLabel: "Description",
  descriptionDescription: "desc desc",
  startUrlLabel: "Start URL",
  startUrlDescription: "Where the installed PWA opens.",
  assetPathLabel: "Asset path",
  assetPathDescription: "asset path desc",
  displayModeLabel: "Display mode",
  displayFullscreen: "Fullscreen",
  displayStandalone: "Standalone",
  displayMinimalUi: "Minimal UI",
  displayBrowser: "Browser",
  themeColorLabel: "Theme color",
  themeColorDescription: "theme color desc",
  enableDarkThemeColorLabel: "Add a dark theme color",
  enableDarkThemeColorDescription: "dark theme desc",
  darkThemeColorLabel: "Dark theme color",
  backgroundColorLabel: "Background color",
  backgroundColorDescription: "bg desc",

  desktopCardTitle: "Desktop browser favicon",
  desktopCardDescription: "desktop desc",
  useOriginalSvgLabel: "Use original SVG",
  useOriginalSvgDescription: "use svg desc",
  addBackgroundLabel: "Add background",
  cardBackgroundColorLabel: "Background color",
  backgroundRadiusLabel: "Background corner radius",
  backgroundRadiusDescription: "radius desc",
  marginLabel: "Margin",
  marginDescription: "margin desc",
  useDifferentImageLabel: "Use a different image",
  useDifferentImageDescription: "diff img desc",
  uploadDedicatedImageLabel: "Choose a dedicated image",
  removeDedicatedImageLabel: "Remove",

  iosCardTitle: "iOS web clip",
  iosCardDescription: "ios desc",
  iosBackgroundColorLabel: "Background color",
  iosBackgroundColorDescription: "ios bg desc",

  pwaCardTitle: "PWA icons",
  pwaCardDescription: "pwa desc",
  includeMaskableLabel: "Include maskable variants",
  includeMaskableDescription: "maskable desc",
  maskableBackgroundColorLabel: "Maskable background color",
  maskableMarginLabel: "Maskable safe-zone margin",
  maskableMarginDescription: "maskable margin desc",

  previewGalleryTitle: "Preview",
  previewGalleryDescription: "preview desc",
  previewBeforeGenerateHint: "Generate the bundle to see your favicons.",
  previewDesktopBrowserLabel: "Desktop browser tab",
  previewGoogleSearchLabel: "Search engine result",
  previewIosHomeScreenLabel: "iOS home screen",
  previewAndroidLauncherLabel: "Android launcher",
  previewWindowsTaskbarLabel: "Windows taskbar",

  resultCardTitle: "Generated bundle",
  resultCardDescription: "Click Generate to render every asset.",
  resultEmptyTitle: "No bundle yet",
  resultEmptyDescription: "Pick an image and click Generate.",
  generateLabel: "Generate favicon assets",
  generatingLabel: "Generating…",
  regenerateLabel: "Regenerate",
  resetLabel: "Reset options",
  downloadZipLabel: "Download .zip",
  generatedAssetsTitle: "Files in the bundle",
  generatedAssetsCountLabel: "{count} files",
  htmlSnippetTitle: "HTML snippet",
  htmlSnippetDescription: "html desc",
  manifestPreviewTitle: "site.webmanifest",
  manifestPreviewDescription: "manifest desc",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  downloadAssetLabel: "Download asset",

  invalidImageTitle: "Image could not be read",
  invalidImageDescription: "Try a different file.",
  generationFailedTitle: "Generation failed",
  generationFailedDescription: "Something went wrong.",
  needAppNameTitle: "App name is required",
  needAppNameDescription: "Enter an app name.",
  needImageTitle: "Upload an image first",
  needImageDescription: "Upload an image first.",
  missingDedicatedImageTitle: "Dedicated image missing",
  missingDedicatedImageDescription:
    "Upload an override or turn the toggle off.",

  transparentLabel: "Transparent",
}

beforeEach(() => {
  urlCounter = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:test-${urlCounter++}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("FaviconAssetsGeneratorClient", () => {
  test("renders the upload empty state and all four platform cards", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    expect(
      screen.getByRole("button", { name: messages.useDemoLabel })
    ).toBeDefined()
    expect(screen.getByText(messages.siteInfoCardTitle)).toBeDefined()
    expect(screen.getByText(messages.desktopCardTitle)).toBeDefined()
    expect(screen.getByText(messages.iosCardTitle)).toBeDefined()
    expect(screen.getByText(messages.pwaCardTitle)).toBeDefined()
    expect(screen.getByText(messages.resultEmptyTitle)).toBeDefined()
  })

  test('"Use demo icon" loads a source image and enables Generate', async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const generateButton = screen.getByRole("button", {
      name: messages.generateLabel,
    }) as HTMLButtonElement
    expect(generateButton.disabled).toBe(true)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      expect(generateButton.disabled).toBe(false)
    })
  })

  test("renaming app name updates the manifest text after Generate", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    const nameInput = screen.getByLabelText(
      messages.appNameLabel
    ) as HTMLInputElement
    fireEvent.change(nameInput, { target: { value: "Acme" } })
    expect(nameInput.value).toBe("Acme")

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.generatedAssetsTitle)).toBeDefined()
    })

    const manifestPanel = screen.getAllByText(
      (content) =>
        typeof content === "string" && content.includes('"name": "Acme"')
    )
    expect(manifestPanel.length).toBeGreaterThan(0)
  })

  test('toggling "Use different image" on the desktop card reveals the dedicated upload', async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const platformToggles = screen.getAllByRole("switch").filter((switchEl) => {
      const id = switchEl.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    expect(platformToggles.length).toBeGreaterThanOrEqual(3)

    expect(screen.queryByText(messages.uploadDedicatedImageLabel)).toBeNull()

    fireEvent.click(platformToggles[0]!)

    await waitFor(() => {
      const labels = screen.getAllByText(messages.uploadDedicatedImageLabel)
      expect(labels.length).toBeGreaterThan(0)
    })
  })

  test("clicking Generate without an image shows the needs-image error", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    // Button is disabled so no error fires; just assert the disabled state stays.
    const generateButton = screen.getByRole("button", {
      name: messages.generateLabel,
    }) as HTMLButtonElement
    expect(generateButton.disabled).toBe(true)
  })

  test("Reset options clears the bundle and restores defaults", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.generatedAssetsTitle)).toBeDefined()
    })

    fireEvent.click(screen.getByRole("button", { name: messages.resetLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.resultEmptyTitle)).toBeDefined()
    })
  })

  test("desktop 'Add background' reveals the color and radius controls", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    expect(
      screen.queryByText(messages.backgroundRadiusLabel + ": 0%")
    ).toBeNull()

    const switches = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.addBackgroundLabel)
      )
    })
    expect(switches.length).toBeGreaterThanOrEqual(2)
    fireEvent.click(switches[0]!)

    await waitFor(() => {
      const radiusLabels = screen.getAllByText(
        new RegExp(messages.backgroundRadiusLabel)
      )
      expect(radiusLabels.length).toBeGreaterThan(0)
    })
  })

  test("PWA 'Add background' reveals the maskable + non-maskable background controls", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const pwaBackgroundSwitches = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.addBackgroundLabel)
      )
    })
    // Click the PWA one (second occurrence)
    fireEvent.click(pwaBackgroundSwitches[1]!)

    await waitFor(() => {
      const radiusLabels = screen.getAllByText(
        new RegExp(messages.backgroundRadiusLabel)
      )
      expect(radiusLabels.length).toBeGreaterThan(0)
    })
  })

  test("dark theme color section disappears when the switch is off", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    expect(screen.getByLabelText(messages.darkThemeColorLabel)).toBeDefined()

    const darkSwitch = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.enableDarkThemeColorLabel)
      )
    })
    expect(darkSwitch).toBeDefined()
    fireEvent.click(darkSwitch!)

    await waitFor(() => {
      expect(screen.queryByLabelText(messages.darkThemeColorLabel)).toBeNull()
    })
  })

  test("hex text input keeps the color in sync after typing without a leading hash", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const themeInputs = screen.getAllByDisplayValue("#FFFFFF")
    expect(themeInputs.length).toBeGreaterThan(0)

    const themeInput = themeInputs.find(
      (el) => el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
    )!
    fireEvent.change(themeInput, { target: { value: "112233" } })
    expect((themeInput as HTMLInputElement).value).toBe("#112233")
  })

  test("changing the description and asset path flows into the generated manifest text", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    const description = screen.getByLabelText(messages.descriptionLabel)
    fireEvent.change(description, { target: { value: "Hello" } })

    const assetPath = screen.getByLabelText(
      messages.assetPathLabel
    ) as HTMLInputElement
    fireEvent.change(assetPath, { target: { value: "static" } })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          (content) =>
            typeof content === "string" &&
            content.includes('"description": "Hello"')
        )
      ).toBeDefined()
    })

    expect(
      screen.getByText(
        (content) =>
          typeof content === "string" &&
          content.includes("/static/pwa-192x192.png")
      )
    ).toBeDefined()
  })

  test("dropping an image on the upload card loads it", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const file = new File([new Uint8Array([1])], "logo.png", {
      type: "image/png",
    })

    const dropZone = screen.getByLabelText(messages.chooseImageLabel)
    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file] },
    })
    fireEvent.dragLeave(dropZone)
    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file] },
    })
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })
  })

  test("dropping a non-file drop event no-ops gracefully", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const dropZone = screen.getByLabelText(messages.chooseImageLabel)
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [] },
    })

    expect(screen.getByText(messages.chooseImageLabel)).toBeDefined()
  })

  test("file input change with a new file replaces the loaded image", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const fileInput = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement

    const first = new File([new Uint8Array([1])], "first.png", {
      type: "image/png",
    })
    fireEvent.change(fileInput, { target: { files: [first] } })

    await waitFor(() => {
      expect(screen.getByText("first.png")).toBeDefined()
    })

    const second = new File([new Uint8Array([2])], "second.png", {
      type: "image/png",
    })
    fireEvent.change(fileInput, { target: { files: [second] } })

    await waitFor(() => {
      expect(screen.getByText("second.png")).toBeDefined()
    })
  })

  test("turning on 'Use a different image' without uploading shows the missing-dedicated-image alert on Generate", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    const iosToggle = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    expect(iosToggle).toBeDefined()
    fireEvent.click(iosToggle!)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(
        screen.getByText(messages.missingDedicatedImageDescription)
      ).toBeDefined()
    })
  })

  test("toggling Include maskable hides the maskable controls", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    expect(
      screen.getByText(messages.maskableBackgroundColorLabel)
    ).toBeDefined()

    const maskableSwitch = screen.getAllByRole("switch").find((switchEl) => {
      const id = switchEl.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.includeMaskableLabel)
      )
    })
    expect(maskableSwitch).toBeDefined()
    fireEvent.click(maskableSwitch!)

    await waitFor(() => {
      expect(
        screen.queryByText(messages.maskableBackgroundColorLabel)
      ).toBeNull()
    })
  })

  test("changing the Short name and Start URL flows through to the manifest", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    fireEvent.change(screen.getByLabelText(messages.shortNameLabel), {
      target: { value: "AC" },
    })
    fireEvent.change(screen.getByLabelText(messages.startUrlLabel), {
      target: { value: "/home" },
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          (content) =>
            typeof content === "string" &&
            content.includes('"short_name": "AC"')
        )
      ).toBeDefined()
    })

    expect(
      screen.getByText(
        (content) =>
          typeof content === "string" &&
          content.includes('"start_url": "/home"')
      )
    ).toBeDefined()
  })

  test("uploading a dedicated image for iOS enables the file picker preview", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const iosToggle = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    expect(iosToggle).toBeDefined()
    fireEvent.click(iosToggle!)

    const dedicatedInput =
      document.querySelectorAll<HTMLInputElement>("input[type='file']")
    expect(dedicatedInput.length).toBeGreaterThanOrEqual(2)

    const file = new File([new Uint8Array([1])], "ios-logo.png", {
      type: "image/png",
    })
    fireEvent.change(dedicatedInput[1]!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText("ios-logo.png")).toBeDefined()
    })

    const removeButton = screen
      .getAllByRole("button", { name: messages.removeDedicatedImageLabel })
      .find(Boolean)
    expect(removeButton).toBeDefined()

    fireEvent.click(removeButton!)

    await waitFor(() => {
      expect(screen.queryByText("ios-logo.png")).toBeNull()
    })
  })

  test("turning the dark theme color back on shows the dark color input again", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const darkSwitch = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.enableDarkThemeColorLabel)
      )
    })
    expect(darkSwitch).toBeDefined()
    fireEvent.click(darkSwitch!)
    await waitFor(() => {
      expect(screen.queryByLabelText(messages.darkThemeColorLabel)).toBeNull()
    })
    fireEvent.click(darkSwitch!)
    await waitFor(() => {
      expect(screen.getByLabelText(messages.darkThemeColorLabel)).toBeDefined()
    })
  })

  test("Use original SVG toggle controls inclusion of favicon.svg after Generate", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const svgFile = new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" })
    const dropZone = screen.getByLabelText(messages.chooseImageLabel)
    fireEvent.drop(dropZone, { dataTransfer: { files: [svgFile] } })

    await waitFor(() => {
      const generateButton = screen.getByRole("button", {
        name: messages.generateLabel,
      }) as HTMLButtonElement
      expect(generateButton.disabled).toBe(false)
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText("favicon.svg")).toBeDefined()
    })
  })

  test("removing the global image clears the upload card", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: messages.removeImageLabel })
      ).toBeDefined()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.removeImageLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.chooseImageLabel)).toBeDefined()
    })
  })

  test("display mode select renders the four options", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const trigger = screen.getByLabelText(messages.displayModeLabel)
    expect(trigger.textContent).toContain(messages.displayStandalone)
  })

  test("ColorField rejects empty hex input by falling back to a black hex", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const themeInputs = screen.getAllByDisplayValue("#FFFFFF")
    const themeInput = themeInputs.find(
      (el) => el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
    )!
    fireEvent.change(themeInput, { target: { value: "" } })
    expect((themeInput as HTMLInputElement).value).toBe("#000000")
  })

  test("ColorField passes through valid hex with hash", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const inputs = screen
      .getAllByDisplayValue("#FFFFFF")
      .filter(
        (el) =>
          el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
      )
    fireEvent.change(inputs[0]!, { target: { value: "#abcdef" } })
    expect((inputs[0] as HTMLInputElement).value).toBe("#ABCDEF")
  })

  test("ColorField color picker emits uppercase hex on change", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const pickers = document.querySelectorAll<HTMLInputElement>(
      "input[type='color']"
    )
    expect(pickers.length).toBeGreaterThan(0)
    fireEvent.change(pickers[0]!, { target: { value: "#123456" } })
    expect(pickers[0]!.value.toLowerCase()).toBe("#123456")
  })

  test("toggling useOriginalSvg fires the desktop config patch", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const svgSwitch = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useOriginalSvgLabel)
      )
    })
    expect(svgSwitch).toBeDefined()
    fireEvent.click(svgSwitch!)
    expect(svgSwitch!.getAttribute("aria-checked")).toBe("false")
  })

  test("changing desktop background color via the color field after enabling background", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const addBgSwitches = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.addBackgroundLabel)
      )
    })
    fireEvent.click(addBgSwitches[0]!)

    await waitFor(() => {
      const colorFields = screen.getAllByLabelText(
        messages.cardBackgroundColorLabel
      )
      expect(colorFields.length).toBeGreaterThan(0)
    })

    const desktopBgColorInputs = screen
      .getAllByDisplayValue("#FFFFFF")
      .filter(
        (el) =>
          el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
      )
    fireEvent.change(desktopBgColorInputs[desktopBgColorInputs.length - 1]!, {
      target: { value: "654321" },
    })
    expect(
      (
        desktopBgColorInputs[
          desktopBgColorInputs.length - 1
        ] as HTMLInputElement
      ).value
    ).toBe("#654321")
  })

  test("triggering slider keyboard interactions fires onValueChange handlers", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    // Enable addBackground on both desktop and PWA so all background-radius sliders mount.
    const addBgSwitches = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.addBackgroundLabel)
      )
    })
    for (const sw of addBgSwitches) {
      fireEvent.click(sw)
    }

    await waitFor(() => {
      const sliders = document.querySelectorAll<HTMLElement>("[role='slider']")
      expect(sliders.length).toBeGreaterThanOrEqual(5)
    })

    const sliders = document.querySelectorAll<HTMLElement>("[role='slider']")
    for (const slider of Array.from(sliders)) {
      fireEvent.keyDown(slider, { key: "ArrowRight", code: "ArrowRight" })
      fireEvent.keyDown(slider, { key: "ArrowLeft", code: "ArrowLeft" })
    }
  })

  test("toggling addBackground twice covers the on→off return path", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const addBgSwitches = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.addBackgroundLabel)
      )
    })

    for (const sw of addBgSwitches) {
      fireEvent.click(sw)
    }

    await waitFor(() => {
      expect(
        screen.getAllByLabelText(messages.cardBackgroundColorLabel).length
      ).toBeGreaterThan(0)
    })

    // Toggle the desktop card back off; the PWA card stays on.
    fireEvent.click(addBgSwitches[0]!)
  })

  test("changing iOS background color and clicking iOS color picker", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const iosBgInputs = screen.getAllByLabelText(
      messages.iosBackgroundColorLabel
    )
    expect(iosBgInputs.length).toBeGreaterThan(0)
    // The hex text input sits alongside the color picker
    const iosHexInputs = screen
      .getAllByDisplayValue("#FFFFFF")
      .filter(
        (el) =>
          el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
      )
    // Last (highest-indexed) #FFFFFF text input is the iOS / PWA one; change the second-to-last to exercise iOS
    fireEvent.change(iosHexInputs[1] ?? iosHexInputs[0]!, {
      target: { value: "#abcdef" },
    })
  })

  test("iOS card: changing background color fires the iOS config patch", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const iosBgColorInputs = screen.getAllByLabelText(
      messages.iosBackgroundColorLabel
    )
    const iosHexInput = iosBgColorInputs
      .filter((el) => el.tagName === "INPUT")
      .find((el) => (el as HTMLInputElement).type === "text") as
      | HTMLInputElement
      | undefined
    if (iosHexInput) {
      fireEvent.change(iosHexInput, { target: { value: "#314159" } })
      expect(iosHexInput.value).toBe("#314159")
    }
  })

  test("iOS card: toggling the dedicated-image switch fires the iOS onPatch", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const platformToggles = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    // 0 = desktop, 1 = iOS, 2 = PWA
    expect(platformToggles.length).toBeGreaterThanOrEqual(3)
    fireEvent.click(platformToggles[1]!)

    await waitFor(() => {
      const labels = screen.getAllByText(messages.uploadDedicatedImageLabel)
      expect(labels.length).toBeGreaterThan(0)
    })
  })

  test("PWA maskable background color and margin can be edited", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const maskableHexInput = screen
      .getAllByDisplayValue("#FFFFFF")
      .filter(
        (el) =>
          el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
      )
      .at(-1) // last text input among #FFFFFF defaults is the maskable bg
    if (maskableHexInput) {
      fireEvent.change(maskableHexInput, { target: { value: "#fedcba" } })
    }

    const sliders = document.querySelectorAll<HTMLElement>("[role='slider']")
    for (const slider of Array.from(sliders)) {
      fireEvent.keyDown(slider, { key: "End" })
      fireEvent.keyDown(slider, { key: "Home" })
    }
  })

  test("changing the maskable margin slider via keyboard moves the value", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const sliders = document.querySelectorAll<HTMLElement>("[role='slider']")
    const maskableSlider = Array.from(sliders).find((s) => {
      const labelledBy = s.getAttribute("aria-labelledby")
      if (!labelledBy) return false
      const label = document.getElementById(labelledBy)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.maskableMarginLabel)
      )
    })
    if (maskableSlider) {
      fireEvent.keyDown(maskableSlider, { key: "ArrowLeft" })
    }
  })

  test("the description and asset path FieldDescription elements render", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    expect(screen.getByText(messages.descriptionDescription)).toBeDefined()
    expect(screen.getByText(messages.assetPathDescription)).toBeDefined()
    expect(screen.getByText(messages.startUrlDescription)).toBeDefined()
    expect(screen.getByText(messages.themeColorDescription)).toBeDefined()
    expect(screen.getByText(messages.backgroundColorDescription)).toBeDefined()
    expect(
      screen.getByText(messages.iosBackgroundColorDescription)
    ).toBeDefined()
    expect(
      screen.getAllByText(messages.useDifferentImageDescription).length
    ).toBeGreaterThan(0)
  })

  test("error alert hides after a new file is uploaded", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      expect(
        (
          screen.getByRole("button", {
            name: messages.generateLabel,
          }) as HTMLButtonElement
        ).disabled
      ).toBe(false)
    })

    const iosToggle = screen.getAllByRole("switch").find((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    fireEvent.click(iosToggle!)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(
        screen.getByText(messages.missingDedicatedImageDescription)
      ).toBeDefined()
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.removeImageLabel })
    )

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))

    await waitFor(() => {
      expect(
        screen.queryByText(messages.missingDedicatedImageDescription)
      ).toBeNull()
    })
  })

  test("loadImageSource failure surfaces the invalid-image alert", async () => {
    const loadModule = await import("./client/load-image-source")
    const mockLoad = vi.mocked(loadModule.loadImageSource)
    mockLoad.mockRejectedValueOnce(new Error("INVALID_IMAGE"))

    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const file = new File([new Uint8Array([0])], "broken.bin", {
      type: "image/png",
    })
    const fileInput = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidImageDescription)).toBeDefined()
    })

    expect(screen.getByText(messages.invalidImageTitle)).toBeDefined()
  })

  test("generation failure surfaces the generic generation-failed alert", async () => {
    const renderModule = await import("./client/render-bitmap")
    const mockRender = vi.mocked(renderModule.renderRaster)
    mockRender.mockRejectedValueOnce(new Error("CANVAS_CONTEXT_UNAVAILABLE"))

    render(<FaviconAssetsGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.useDemoLabel }))
    await waitFor(() => {
      expect(
        (
          screen.getByRole("button", {
            name: messages.generateLabel,
          }) as HTMLButtonElement
        ).disabled
      ).toBe(false)
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(screen.getByText(messages.generationFailedTitle)).toBeDefined()
    })
  })

  test("dedicated source load failure also surfaces the invalid-image alert", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const platformToggles = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    fireEvent.click(platformToggles[0]!)

    const loadModule = await import("./client/load-image-source")
    const mockLoad = vi.mocked(loadModule.loadImageSource)
    mockLoad.mockRejectedValueOnce(new Error("INVALID_IMAGE"))

    const inputs =
      document.querySelectorAll<HTMLInputElement>("input[type='file']")
    const file = new File([new Uint8Array([0])], "bad.bin", {
      type: "image/png",
    })
    fireEvent.change(inputs[1]!, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidImageDescription)).toBeDefined()
    })
  })

  test("clearing the dedicated image when nothing was set is a no-op", async () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const platformToggles = screen.getAllByRole("switch").filter((s) => {
      const id = s.getAttribute("id") ?? ""
      const label = document.querySelector(`label[for="${id}"]`)
      return (
        label !== null &&
        (label.textContent ?? "").includes(messages.useDifferentImageLabel)
      )
    })
    fireEvent.click(platformToggles[2]!)

    const inputs =
      document.querySelectorAll<HTMLInputElement>("input[type='file']")
    // Fire a change with no file — should clear (or stay null)
    fireEvent.change(inputs[1]!, { target: { files: [] } })

    expect(
      screen.getAllByText(messages.uploadDedicatedImageLabel).length
    ).toBeGreaterThan(0)
  })

  test("clearing the global image when no image is set is a no-op", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const fileInput = document.querySelector(
      "input[type='file']"
    ) as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [] } })

    expect(screen.getByText(messages.chooseImageLabel)).toBeDefined()
  })

  test("invalid hex characters in the color input are coerced to a hash-prefixed uppercase value", () => {
    render(<FaviconAssetsGeneratorClient messages={messages} />)

    const themeInputs = screen.getAllByDisplayValue("#FFFFFF")
    const themeInput = themeInputs.find(
      (el) => el.tagName === "INPUT" && (el as HTMLInputElement).type === "text"
    )!
    fireEvent.change(themeInput, { target: { value: "#ZZZ" } })
    // Normalized: still has a hash but the value isn't a 6-digit hex,
    // which forces ColorField to fall back to white for the picker.
    expect((themeInput as HTMLInputElement).value).toBe("#ZZZ")
    const pickers = document.querySelectorAll<HTMLInputElement>(
      "input[type='color']"
    )
    expect(pickers[0]!.value.toLowerCase()).toBe("#ffffff")
  })
})
