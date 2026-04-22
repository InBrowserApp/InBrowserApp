import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import UrlParserBuilderClient from "./client"

const messages = {
  meta: {
    name: "URL Parser and Builder",
    description: "Parse a complete URL and rebuild it from individual parts.",
  },
  rawUrlLabel: "URL",
  rawUrlDescription: "Paste a full URL or edit the structured fields below.",
  rawUrlPlaceholder: "https://example.com/path?query=value#fragment",
  presetApiLabel: "API endpoint",
  presetAuthLabel: "Signed-in URL",
  presetCampaignLabel: "Campaign link",
  copyUrlLabel: "Copy URL",
  copiedLabel: "Copied",
  resetLabel: "Reset example",
  invalidUrlTitle: "Invalid URL",
  invalidUrlEmptyDescription: "Enter a complete URL to start parsing.",
  invalidUrlRelativeDescription:
    "Use an absolute URL with a protocol, such as https://example.com/path.",
  invalidUrlMalformedDescription:
    "The URL could not be parsed. Check the host, port, and reserved characters.",
  builderErrorTitle: "Incomplete builder fields",
  missingProtocolError: "Protocol is required.",
  invalidProtocolError:
    "Use a valid protocol such as https, http, ftp, ws, or a custom scheme.",
  missingHostnameError: "Hostname is required.",
  invalidPortError: "Port must be a number between 1 and 65535.",
  authorityCardLabel: "Authority",
  routeCardLabel: "Path and fragment",
  queryCardLabel: "Query parameters",
  diagnosticsLabel: "Diagnostics",
  protocolLabel: "Protocol",
  usernameLabel: "Username",
  passwordLabel: "Password",
  hostnameLabel: "Hostname",
  portLabel: "Port",
  pathLabel: "Path",
  hashLabel: "Hash",
  queryKeyLabel: "Key",
  queryValueLabel: "Value",
  addQueryParameterLabel: "Add parameter",
  removeQueryParameterLabel: "Remove parameter",
  emptyQueryState: "Add query pairs to build a search string.",
  originLabel: "Origin",
  authorityLabel: "Authority",
  pathSegmentsLabel: "Path segments",
  queryCountLabel: "Query pairs",
  noneLabel: "None",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("UrlParserBuilderClient", () => {
  test("renders the default example and diagnostics", () => {
    render(<UrlParserBuilderClient messages={messages} />)

    expect(
      (screen.getByLabelText("URL") as HTMLTextAreaElement).value
    ).toContain("https://api.example.com:8443/v1/search")
    expect(screen.getByText("api.example.com:8443")).toBeTruthy()
    expect(screen.getByText("response")).toBeTruthy()
  })

  test("parses a pasted URL into the structured fields", () => {
    render(<UrlParserBuilderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("URL"), {
      target: {
        value:
          "https://user:pass@example.com:9000/projects/launch-plan?tab=files#brief",
      },
    })

    expect((screen.getByLabelText("Hostname") as HTMLInputElement).value).toBe(
      "example.com"
    )
    expect((screen.getByLabelText("Port") as HTMLInputElement).value).toBe(
      "9000"
    )
    expect((screen.getByLabelText("Path") as HTMLInputElement).value).toBe(
      "/projects/launch-plan"
    )
    expect((screen.getByLabelText("Hash") as HTMLInputElement).value).toBe(
      "brief"
    )
  })

  test("shows an error for invalid raw input while preserving the typed value", () => {
    render(<UrlParserBuilderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: "/relative/path" },
    })

    expect(screen.getByText("Invalid URL")).toBeTruthy()
    expect(
      screen.getByText(messages.invalidUrlRelativeDescription)
    ).toBeTruthy()
    expect((screen.getByLabelText("URL") as HTMLTextAreaElement).value).toBe(
      "/relative/path"
    )
    expect((screen.getByLabelText("Hostname") as HTMLInputElement).value).toBe(
      "api.example.com"
    )
  })

  test("rebuilds the URL when authority and route fields change", () => {
    render(<UrlParserBuilderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText("Protocol"), {
      target: { value: "wss" },
    })
    fireEvent.change(screen.getByLabelText("Hostname"), {
      target: { value: "realtime.example.com" },
    })
    fireEvent.change(screen.getByLabelText("Path"), {
      target: { value: "/presence/board room" },
    })

    expect((screen.getByLabelText("URL") as HTMLTextAreaElement).value).toBe(
      "wss://realtime.example.com:8443/presence/board%20room?q=openai&limit=25#response"
    )
  })

  test("adds, edits, and removes query parameters", () => {
    render(<UrlParserBuilderClient messages={messages} />)

    fireEvent.click(screen.getAllByText("Add parameter")[0]!)
    fireEvent.change(screen.getByLabelText("Key 3"), {
      target: { value: "preview" },
    })
    fireEvent.change(screen.getByLabelText("Value 3"), {
      target: { value: "true" },
    })

    expect(
      (screen.getByLabelText("URL") as HTMLTextAreaElement).value
    ).toContain("preview=true")

    fireEvent.click(screen.getByLabelText("Remove parameter 2"))

    expect(
      (screen.getByLabelText("URL") as HTMLTextAreaElement).value
    ).not.toContain("limit=25")
  })

  test("restores the stored URL from localStorage", () => {
    window.localStorage.setItem(
      "tools:url-parser-builder:url",
      "https://example.com/reports/monthly?range=30d#summary"
    )

    render(<UrlParserBuilderClient messages={messages} />)

    expect((screen.getByLabelText("URL") as HTMLTextAreaElement).value).toBe(
      "https://example.com/reports/monthly?range=30d#summary"
    )
    expect((screen.getByLabelText("Hostname") as HTMLInputElement).value).toBe(
      "example.com"
    )
    expect((screen.getByLabelText("Hash") as HTMLInputElement).value).toBe(
      "summary"
    )
  })
})
