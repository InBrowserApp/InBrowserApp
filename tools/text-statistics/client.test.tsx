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
    description: "Analyze text counts and time estimates.",
  },
  placeholder: "Enter or paste your text here...",
  characters: "Characters",
  charactersNoSpaces: "Characters (no spaces)",
  words: "Words",
  lines: "Lines",
  paragraphs: "Paragraphs",
  sentences: "Sentences",
  readingTime: "Reading Time",
  speakingTime: "Speaking Time",
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
    expect(screen.getByText(messages.characters)).toBeTruthy()
    expect(screen.getAllByText("0")).not.toHaveLength(0)
    expect(screen.getAllByText("0s")).toHaveLength(2)
  })

  test("updates statistics when text changes", async () => {
    render(<TextStatisticsClient messages={messages} />)

    fireEvent.change(screen.getByLabelText(messages.placeholder), {
      target: {
        value: "Hello world!\nThis is a test.\n\nAnother paragraph?",
      },
    })

    await waitFor(() => {
      expect(screen.getByText("48")).toBeTruthy()
    })

    expect(screen.getByText("40")).toBeTruthy()
    expect(screen.getByText("8")).toBeTruthy()
    expect(screen.getByText("4")).toBeTruthy()
    expect(screen.getByText("2")).toBeTruthy()
    expect(screen.getByText("3")).toBeTruthy()
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
})
