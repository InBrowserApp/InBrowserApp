import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test } from "vitest"

import ChmodCalculatorClient from "./client"

const messages = {
  meta: {
    name: "Chmod Calculator",
    description:
      "Calculate Unix file permissions between numeric and symbolic notation.",
  },
  presetsTitle: "Common Presets",
  executablePresetLabel: "Executable",
  readOnlyPresetLabel: "Read Only",
  fullAccessPresetLabel: "Full Access",
  ownerOnlyPresetLabel: "Owner Only",
  privateFilePresetLabel: "Private File",
  sharedDirPresetLabel: "Shared Directory",
  numericPermissionLabel: "Numeric Permission",
  numericPermissionPlaceholder: "e.g., 755",
  symbolicPermissionLabel: "Symbolic Permission",
  symbolicPermissionPlaceholder: "e.g., rwxr-xr-x",
  permissionMatrixLabel: "Permission Matrix",
  readLabel: "Read",
  writeLabel: "Write",
  executeLabel: "Execute",
  ownerLabel: "Owner",
  groupLabel: "Group",
  othersLabel: "Others",
  chmodCommandLabel: "Chmod Command",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
} as const

const STORAGE_KEY = "tools:chmod-calculator:numeric"

function getNumericInput() {
  return screen.getByRole("textbox", {
    name: messages.numericPermissionLabel,
  }) as HTMLInputElement
}

function getSymbolicInput() {
  return screen.getByRole("textbox", {
    name: messages.symbolicPermissionLabel,
  }) as HTMLInputElement
}

describe("ChmodCalculatorClient", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(cleanup)

  test("renders the default preset state", () => {
    render(<ChmodCalculatorClient messages={messages} />)

    expect(getNumericInput().value).toBe("755")
    expect(getSymbolicInput().value).toBe("rwxr-xr-x")
    expect(screen.getByText("chmod 755 <filename>")).toBeTruthy()
    expect(screen.getByRole("button", { name: "755 Executable" })).toSatisfy(
      (element: HTMLElement) => {
        return element.getAttribute("aria-pressed") === "true"
      }
    )
  })

  test("applies common presets", () => {
    render(<ChmodCalculatorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "644 Read Only" }))

    expect(getNumericInput().value).toBe("644")
    expect(getSymbolicInput().value).toBe("rw-r--r--")
    expect(screen.getByText("chmod 644 <filename>")).toBeTruthy()
    expect(screen.getByRole("button", { name: "644 Read Only" })).toSatisfy(
      (element: HTMLElement) => {
        return element.getAttribute("aria-pressed") === "true"
      }
    )
    expect(screen.getByRole("button", { name: "755 Executable" })).toSatisfy(
      (element: HTMLElement) => {
        return element.getAttribute("aria-pressed") === "false"
      }
    )
  })

  test("updates the symbolic value from numeric input", async () => {
    render(<ChmodCalculatorClient messages={messages} />)

    fireEvent.change(getNumericInput(), {
      target: { value: "700" },
    })

    await waitFor(() => {
      expect(getSymbolicInput().value).toBe("rwx------")
    })
  })

  test("updates the numeric value from symbolic input", async () => {
    render(<ChmodCalculatorClient messages={messages} />)

    fireEvent.change(getSymbolicInput(), {
      target: { value: "rw-r-----" },
    })

    await waitFor(() => {
      expect(getNumericInput().value).toBe("640")
    })
    expect(screen.getByText("chmod 640 <filename>")).toBeTruthy()
  })

  test("updates permissions from the checkbox matrix", async () => {
    render(<ChmodCalculatorClient messages={messages} />)

    fireEvent.click(
      screen.getByRole("checkbox", {
        name: `${messages.othersLabel} ${messages.writeLabel}`,
      })
    )

    await waitFor(() => {
      expect(getNumericInput().value).toBe("757")
    })
    expect(screen.getByText("chmod 757 <filename>")).toBeTruthy()
  })

  test("restores and persists the numeric input", async () => {
    window.localStorage.setItem(STORAGE_KEY, "600")

    render(<ChmodCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(getNumericInput().value).toBe("600")
    })

    fireEvent.change(getNumericInput(), { target: { value: "775" } })

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("775")
  })
})
