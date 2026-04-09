import { fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, test } from "vitest"

import messagesJson from "../messages/en.json"
import meta from "../meta/en.json"
import { DEFAULT_SQL_LINT_OPTIONS } from "../core/sql-format"
import { LintOptionsSection } from "./lint-options-section"

const messages = {
  meta,
  ...messagesJson,
} as const

function LintOptionsSectionHarness() {
  const [lintOptions, setLintOptions] = useState(DEFAULT_SQL_LINT_OPTIONS)

  return (
    <LintOptionsSection
      idPrefix="lint"
      lintOptions={lintOptions}
      messages={messages}
      setLintOptions={setLintOptions}
    />
  )
}

describe("LintOptionsSection", () => {
  test("updates checkbox and numeric lint controls", () => {
    render(<LintOptionsSectionHarness />)

    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.checkSelectStarLabel })
    )
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.checkUnsafeMutationLabel })
    )
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.requireSemicolonLabel })
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.maxLineLengthLabel }),
      {
        target: { value: "0" },
      }
    )

    expect(
      screen
        .getByRole("checkbox", { name: messages.checkSelectStarLabel })
        .getAttribute("aria-checked")
    ).toBe("false")
    expect(
      screen
        .getByRole("checkbox", { name: messages.checkUnsafeMutationLabel })
        .getAttribute("aria-checked")
    ).toBe("false")
    expect(
      screen
        .getByRole("checkbox", { name: messages.requireSemicolonLabel })
        .getAttribute("aria-checked")
    ).toBe("false")
    expect(
      (
        screen.getByRole("spinbutton", {
          name: messages.maxLineLengthLabel,
        }) as HTMLInputElement
      ).value
    ).toBe("0")
  })
})
