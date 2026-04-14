import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import PortNumberLookupClient from "./client"

const messages = {
  meta: {
    name: "Port Number Lookup",
    description: "Search and browse common network port numbers",
  },
  searchPlaceholder: "Search by port number or service name...",
  all: "All",
  common: "Common",
  system: "System (0-1023)",
  registered: "Registered (1024+)",
  port: "Port",
  service: "Service",
  protocol: "Protocol",
  description: "Description",
  aboutTitle: "What is a Port Number?",
  aboutDescription:
    "A port number is a 16-bit unsigned integer (0-65535) used to identify specific processes or services on a networked device.",
  systemPorts: "System Ports (0-1023):",
  systemPortsDesc:
    "Also called well-known ports, reserved for common services like HTTP and SSH.",
  registeredPorts: "Registered Ports (1024-49151):",
  registeredPortsDesc:
    "Used by applications and services registered with IANA.",
  dynamicPorts: "Dynamic Ports (49152-65535):",
  dynamicPortsDesc: "Used for temporary connections by client applications.",
  noResultsTitle: "No matching ports found",
  noResultsDescription:
    "Try a different port number, service name, or category.",
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

describe("PortNumberLookupClient", () => {
  test("renders common rows from the bundled port catalog", () => {
    render(<PortNumberLookupClient language="en" messages={messages} />)

    expect(screen.getAllByText("Port Number Lookup")).toHaveLength(2)
    expect(screen.getByText("SSH")).toBeTruthy()
    expect(screen.getByText("HTTP")).toBeTruthy()
  })

  test("filters rows by the search query", () => {
    render(<PortNumberLookupClient language="en" messages={messages} />)

    fireEvent.change(
      screen.getByLabelText("Search by port number or service name..."),
      {
        target: { value: "mysql" },
      }
    )

    expect(screen.getByText("MySQL")).toBeTruthy()
    expect(screen.queryByText("SSH")).toBeNull()
  })

  test("filters rows by category", () => {
    render(<PortNumberLookupClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Registered (1024+)" }))

    expect(screen.getByText("MySQL")).toBeTruthy()
    expect(screen.queryByText("SSH")).toBeNull()
  })

  test("shows an empty state when no results match", () => {
    render(<PortNumberLookupClient language="en" messages={messages} />)

    fireEvent.change(
      screen.getByLabelText("Search by port number or service name..."),
      {
        target: { value: "definitely-not-a-real-service" },
      }
    )

    expect(screen.getByText("No matching ports found")).toBeTruthy()
    expect(
      screen.getByText(
        "Try a different port number, service name, or category."
      )
    ).toBeTruthy()
  })

  test("restores filters from localStorage on mount", () => {
    window.localStorage.setItem("tools:port-number-lookup:search", "mysql")
    window.localStorage.setItem(
      "tools:port-number-lookup:category",
      "registered"
    )

    render(<PortNumberLookupClient language="en" messages={messages} />)

    expect(screen.getByDisplayValue("mysql")).toBeTruthy()
    expect(screen.getByText("MySQL")).toBeTruthy()
    expect(screen.queryByText("SSH")).toBeNull()
  })

  test("persists filters to localStorage", () => {
    render(<PortNumberLookupClient language="en" messages={messages} />)

    fireEvent.change(
      screen.getByLabelText("Search by port number or service name..."),
      {
        target: { value: "dns" },
      }
    )
    fireEvent.click(screen.getByRole("radio", { name: "Common" }))

    expect(window.localStorage.getItem("tools:port-number-lookup:search")).toBe(
      "dns"
    )
    expect(
      window.localStorage.getItem("tools:port-number-lookup:category")
    ).toBe("common")
  })
})
