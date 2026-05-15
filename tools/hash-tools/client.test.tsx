import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import HashToolsClient, { type HashToolsMessages } from "./client"

const messages = {
  meta: {
    name: "Hash Tools",
    description: "Browse hash tools.",
  },
  search: {
    label: "Find a hash tool",
    placeholder: "Search",
    description: "Try SHA-256.",
    clear: "Clear search",
  },
  filters: {
    label: "Filter by tool family",
    all: "All",
    resultCount: "{count} tools",
    emptyTitle: "No matching hash tools",
    emptyDescription: "Try a broader search.",
    showAll: "Show all tools",
  },
  stats: {
    toolCount: "{count} local tools",
    groupCount: "{count} families",
    privacy: "Runs in your browser",
  },
  groups: {
    cryptographic: {
      name: "Cryptographic digests",
      description: "Digest tools.",
    },
    password: {
      name: "Password hashing and KDFs",
      description: "Password tools.",
    },
    keyed: {
      name: "Keyed hashes and integrity",
      description: "Keyed tools.",
    },
    checksum: {
      name: "Checksums and fast hashes",
      description: "Checksum tools.",
    },
  },
  kinds: {
    textFile: "Text or file",
    passwordHash: "Password hash",
    passwordVerify: "Verifier",
    keyDerivation: "Key derivation",
    keyedHash: "Keyed hash",
    integrity: "Integrity",
    checksum: "Checksum",
  },
  actions: {
    openTool: "Open tool",
  },
  notes: {
    title: "Choose the right hash",
    body: "Use the right tool.",
  },
} satisfies HashToolsMessages

afterEach(() => {
  cleanup()
})

describe("HashToolsClient", () => {
  it("renders grouped hash tools with localized links", () => {
    render(<HashToolsClient lang="fr" messages={messages} />)

    expect(screen.getByText("46 local tools")).toBeTruthy()
    expect(screen.getByText("4 families")).toBeTruthy()

    const shaCard = screen.getByText("SHA-256").closest("[data-slot='card']")
    expect(shaCard).not.toBeNull()
    const link = within(shaCard as HTMLElement).getByRole("link", {
      name: /open tool/i,
    })
    expect(link.getAttribute("href")).toBe("/fr/tools/sha256-hash-text-or-file")
  })

  it("filters by search query and can clear the query", () => {
    render(<HashToolsClient lang="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText("Find a hash tool"), {
      target: { value: "bcrypt verifier" },
    })

    expect(screen.getByText("1 tools")).toBeTruthy()
    expect(screen.getByText("bcrypt password verifier")).toBeTruthy()
    expect(screen.queryByText("bcrypt password hash")).toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /clear search/i }))

    expect(screen.getByText("46 tools")).toBeTruthy()
    expect(screen.getByText("bcrypt password hash")).toBeTruthy()
  })

  it("filters by family and resets from the empty state", () => {
    render(<HashToolsClient lang="en" messages={messages} />)

    fireEvent.click(
      screen.getByRole("radio", { name: /checksums and fast hashes/i })
    )
    fireEvent.change(screen.getByLabelText("Find a hash tool"), {
      target: { value: "argon2" },
    })

    expect(screen.getByText("No matching hash tools")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: /show all tools/i }))

    expect(screen.getByText("46 tools")).toBeTruthy()
    expect(screen.getByText("Argon2 password hash")).toBeTruthy()
  })
})
