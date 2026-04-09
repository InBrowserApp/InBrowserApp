import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import OpenApiToTypescriptConverterClient from "./client"
import {
  DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
  LARGE_OPENAPI_INPUT_THRESHOLD,
  SAMPLE_OPENAPI_DOCUMENT,
  STORAGE_KEYS,
} from "./client/constants"
import {
  generateOpenApiTypes,
  parseOpenApiDocument,
} from "./core/openapi-typescript"

const messages = {
  meta: {
    name: "OpenAPI to TypeScript Converter",
    description:
      "Convert OpenAPI 3.x documents into TypeScript types entirely in your browser with common openapi-typescript generation options.",
  },
  openApiLabel: "OpenAPI document",
  openApiDescription:
    "Paste an OpenAPI 3.0 or 3.1 document in JSON or YAML, import it from a file, or fetch it from a CORS-enabled URL.",
  openApiPlaceholder: "Paste OpenAPI JSON or YAML here...",
  typescriptLabel: "TypeScript output",
  typescriptDescription:
    "Generated TypeScript types are produced with a browser-safe openapi-typescript pipeline and the options below.",
  typescriptEmptyDescription:
    "Paste or import an OpenAPI document on the left to preview the generated TypeScript types here.",
  invalidOpenApiLabel: "Invalid OpenAPI document",
  generationErrorLabel: "Could not generate TypeScript",
  externalRefsLabel: "External $ref targets are not supported",
  externalRefsDescription:
    "Bundle or inline external schemas before generating types in the browser.",
  generationPausedHint:
    "Large OpenAPI document detected. Automatic generation is paused to keep editing responsive.",
  generateNowLabel: "Generate now",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  importFromFileLabel: "Import from file",
  importFromUrlLabel: "Import from URL",
  hideUrlImportLabel: "Hide URL import",
  importUrlFieldLabel: "OpenAPI URL",
  importUrlDescription:
    "This fetch runs in your browser, so the target URL must allow CORS.",
  importUrlPlaceholder: "https://example.com/openapi.yaml",
  fetchUrlLabel: "Fetch",
  fetchingUrlLabel: "Fetching",
  optionsLabel: "Generation options",
  optionsDescription:
    "Tune the generated types without changing the source document.",
  allowAdditionalPropertiesLabel: "Allow additional properties",
  defaultNonNullableLabel: "Default non-nullable",
  propertiesRequiredByDefaultLabel: "Properties required by default",
  useTypeAliasesLabel: "Use `type` aliases",
  generateEnumsLabel: "Generate enums",
  pathParamsAsTypesLabel: "Path params as types",
  generateRootTypesLabel: "Generate root types",
  generatePathsEnumLabel: "Generate paths enum",
  generatePathParamHelpersLabel: "Generate path param helpers",
  immutableTypesLabel: "Readonly output",
  excludeDeprecatedLabel: "Exclude deprecated fields",
  includeHeaderCommentLabel: "Include header comment",
  copyTypesLabel: "Copy types",
  copiedLabel: "Copied",
  downloadTypesLabel: "Download .d.ts",
  importUrlEmptyError: "Enter a URL to import.",
  importUrlInvalidError: "URL must start with http:// or https://.",
  importUrlFetchError: "Failed to fetch the URL: {message}",
  invalidDocumentMessage: "Invalid OpenAPI document",
  invalidDocumentWithMessage: "Invalid OpenAPI document: {message}",
  invalidRootMessage: "OpenAPI document must be an object",
  unsupportedVersionMessage: "Only OpenAPI 3.0 and 3.1 documents are supported",
} as const

