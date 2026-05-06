import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import CidrsMergerExcluderClient from "./client"

const messages = {
  meta: {
    name: "CIDRs Merger & Excluder",
    description: "Merge CIDR blocks and remove excluded networks.",
  },
  inputTitle: "CIDR Inputs",
  inputDescription:
    "Paste CIDR blocks to merge, then optionally subtract others.",
  mergeLabel: "CIDRs to merge",
  mergeDescription: "One CIDR per line, or comma-separated.",
  mergePlaceholder: "10.0.0.0/24",
  excludeLabel: "CIDRs to exclude",
  excludeDescription: "These ranges are removed after merging.",
  excludePlaceholder: "10.0.0.128/25",
  resultTitle: "Merge and Exclude Result",
  resultDescription: "Minimal CIDR blocks after exclusions are applied.",
  copyLabel: "Copy CIDR list",
  copiedLabel: "Copied",
  mergedInputCountLabel: "Merged inputs",
  excludedInputCountLabel: "Excluded inputs",
  outputCountLabel: "Output CIDRs",
  familyLabel: "Address family",
  emptyTitle: "Enter CIDR blocks",
  emptyDescription: "Paste networks to merge before calculating a result.",
  missingMergeTitle: "Merge list is required",
  missingMergeDescription: "Add at least one CIDR block to the merge list.",
  invalidTitle: "Invalid CIDR input",
  invalidDescription: "Check the highlighted CIDR values.",
  noCidrsTitle: "No CIDRs remain",
  noCidrsDescription: "The exclusions removed the full merged range.",
  mergeGroupLabel: "Merge list",
  excludeGroupLabel: "Exclude list",
  lineLabel: "line",
  moreErrorsLabel: "More invalid entries",
} as const

describe("CidrsMergerExcluderClient", () => {
  afterEach(() => {
    cleanup()
  })

  test("renders merged and excluded results", () => {
    render(<CidrsMergerExcluderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.mergeLabel), {
      target: { value: "10.0.0.0/24" },
    })
    fireEvent.change(screen.getByLabelText(messages.excludeLabel), {
      target: { value: "10.0.0.64/26" },
    })

    expect(screen.getByText("10.0.0.0/26")).toBeTruthy()
    expect(screen.getByText("10.0.0.128/25")).toBeTruthy()
    expect(screen.getByText("IPv4")).toBeTruthy()
  })

  test("shows invalid input details", () => {
    render(<CidrsMergerExcluderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.mergeLabel), {
      target: { value: "not-a-cidr" },
    })

    expect(screen.getAllByText(messages.invalidTitle).length).toBeGreaterThan(0)
    expect(screen.getByText(/Merge list, line 1: not-a-cidr/)).toBeTruthy()
  })

  test("shows a no-result state when exclusions remove every block", () => {
    render(<CidrsMergerExcluderClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.mergeLabel), {
      target: { value: "10.0.0.0/24" },
    })
    fireEvent.change(screen.getByLabelText(messages.excludeLabel), {
      target: { value: "10.0.0.0/24" },
    })

    expect(screen.getByText(messages.noCidrsTitle)).toBeTruthy()
    expect(screen.getByText(messages.noCidrsDescription)).toBeTruthy()
  })
})
