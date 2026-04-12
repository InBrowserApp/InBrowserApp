import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import TextStatisticsClient from "./client"

const messages = {
  meta: {
    name: "Text Statistics",
    description: "Turn any draft into a live writing dashboard.",
  },
  inputEyebrow: "Draft input",
  inputTitle: "Paste a draft, caption, script, or article",
  inputDescription: "The browser analyzes it live. Nothing leaves the page.",
  placeholder:
    "Start with a paragraph, a product description, meeting notes, or a full article…",
  loadSample: "Load sample",
  clearText: "Clear text",
  snapshotTitle: "Length at a glance",
  snapshotDescription:
    "Core volume metrics for quick sizing and publishing limits.",
  styleTitle: "Rhythm & vocabulary",
  styleDescription:
    "Signals that tell you how dense or varied the draft feels.",
  structureTitle: "Structure signals",
  structureDescription:
    "Useful when you want shorter paragraphs or faster scanning.",
  repeatedTermsTitle: "Repeated terms",
  repeatedTermsDescription: "Quick way to see what dominates the page.",
  repeatedTermsEmpty:
    "No repeated terms yet. Add more text and repeated vocabulary will show up here.",
  characters: "Characters",
  charactersNoSpaces: "Characters (no spaces)",
  words: "Words",
  uniqueWords: "Unique words",
  sentences: "Sentences",
  paragraphs: "Paragraphs",
  lines: "Lines",
  readingTime: "Reading Time",
  speakingTime: "Speaking Time",
  averageWordLength: "Average word length",
  averageSentenceWords: "Average sentence (words)",
  lexicalDiversity: "Lexical diversity",
  longestSentenceWords: "Longest sentence (words)",
  longestParagraphWords: "Longest paragraph (words)",
} as const

afterEach(() => {
  window.localStorage.clear()
  cleanup()
})

describe("TextStatisticsClient", () => {
  test("renders empty text with zeroed statistics by default", () => {
    render(<TextStatisticsClient messages={messages} />)

    expect(
      (screen.getByLabelText(messages.placeholder) as HTMLTextAreaElement).value
    ).toBe("")
    expect(screen.getByText(messages.snapshotTitle)).toBeTruthy()
    expect(screen.getAllByText("0")).not.toHaveLength(0)
    expect(screen.getAllByText("1s")).toHaveLength(2)
    expect(screen.getByText(messages.repeatedTermsEmpty)).toBeTruthy()
  })

  test("updates statistics when text changes", async () => {
    render(<TextStatisticsClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.placeholder), {
      target: {
        value: "Write fast. Edit later.\n\nWrite better drafts.",
      },
    })

    await waitFor(() => {
      expect(screen.getAllByText("7")).not.toHaveLength(0)
    })

    expect(screen.getAllByText("6")).not.toHaveLength(0)
    expect(screen.getAllByText("3")).not.toHaveLength(0)
    expect(screen.getAllByText("2")).not.toHaveLength(0)
    expect(screen.getByText("write")).toBeTruthy()
    expect(screen.getByText("×2")).toBeTruthy()
  })

  test("restores and persists text through localStorage", async () => {
    window.localStorage.setItem("tools:text-statistics:text", "Stored value")

    render(<TextStatisticsClient messages={messages} />)

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.placeholder) as HTMLTextAreaElement)
          .value
      ).toBe("Stored value")
    })

    fireEvent.change(screen.getByLabelText(messages.placeholder), {
      target: { value: "Updated text" },
    })

    expect(window.localStorage.getItem("tools:text-statistics:text")).toBe(
      "Updated text"
    )
  })

  test("loads sample text and clears it again", async () => {
    render(<TextStatisticsClient messages={messages} />)

    fireEvent.click(screen.getByText(messages.loadSample))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.placeholder) as HTMLTextAreaElement)
          .value
      ).toContain("A clean metric panel")
    })

    fireEvent.click(screen.getByText(messages.clearText))

    await waitFor(() => {
      expect(
        (screen.getByLabelText(messages.placeholder) as HTMLTextAreaElement)
          .value
      ).toBe("")
    })
  })
})
