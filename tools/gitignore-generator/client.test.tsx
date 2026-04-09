import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

vi.mock("./template-catalog", () => ({
  templateCatalog: [
    {
      name: "Node",
      path: "./node_modules/gitignore/Node.gitignore",
      category: "language",
      content: "node_modules/\ndist/",
    },
    {
      name: "Python",
      path: "./node_modules/gitignore/Python.gitignore",
      category: "language",
      content: "__pycache__/\n.venv/",
    },
    {
      name: "MetaProgrammingSystem",
      path: "./node_modules/gitignore/MetaProgrammingSystem.gitignore",
      category: "language",
      content: ".mps/",
    },
    {
      name: "Windows",
      path: "./node_modules/gitignore/Global/Windows.gitignore",
      category: "global",
      content: "Thumbs.db",
    },
    {
      name: "Laravel",
      path: "./node_modules/gitignore/community/PHP/Laravel.gitignore",
      category: "community",
      content: "bootstrap/cache/",
    },
  ],
}))

import GitignoreGeneratorClient from "./client"
import { STORAGE_KEYS } from "./client/constants"

const messages = {
  meta: {
    name: ".gitignore Generator",
    description:
      "Generate .gitignore files for your projects by selecting templates.",
  },
  templatesLabel: "Templates",
  templatesDescription:
    "Search official gitignore templates, choose the ones that match your stack, and generate a combined .gitignore file.",
  searchLabel: "Search templates",
  searchDescription: "Filter languages, tools, and environments by name.",
  searchPlaceholder: "Search templates...",
  quickSelectLabel: "Popular templates",
  selectedTemplatesLabel: "Selected templates",
  selectedCountLabel: "{count} selected",
  clearSelectionLabel: "Clear selection",
  emptySelectionLabel:
    "Choose one or more templates to build your .gitignore file.",
  noTemplatesFoundLabel: "No templates match this search.",
  languagesLabel: "Languages & frameworks",
  globalLabel: "Global",
  communityLabel: "Community",
  resultLabel: "Generated .gitignore",
  resultDescription:
    "Templates are combined in a stable order so you can copy, download, and tweak the result.",
  previewPlaceholder: "Select templates to generate .gitignore content.",
  copyResultLabel: "Copy result",
  copiedLabel: "Copied",
  downloadGitignoreLabel: "Download .gitignore",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:gitignore"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getSearchInput() {
  return screen.getByRole("textbox", {
    name: messages.searchLabel,
  }) as HTMLInputElement
}

function getPreviewArea() {
  return screen.getByRole("textbox", {
    name: messages.resultLabel,
  }) as HTMLTextAreaElement
}

describe("GitignoreGeneratorClient", () => {
  test("renders the empty state by default", () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    expect(screen.getByText(messages.emptySelectionLabel)).toBeTruthy()
    expect(getPreviewArea().value).toBe("")
    expect(getPreviewArea().placeholder).toBe(messages.previewPlaceholder)
    expect(
      screen.getByRole("button", { name: messages.downloadGitignoreLabel })
    ).toHaveProperty("disabled", true)
  })

  test("selects a quick template and generates preview content", async () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Node" }))

    await waitFor(() => {
      expect(getPreviewArea().value).toContain("### Node ###")
    })

    expect(getPreviewArea().value).toContain("node_modules/")
    expect(window.localStorage.getItem(STORAGE_KEYS.selectedTemplates)).toBe(
      JSON.stringify(["Node"])
    )
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("filters the template list by the search query", () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.change(getSearchInput(), {
      target: { value: "lar" },
    })

    expect(screen.getByText("Laravel")).toBeTruthy()
    expect(screen.queryByLabelText("Node")).toBeNull()
    expect(screen.queryByLabelText("Windows")).toBeNull()
  })

  test("keeps the full template name in the truncated label title", () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    expect(screen.getByTitle("MetaProgrammingSystem")).toBeTruthy()
  })

  test("shows an empty search state when no templates match", () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.change(getSearchInput(), {
      target: { value: "swift" },
    })

    expect(screen.getByText(messages.noTemplatesFoundLabel)).toBeTruthy()
  })

  test("restores valid selections from local storage and drops stale ones", async () => {
    window.localStorage.setItem(
      STORAGE_KEYS.selectedTemplates,
      JSON.stringify(["Node", "Unknown", "Windows", "Node"])
    )

    render(<GitignoreGeneratorClient messages={messages} />)

    await waitFor(() => {
      expect(getPreviewArea().value).toContain("### Node ###")
    })

    expect(getPreviewArea().value).toContain("### Windows ###")
    expect(getPreviewArea().value).not.toContain("Unknown")
  })

  test("ignores invalid local storage JSON", () => {
    window.localStorage.setItem(STORAGE_KEYS.selectedTemplates, "{")

    render(<GitignoreGeneratorClient messages={messages} />)

    expect(getPreviewArea().value).toBe("")
    expect(screen.getByText(messages.emptySelectionLabel)).toBeTruthy()
  })

  test("toggles a selected template off from the selected list", async () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Node" }))

    await waitFor(() => {
      expect(getPreviewArea().value).toContain("### Node ###")
    })

    const nodeButtons = screen.getAllByRole("button", { name: "Node" })
    fireEvent.click(nodeButtons.at(-1)!)

    await waitFor(() => {
      expect(getPreviewArea().value).toBe("")
    })

    expect(URL.revokeObjectURL).toHaveBeenCalled()
  })

  test("toggles a template from the checkbox list", async () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("checkbox", { name: "Windows" }))

    await waitFor(() => {
      expect(getPreviewArea().value).toContain("### Windows ###")
    })
  })

  test("clears the current selection", async () => {
    render(<GitignoreGeneratorClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Node" }))

    await waitFor(() => {
      expect(getPreviewArea().value).toContain("### Node ###")
    })

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearSelectionLabel })
    )

    expect(getPreviewArea().value).toBe("")
    expect(screen.getByText(messages.emptySelectionLabel)).toBeTruthy()
  })
})
