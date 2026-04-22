import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, test } from "vitest"

import messagesJson from "../messages/en.json"
import meta from "../meta/en.json"
import { DEFAULT_SQL_FORMAT_OPTIONS } from "../core/sql-format"
import { FormatOptionsSection } from "./format-options-section"

const messages = {
  meta,
  ...messagesJson,
} as const

function FormatOptionsSectionHarness() {
  const [formatOptions, setFormatOptions] = useState(DEFAULT_SQL_FORMAT_OPTIONS)

  return (
    <FormatOptionsSection
      formatOptions={formatOptions}
      idPrefix="format"
      messages={messages}
      setFormatOptions={setFormatOptions}
    />
  )
}

describe("FormatOptionsSection", () => {
  test("updates every formatting control", { timeout: 10_000 }, async () => {
    render(<FormatOptionsSectionHarness />)

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.dialectLabel })
    )
    fireEvent.click(screen.getByRole("option", { name: "MySQL" }))

    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.tabWidthLabel }),
      {
        target: { value: "4" },
      }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", {
        name: messages.linesBetweenQueriesLabel,
      }),
      {
        target: { value: "3" },
      }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.expressionWidthLabel }),
      {
        target: { value: "120" },
      }
    )

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.keywordCaseLabel })
    )
    fireEvent.click(
      screen.getByRole("option", { name: messages.upperCaseLabel })
    )

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.dataTypeCaseLabel })
    )
    fireEvent.click(
      screen.getByRole("option", { name: messages.lowerCaseLabel })
    )

    fireEvent.click(
      screen.getByRole("combobox", { name: messages.functionCaseLabel })
    )
    fireEvent.click(
      screen.getByRole("option", { name: messages.upperCaseLabel })
    )

    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.useTabsLabel })
    )

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: messages.dialectLabel })
          .textContent
      ).toContain("MySQL")
      expect(
        (
          screen.getByRole("spinbutton", {
            name: messages.tabWidthLabel,
          }) as HTMLInputElement
        ).value
      ).toBe("4")
      expect(
        (
          screen.getByRole("spinbutton", {
            name: messages.linesBetweenQueriesLabel,
          }) as HTMLInputElement
        ).value
      ).toBe("3")
      expect(
        (
          screen.getByRole("spinbutton", {
            name: messages.expressionWidthLabel,
          }) as HTMLInputElement
        ).value
      ).toBe("120")
      expect(
        screen.getByRole("combobox", { name: messages.keywordCaseLabel })
          .textContent
      ).toContain(messages.upperCaseLabel)
      expect(
        screen.getByRole("combobox", { name: messages.dataTypeCaseLabel })
          .textContent
      ).toContain(messages.lowerCaseLabel)
      expect(
        screen.getByRole("combobox", { name: messages.functionCaseLabel })
          .textContent
      ).toContain(messages.upperCaseLabel)
      expect(
        screen
          .getByRole("checkbox", { name: messages.useTabsLabel })
          .getAttribute("aria-checked")
      ).toBe("true")
    })
  })
})
