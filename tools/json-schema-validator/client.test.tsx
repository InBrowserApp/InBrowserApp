import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import JsonSchemaValidatorClient from "./client"

const messages = {
  meta: { name: "JSON Schema Validator", description: "Validate JSON data" },
  schemaLabel: "Schema",
  schemaDescription:
    "Provide a JSON Schema document. Draft-07 and 2020-12 are detected automatically.",
  schemaPlaceholder: "Paste a JSON Schema here\u2026",
  dataLabel: "JSON data",
  dataDescription:
    "Paste the JSON document you want to validate against the schema.",
  dataPlaceholder: "Paste JSON data here\u2026",
  optionsTitle: "Validation options",
  optionsDescription:
    "These options change how much detail the validator returns and whether format keywords are enforced.",
  validateFormatsLabel: "Validate format keywords",
  validateFormatsDescription:
    "Checks built-in formats such as uuid, email, uri, and date-time.",
  allErrorsLabel: "Collect all errors",
  allErrorsDescription:
    "Return every failing branch instead of stopping at the first error.",
  draftLabel: "Detected draft",
  idleTitle: "Paste both a schema and a JSON document to begin.",
  idleDescription:
    "Validation runs in the browser and updates as soon as both sides contain valid JSON.",
  parseErrorTitle: "One side still contains invalid JSON.",
  schemaErrorTitle: "The schema itself is invalid for the selected draft.",
  validTitle: "The JSON document matches the schema.",
  validDescription:
    "No validation errors were returned for the current schema and data pair.",
  invalidTitle: "The JSON document does not satisfy the schema.",
  invalidDescription:
    "Review the paths below to see which fields failed and why.",
  errorPathLabel: "Path",
  errorKeywordLabel: "Keyword",
  errorMessageLabel: "Message",
  resultTitle: "Validation result",
  resultDescription:
    "Real-time feedback as you edit the schema and data above.",
  copySchemaLabel: "Copy schema",
  copyDataLabel: "Copy data",
  copyErrorsLabel: "Copy errors JSON",
  copiedLabel: "Copied",
  loadExampleLabel: "Load example",
  clearLabel: "Clear",
} as const

const STORAGE_KEYS = {
  allErrors: "tools:json-schema-validator:all-errors",
  data: "tools:json-schema-validator:data",
  schema: "tools:json-schema-validator:schema",
  validateFormats: "tools:json-schema-validator:validate-formats",
} as const

const VALID_SCHEMA = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "name": { "type": "string", "minLength": 1 },
    "age": { "type": "integer", "minimum": 0 }
  },
  "required": ["id", "name"],
  "additionalProperties": false
}`

const VALID_DATA = `{
  "id": "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
  "name": "Ada Lovelace",
  "age": 37
}`

const INVALID_DATA = `{
  "id": "not-a-uuid",
  "name": "",
  "age": -5,
  "extra": true
}`

const DRAFT_07_SCHEMA = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  },
  "required": ["name"]
}`

const BROKEN_SCHEMA = `{
  "type": "object",
  "properties": {
    "x": { "type": "invalidtype" }
  }
}`

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(cleanup)

function getSchemaTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(
    messages.schemaPlaceholder
  ) as HTMLTextAreaElement
}

function getDataTextarea(): HTMLTextAreaElement {
  return screen.getByPlaceholderText(
    messages.dataPlaceholder
  ) as HTMLTextAreaElement
}

