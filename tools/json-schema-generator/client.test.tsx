import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import JsonSchemaGeneratorClient from "./client"

const messages = {
  meta: {
    name: "JSON Schema Generator",
    description: "Generate JSON Schema from example JSON data",
  },
  inputTitle: "JSON Input",
  inputPlaceholder: "Paste JSON data here...",
  outputTitle: "Generated Schema",
  outputEmpty: "Provide valid JSON data to generate a schema",
  invalidJson: "Invalid JSON",
  optionsTitle: "Options",
  optionDraft: "Schema draft",
  optionInferRequired: "Infer required properties",
  optionAllowAdditionalProperties: "Allow additional properties",
  optionDetectFormat: "Detect string formats (uuid, email, uri, date-time)",
  useSampleLabel: "Use sample",
  importFromFileLabel: "Import from file",
  downloadSchemaLabel: "Download schema",
  copySchemaLabel: "Copy schema",
  copiedLabel: "Copied",
} as const

const sampleJson = `{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "age": 36,
  "active": true,
  "website": "https://example.com",
  "tags": ["math", "poetry"],
  "address": {
    "street": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA"
  },
  "projects": [
    { "name": "Analytical Engine", "year": 1843 },
    { "name": "Notes", "year": 1842, "url": "https://example.com/notes" }
  ],
  "lastSeen": "2024-01-20T10:12:30Z",
  "metadata": null
}`

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.inputTitle,
  }) as HTMLTextAreaElement
}

function getOutputText() {
  return (
    screen.getByRole("region", {
      name: messages.outputTitle,
    }).textContent ?? ""
  )
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("JsonSchemaGeneratorClient", () => {
  test("renders the sample JSON and generated schema by default", () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    expect(getInput().value).toBe(sampleJson)
    expect(getOutputText()).toContain(
      '"$schema": "https://json-schema.org/draft/2020-12/schema"'
    )
    expect(getOutputText()).toContain('"format": "uuid"')
    expect(
      screen.getByRole("link", { name: messages.downloadSchemaLabel })
    ).toBeTruthy()
  })

  test("shows an error for invalid JSON input", async () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: '{"name": }' },
    })

    await waitFor(() => {
      expect(screen.getByText(messages.invalidJson)).toBeTruthy()
    })

    expect(
      (
        screen.getByRole("button", {
          name: messages.downloadSchemaLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
  })

  test("loads the sample JSON back into the editor", async () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: '{"name":"Grace"}' },
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitFor(() => {
      expect(getInput().value).toBe(sampleJson)
    })
  })

  test("imports JSON from a file", async () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    const file = new File(['{"project":"Compiler"}'], "schema.json", {
      type: "application/json",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe('{"project":"Compiler"}')
      expect(getOutputText()).toContain('"project"')
    })
  })

  test("updates the schema when toggle options change", async () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    const detectFormatSwitch = screen.getByRole("switch", {
      name: messages.optionDetectFormat,
    })
    const allowAdditionalPropertiesSwitch = screen.getByRole("switch", {
      name: messages.optionAllowAdditionalProperties,
    })
    const inferRequiredSwitch = screen.getByRole("switch", {
      name: messages.optionInferRequired,
    })

    fireEvent.click(detectFormatSwitch)
    fireEvent.click(allowAdditionalPropertiesSwitch)
    fireEvent.click(inferRequiredSwitch)

    await waitFor(() => {
      expect(getOutputText()).not.toContain('"format": "uuid"')
      expect(getOutputText()).toContain('"additionalProperties": false')
      expect(getOutputText()).not.toContain('"required": [')
    })
  })

  test("updates the schema draft from the select", async () => {
    render(<JsonSchemaGeneratorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.optionDraft })
    )
    fireEvent.click(screen.getByRole("option", { name: "Draft-07" }))

    await waitFor(() => {
      expect(getOutputText()).toContain(
        '"$schema": "http://json-schema.org/draft-07/schema"'
      )
    })
  })

  test("restores persisted state from localStorage", async () => {
    window.localStorage.setItem(
      "tools:json-schema-generator:input",
      '{"email":"ada@example.com"}'
    )
    window.localStorage.setItem("tools:json-schema-generator:draft", "draft-07")
    window.localStorage.setItem(
      "tools:json-schema-generator:infer-required",
      "false"
    )
    window.localStorage.setItem(
      "tools:json-schema-generator:allow-additional-properties",
      "false"
    )
    window.localStorage.setItem(
      "tools:json-schema-generator:detect-format",
      "false"
    )

    render(<JsonSchemaGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getInput().value).toBe('{"email":"ada@example.com"}')
      expect(getOutputText()).toContain(
        '"$schema": "http://json-schema.org/draft-07/schema"'
      )
      expect(getOutputText()).not.toContain('"format": "email"')
      expect(getOutputText()).toContain('"additionalProperties": false')
      expect(getOutputText()).not.toContain('"required": [')
    })
  })
})