beforeEach(() => {
  const NativeURL = globalThis.URL

  class MockURL extends NativeURL {}

  Object.assign(MockURL, {
    createObjectURL: vi.fn(() => "blob:openapi-types"),
    revokeObjectURL: vi.fn(),
  })

  vi.stubGlobal("URL", MockURL)
  vi.stubGlobal("fetch", vi.fn())

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.openApiLabel,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.typescriptLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

function makeOpenApiDocument(componentName: string) {
  return `openapi: 3.1.0
info:
  title: ${componentName} API
  version: "1.0.0"
paths:
  /${componentName.toLowerCase()}s:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/${componentName}"
components:
  schemas:
    ${componentName}:
      type: object
      properties:
        id:
          type: string
      required:
        - id
`
}

function makeLargeOpenApiDocument(componentName: string) {
  return `${makeOpenApiDocument(componentName)}#${"x".repeat(
    LARGE_OPENAPI_INPUT_THRESHOLD
  )}`
}

describe("OpenApiToTypescriptConverterClient", () => {
  test("renders the sample document and generated TypeScript output", () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    const parseResult = parseOpenApiDocument(SAMPLE_OPENAPI_DOCUMENT)

    expect(screen.getByText(messages.openApiDescription)).toBeTruthy()
    expect(screen.getByText(messages.typescriptDescription)).toBeTruthy()
    expect(getInput().value).toBe(SAMPLE_OPENAPI_DOCUMENT)
    expect(getOutput().querySelector(".hljs")).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()

    if (parseResult.ok) {
      expect(getOutput().textContent).toBe(
        generateOpenApiTypes(parseResult.document)
      )
    }
  })

  test("shows an error state for invalid OpenAPI input and disables export actions", async () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "{" },
    })

    const outputAlert = within(getOutput()).getByRole("alert")

    await waitFor(() => {
      expect(outputAlert.textContent).toContain(messages.invalidOpenApiLabel)
    })

    expect(outputAlert.textContent).toContain(messages.invalidDocumentMessage)
    expect(
      screen.getByRole("button", { name: messages.copyTypesLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadTypesLabel })
    ).toHaveProperty("disabled", true)
  })

  test("shows unsupported external refs in the output state", async () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        value: `openapi: 3.1.0
info:
  title: Demo
  version: "1.0.0"
paths:
  /users:
    get:
      responses:
        "200":
          description: OK
          content:
            application/json:
              schema:
                $ref: ./schemas.yaml#/User
`,
      },
    })

    await waitFor(() => {
      expect(getOutput().textContent).toContain(messages.externalRefsLabel)
    })

    expect(getOutput().textContent).toContain("./schemas.yaml#/User")
  })

  test("imports an OpenAPI document from a selected file", async () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    const file = new File([makeOpenApiDocument("Pet")], "pet.yaml", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toContain("Pet API")
    })

    expect(getOutput().textContent).toContain("Pet")
  })

  test("fetches an OpenAPI document from a URL", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      text: async () => makeOpenApiDocument("Order"),
    } as Response)
    vi.stubGlobal("fetch", fetchMock)

    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromUrlLabel })
    )
    fireEvent.change(
      screen.getByRole("textbox", { name: messages.importUrlFieldLabel }),
      {
        target: { value: "https://example.com/openapi.yaml" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.fetchUrlLabel })
    )

    await waitFor(() => {
      expect(getInput().value).toContain("Order API")
    })

    expect(fetchMock).toHaveBeenCalledWith("https://example.com/openapi.yaml", {
      mode: "cors",
    })

    await waitFor(() => {
      expect(getOutput().textContent).toContain("Order")
    })
  })

  test("shows a validation error for an invalid import URL", async () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromUrlLabel })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.fetchUrlLabel })
    )

    await waitFor(() => {
      expect(screen.getByRole("alert").textContent).toContain(
        messages.importUrlEmptyError
      )
    })
  })

  test("pauses automatic generation for large documents until Generate now is clicked", async () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: makeLargeOpenApiDocument("Pet") },
    })

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: messages.generateNowLabel })
      ).toBeTruthy()
    })

    expect(getOutput().textContent).toContain("User")
    expect(getOutput().textContent).not.toContain("Pet")

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateNowLabel })
    )

    await waitFor(() => {
      expect(getOutput().textContent).toContain("Pet")
    })
  })

  test("restores stored input and options and persists edits", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.openApiText,
      makeOpenApiDocument("Invoice")
    )
    window.localStorage.setItem(
      STORAGE_KEYS.options,
      JSON.stringify({
        ...DEFAULT_OPENAPI_TYPEGEN_OPTIONS,
        exportType: true,
      })
    )

    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toContain("Invoice API")
    })

    expect(
      screen
        .getByRole("checkbox", { name: messages.useTypeAliasesLabel })
        .getAttribute("data-state")
    ).toBe("checked")
    expect(window.localStorage.getItem(STORAGE_KEYS.openApiText)).toContain(
      "Invoice API"
    )

    fireEvent.change(getInput(), {
      target: { value: makeOpenApiDocument("Billing") },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.openApiText)).toContain(
      "Billing API"
    )
  })

  test("revokes the previous download URL when the output is cleared", () => {
    render(<OpenApiToTypescriptConverterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:openapi-types")
  })
})