describe("JsonSchemaValidatorClient", () => {
  describe("initial render", () => {
    test("renders schema and data textareas with default example values", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      expect(schemaInput).toBeTruthy()
      expect(dataInput).toBeTruthy()
      expect(schemaInput.value).toContain('"$schema"')
      expect(dataInput.value).toContain("Ada Lovelace")
    })

    test("renders section headings and descriptions", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.schemaLabel)).toBeTruthy()
      expect(screen.getByText(messages.schemaDescription)).toBeTruthy()
      expect(screen.getByText(messages.dataLabel)).toBeTruthy()
      expect(screen.getByText(messages.dataDescription)).toBeTruthy()
      expect(screen.getByText(messages.optionsTitle)).toBeTruthy()
      expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
      expect(screen.getByText(messages.resultTitle)).toBeTruthy()
      expect(screen.getByText(messages.resultDescription)).toBeTruthy()
    })

    test("renders option labels and descriptions", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.validateFormatsLabel)).toBeTruthy()
      expect(screen.getByText(messages.validateFormatsDescription)).toBeTruthy()
      expect(screen.getByText(messages.allErrorsLabel)).toBeTruthy()
      expect(screen.getByText(messages.allErrorsDescription)).toBeTruthy()
      expect(screen.getByText(messages.draftLabel)).toBeTruthy()
    })

    test("renders load example and clear buttons", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.loadExampleLabel)).toBeTruthy()
      expect(screen.getByText(messages.clearLabel)).toBeTruthy()
    })

    test("renders copy buttons for schema and data", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.copySchemaLabel)).toBeTruthy()
      expect(screen.getByText(messages.copyDataLabel)).toBeTruthy()
    })

    test("shows valid result with default example", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.validTitle)).toBeTruthy()
      expect(screen.getByText(messages.validDescription)).toBeTruthy()
    })

    test("shows detected draft badge as 2020-12 for default schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText("2020-12")).toBeTruthy()
    })
  })

  describe("schema and data input changes", () => {
    test("updates schema textarea on input change", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, { target: { value: '{"type":"string"}' } })
      expect(schemaInput.value).toBe('{"type":"string"}')
    })

    test("updates data textarea on input change", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: '"hello"' } })
      expect(dataInput.value).toBe('"hello"')
    })
  })

  describe("load example button", () => {
    test("fills schema and data with default example values", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      fireEvent.change(schemaInput, { target: { value: "" } })
      fireEvent.change(dataInput, { target: { value: "" } })

      expect(schemaInput.value).toBe("")
      expect(dataInput.value).toBe("")

      const loadBtn = screen.getByText(messages.loadExampleLabel)
      fireEvent.click(loadBtn)

      expect(schemaInput.value).toContain('"$schema"')
      expect(dataInput.value).toContain("Ada Lovelace")
    })

    test("resets options to defaults when loading example", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      // Toggle validateFormats off
      const validateFormatsSwitch = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      fireEvent.click(validateFormatsSwitch)

      // Toggle allErrors off
      const allErrorsSwitch = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      fireEvent.click(allErrorsSwitch)

      // Load example should reset them
      const loadBtn = screen.getByText(messages.loadExampleLabel)
      fireEvent.click(loadBtn)

      expect(validateFormatsSwitch.getAttribute("data-state")).toBe("checked")
      expect(allErrorsSwitch.getAttribute("data-state")).toBe("checked")
    })
  })

  describe("clear button", () => {
    test("clears schema and data textareas", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      expect(schemaInput.value).not.toBe("")
      expect(dataInput.value).not.toBe("")

      const clearBtn = screen.getByText(messages.clearLabel)
      fireEvent.click(clearBtn)

      expect(schemaInput.value).toBe("")
      expect(dataInput.value).toBe("")
    })

    test("shows idle state after clearing", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const clearBtn = screen.getByText(messages.clearLabel)
      fireEvent.click(clearBtn)

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
      expect(screen.getByText(messages.idleDescription)).toBeTruthy()
    })
  })

  describe("validation results", () => {
    test("shows idle state when schema is empty", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, { target: { value: "" } })

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    })

    test("shows idle state when data is empty", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: "" } })

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    })

    test("shows valid result for matching data", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, { target: { value: VALID_SCHEMA } })
      fireEvent.change(dataInput, { target: { value: VALID_DATA } })

      expect(screen.getByText(messages.validTitle)).toBeTruthy()
      expect(screen.getByText(messages.validDescription)).toBeTruthy()
    })

    test("shows invalid result with error table for non-matching data", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, { target: { value: VALID_SCHEMA } })
      fireEvent.change(dataInput, { target: { value: INVALID_DATA } })

      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()
      expect(screen.getByText(messages.invalidDescription)).toBeTruthy()

      // Error table headers
      expect(screen.getByText(messages.errorPathLabel)).toBeTruthy()
      expect(screen.getByText(messages.errorKeywordLabel)).toBeTruthy()
      expect(screen.getByText(messages.errorMessageLabel)).toBeTruthy()
    })

    test("shows copy errors button when there are validation errors", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, { target: { value: VALID_SCHEMA } })
      fireEvent.change(dataInput, { target: { value: INVALID_DATA } })

      expect(screen.getByText(messages.copyErrorsLabel)).toBeTruthy()
    })

    test("does not show copy errors button when validation is valid", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.queryByText(messages.copyErrorsLabel)).toBeNull()
    })

    test("shows parse error for invalid JSON in schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, {
        target: { value: "{ not valid json" },
      })

      expect(screen.getByText(messages.parseErrorTitle)).toBeTruthy()
    })

    test("shows parse error for invalid JSON in data", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, {
        target: { value: "{ not valid json" },
      })

      expect(screen.getByText(messages.parseErrorTitle)).toBeTruthy()
    })

    test("parse error for schema shows schema label", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, {
        target: { value: "{bad json" },
      })

      // The component renders `messages.schemaLabel + ":"` inside a span
      const alertDescription = screen
        .getByText(messages.parseErrorTitle)
        .closest("[role='alert']")
      expect(alertDescription?.textContent).toContain(messages.schemaLabel)
    })

    test("parse error for data shows data label", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, {
        target: { value: "{bad json" },
      })

      const alertDescription = screen
        .getByText(messages.parseErrorTitle)
        .closest("[role='alert']")
      expect(alertDescription?.textContent).toContain(messages.dataLabel)
    })

    test("shows schema error for a schema that fails to compile", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, {
        target: { value: BROKEN_SCHEMA },
      })
      fireEvent.change(dataInput, { target: { value: '{"x": 1}' } })

      expect(screen.getByText(messages.schemaErrorTitle)).toBeTruthy()
    })
  })

  describe("detected draft badge", () => {
    test("displays 2020-12 for 2020-12 schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, { target: { value: VALID_SCHEMA } })

      expect(screen.getByText("2020-12")).toBeTruthy()
    })

    test("displays draft-07 for draft-07 schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, { target: { value: DRAFT_07_SCHEMA } })
      fireEvent.change(dataInput, {
        target: { value: '{"name": "test"}' },
      })

      expect(screen.getByText("draft-07")).toBeTruthy()
    })

    test("displays default 2020-12 in idle state", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const clearBtn = screen.getByText(messages.clearLabel)
      fireEvent.click(clearBtn)

      expect(screen.getByText("2020-12")).toBeTruthy()
    })

    test("displays detected draft for schema-error state", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()
      fireEvent.change(schemaInput, { target: { value: BROKEN_SCHEMA } })
      fireEvent.change(dataInput, { target: { value: '{"x": 1}' } })

      // schema-error state still shows detected draft
      expect(screen.getByText(messages.schemaErrorTitle)).toBeTruthy()
      expect(screen.getByText("2020-12")).toBeTruthy()
    })

    test("displays default 2020-12 in parse-error state", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, {
        target: { value: "not json" },
      })

      // parse-error state falls through to default "2020-12"
      expect(screen.getByText("2020-12")).toBeTruthy()
    })
  })

  describe("options: toggle switches", () => {
    test("validateFormats switch starts checked", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("checked")
    })

    test("allErrors switch starts checked", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("checked")
    })

    test("toggling validateFormats off changes validation behavior", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      // Default schema has format:"uuid" check; with format validation on, invalid uuid fails
      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, {
        target: {
          value: '{"id": "not-a-uuid", "name": "Test"}',
        },
      })

      // With format validation on, this should be invalid
      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()

      // Turn off format validation
      const switchEl = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      fireEvent.click(switchEl)

      expect(switchEl.getAttribute("data-state")).toBe("unchecked")

      // Now "not-a-uuid" passes because format is not enforced
      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })

    test("toggling allErrors switch changes its state", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("checked")

      fireEvent.click(switchEl)
      expect(switchEl.getAttribute("data-state")).toBe("unchecked")

      fireEvent.click(switchEl)
      expect(switchEl.getAttribute("data-state")).toBe("checked")
    })
  })

  describe("localStorage persistence", () => {
    test("saves schema to localStorage on change", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, {
        target: { value: '{"type":"number"}' },
      })

      expect(window.localStorage.getItem(STORAGE_KEYS.schema)).toBe(
        '{"type":"number"}'
      )
    })

    test("saves data to localStorage on change", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: "42" } })

      expect(window.localStorage.getItem(STORAGE_KEYS.data)).toBe("42")
    })

    test("saves validateFormats to localStorage on toggle", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      fireEvent.click(switchEl)

      expect(window.localStorage.getItem(STORAGE_KEYS.validateFormats)).toBe(
        "false"
      )
    })

    test("saves allErrors to localStorage on toggle", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      fireEvent.click(switchEl)

      expect(window.localStorage.getItem(STORAGE_KEYS.allErrors)).toBe("false")
    })

    test("restores schema from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.schema, '{"type":"boolean"}')

      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      expect(schemaInput.value).toBe('{"type":"boolean"}')
    })

    test("restores data from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.data, "true")

      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      expect(dataInput.value).toBe("true")
    })

    test("restores validateFormats from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.validateFormats, "false")

      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("unchecked")
    })

    test("restores allErrors from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.allErrors, "false")

      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("unchecked")
    })

    test("restores validateFormats=true from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.validateFormats, "true")

      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.validateFormatsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("checked")
    })

    test("restores allErrors=true from localStorage on mount", () => {
      window.localStorage.setItem(STORAGE_KEYS.allErrors, "true")

      render(<JsonSchemaValidatorClient messages={messages} />)

      const switchEl = screen.getByRole("switch", {
        name: messages.allErrorsLabel,
      })
      expect(switchEl.getAttribute("data-state")).toBe("checked")
    })

    test("does not restore when localStorage keys are absent", () => {
      // localStorage is cleared in beforeEach, so nothing is stored
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      // Should use defaults
      expect(schemaInput.value).toContain('"$schema"')
      expect(dataInput.value).toContain("Ada Lovelace")
    })
  })

  describe("error table details", () => {
    test("shows specific validation error rows", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      const schema = JSON.stringify({
        type: "object",
        properties: {
          name: { type: "string", minLength: 3 },
        },
        required: ["name"],
      })

      const data = JSON.stringify({ name: "ab" })

      fireEvent.change(schemaInput, { target: { value: schema } })
      fireEvent.change(dataInput, { target: { value: data } })

      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()

      // Should show minLength keyword in error table
      expect(screen.getByText("minLength")).toBeTruthy()
    })

    test("shows required property errors with path", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      const schema = JSON.stringify({
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
        },
        required: ["name", "email"],
      })

      const data = JSON.stringify({})

      fireEvent.change(schemaInput, { target: { value: schema } })
      fireEvent.change(dataInput, { target: { value: data } })

      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()
      expect(screen.getAllByText("required").length).toBeGreaterThanOrEqual(1)
    })

    test("shows multiple errors when allErrors is on", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      const schema = JSON.stringify({
        type: "object",
        properties: {
          a: { type: "string" },
          b: { type: "string" },
        },
        required: ["a", "b"],
      })

      const data = JSON.stringify({ a: 123, b: 456 })

      fireEvent.change(schemaInput, { target: { value: schema } })
      fireEvent.change(dataInput, { target: { value: data } })

      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()

      // With allErrors on, we should see errors for both fields
      const rows = screen.getAllByText("type")
      expect(rows.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe("copy buttons", () => {
    test("copy schema button is present", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)
      expect(screen.getByText(messages.copySchemaLabel)).toBeTruthy()
    })

    test("copy data button is present", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)
      expect(screen.getByText(messages.copyDataLabel)).toBeTruthy()
    })

    test("copy errors button appears only with validation errors", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      // Initially valid - no copy errors button
      expect(screen.queryByText(messages.copyErrorsLabel)).toBeNull()

      // Make invalid
      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, {
        target: {
          value: '{"id": "not-uuid", "name": "Test"}',
        },
      })

      expect(screen.getByText(messages.copyErrorsLabel)).toBeTruthy()

      // Make valid again
      fireEvent.change(dataInput, { target: { value: VALID_DATA } })
      expect(screen.queryByText(messages.copyErrorsLabel)).toBeNull()
    })
  })

  describe("state transitions", () => {
    test("transitions from valid to idle when data is cleared", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.validTitle)).toBeTruthy()

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: "" } })

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
      expect(screen.queryByText(messages.validTitle)).toBeNull()
    })

    test("transitions from valid to invalid when data changes", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      expect(screen.getByText(messages.validTitle)).toBeTruthy()

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: INVALID_DATA } })

      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()
      expect(screen.queryByText(messages.validTitle)).toBeNull()
    })

    test("transitions from invalid to valid when data is fixed", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: INVALID_DATA } })
      expect(screen.getByText(messages.invalidTitle)).toBeTruthy()

      fireEvent.change(dataInput, { target: { value: VALID_DATA } })
      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })

    test("transitions from parse-error to valid when JSON is fixed", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: "{bad" } })
      expect(screen.getByText(messages.parseErrorTitle)).toBeTruthy()

      fireEvent.change(dataInput, { target: { value: VALID_DATA } })
      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })

    test("transitions from schema-error to valid when schema is fixed", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      fireEvent.change(schemaInput, { target: { value: BROKEN_SCHEMA } })
      fireEvent.change(dataInput, { target: { value: '{"x": 1}' } })
      expect(screen.getByText(messages.schemaErrorTitle)).toBeTruthy()

      fireEvent.change(schemaInput, {
        target: {
          value: '{"type":"object","properties":{"x":{"type":"number"}}}',
        },
      })
      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })
  })

  describe("edge cases", () => {
    test("handles whitespace-only schema as idle", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      fireEvent.change(schemaInput, { target: { value: "   " } })

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    })

    test("handles whitespace-only data as idle", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const dataInput = getDataTextarea()
      fireEvent.change(dataInput, { target: { value: "   " } })

      expect(screen.getByText(messages.idleTitle)).toBeTruthy()
    })

    test("validates non-object JSON data against schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      fireEvent.change(schemaInput, {
        target: { value: '{"type":"string"}' },
      })
      fireEvent.change(dataInput, {
        target: { value: '"hello world"' },
      })

      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })

    test("validates array data against array schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      fireEvent.change(schemaInput, {
        target: {
          value: '{"type":"array","items":{"type":"number"}}',
        },
      })
      fireEvent.change(dataInput, { target: { value: "[1,2,3]" } })

      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })

    test("validates integer data against number schema", () => {
      render(<JsonSchemaValidatorClient messages={messages} />)

      const schemaInput = getSchemaTextarea()
      const dataInput = getDataTextarea()

      fireEvent.change(schemaInput, {
        target: { value: '{"type":"number"}' },
      })
      fireEvent.change(dataInput, { target: { value: "42" } })

      expect(screen.getByText(messages.validTitle)).toBeTruthy()
    })
  })
})
