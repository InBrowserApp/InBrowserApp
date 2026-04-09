import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import meta from "./meta/en.json"
import messagesJson from "./messages/en.json"
import SqlFormatterAndLinterClient from "./client"
import {
  DEFAULT_SQL,
  DEFAULT_SQL_FORMAT_OPTIONS,
  DEFAULT_SQL_LINT_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"

const messages = {
  meta,
  ...messagesJson,
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:formatted-sql"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function getSourceInput() {
  return screen.getByRole("textbox", {
    name: messages.sourceSqlLabel,
  }) as HTMLTextAreaElement
}

function getOutputRegion() {
  return screen.getByRole("region", {
    name: messages.formattedSqlLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("SqlFormatterAndLinterClient", () => {
  test("renders the sample query, formatted output, and clean lint state", () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    expect(getSourceInput().value).toBe(DEFAULT_SQL)
    expect(getOutputRegion().textContent).toContain("ORDER BY")
    expect(getOutputRegion().querySelector(".hljs")).toBeTruthy()
    expect(screen.getByText(messages.optionsDescription)).toBeTruthy()
    expect(screen.getByText(messages.lintCleanTitle)).toBeTruthy()
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows a formatting error and lint parse error for invalid SQL", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getSourceInput(), {
      target: { value: "select (" },
    })

    const outputAlert = within(getOutputRegion()).getByRole("alert")

    await waitFor(() => {
      expect(outputAlert.textContent).toContain(messages.formattingErrorLabel)
    })

    expect(screen.getByText("parse-error")).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.copySqlLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadSqlLabel })
    ).toHaveProperty("disabled", true)
  })

  test("updates formatting and lint output when options change", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getSourceInput(), {
      target: { value: "select * from users" },
    })
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.useTabsLabel })
    )
    fireEvent.click(
      screen.getByRole("combobox", { name: messages.keywordCaseLabel })
    )

    fireEvent.click(
      screen.getByRole("option", { name: messages.upperCaseLabel })
    )

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("SELECT")
      expect(screen.getByText("no-select-star")).toBeTruthy()
    })
  })

  test("imports SQL from a selected file and detects the dialect from the filename", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    const file = new File(["select id from users;"], "report.pgsql", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getSourceInput().value).toBe("select id from users;")
    })

    expect(
      screen.getByRole("combobox", { name: messages.dialectLabel }).textContent
    ).toContain("PostgreSQL")
  })

  test("imports SQL from a generic file without changing the current dialect", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    const file = new File(["select id from users;"], "notes.txt", {
      type: "text/plain",
    })

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getSourceInput().value).toBe("select id from users;")
    })

    expect(
      screen.getByRole("combobox", { name: messages.dialectLabel }).textContent
    ).toContain("SQL (Generic)")
  })

  test("restores persisted source SQL and options from local storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.sourceSql, "select * from users")
    window.localStorage.setItem(
      STORAGE_KEYS.formatOptions,
      JSON.stringify({
        dialect: "mysql",
        tabWidth: 4,
        useTabs: true,
        linesBetweenQueries: 2,
        expressionWidth: 80,
        keywordCase: "upper",
        dataTypeCase: "lower",
        functionCase: "upper",
      })
    )
    window.localStorage.setItem(
      STORAGE_KEYS.lintOptions,
      JSON.stringify({
        ...DEFAULT_SQL_LINT_OPTIONS,
        maxLineLength: 0,
      })
    )

    render(<SqlFormatterAndLinterClient messages={messages} />)

    await waitFor(() => {
      expect(getSourceInput().value).toBe("select * from users")
    })

    expect(
      screen.getByRole("combobox", { name: messages.dialectLabel }).textContent
    ).toContain("MySQL")
    expect(
      (
        screen.getByRole("spinbutton", {
          name: messages.tabWidthLabel,
        }) as HTMLInputElement
      ).value
    ).toBe("4")
    expect(
      screen
        .getByRole("checkbox", { name: messages.useTabsLabel })
        .getAttribute("aria-checked")
    ).toBe("true")
  })

  test("persists edits and option changes", () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getSourceInput(), {
      target: { value: "select id from users;" },
    })
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.maxLineLengthLabel }),
      {
        target: { value: "120" },
      }
    )

    expect(window.localStorage.getItem(STORAGE_KEYS.sourceSql)).toBe(
      "select id from users;"
    )
    expect(window.localStorage.getItem(STORAGE_KEYS.lintOptions)).toContain(
      '"maxLineLength":120'
    )
  })

  test("clears the source while keeping the options intact and revokes the previous download URL", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    await waitFor(() => {
      expect(getSourceInput().value).toBe("")
    })

    expect(getOutputRegion().textContent).toContain(
      messages.formattedSqlEmptyDescription
    )
    expect(screen.getByText(messages.lintIdleTitle)).toBeTruthy()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:formatted-sql")
  })

  test("revokes the previous download URL when the formatted SQL changes to another valid query", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getSourceInput(), {
      target: { value: "select id from accounts;" },
    })

    await waitFor(() => {
      expect(getOutputRegion().textContent).toContain("accounts")
    })

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:formatted-sql")
  })

  test("ignores empty file selections", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [] },
    })

    await waitFor(() => {
      expect(getSourceInput().value).toBe(DEFAULT_SQL)
    })
  })

  test("restores the sample query and default options", async () => {
    render(<SqlFormatterAndLinterClient messages={messages} />)

    fireEvent.change(getSourceInput(), {
      target: { value: "delete from users" },
    })
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.tabWidthLabel }),
      {
        target: { value: "8" },
      }
    )
    fireEvent.click(
      screen.getByRole("checkbox", { name: messages.checkSelectStarLabel })
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    await waitFor(() => {
      expect(getSourceInput().value).toBe(DEFAULT_SQL)
    })

    expect(
      (
        screen.getByRole("spinbutton", {
          name: messages.tabWidthLabel,
        }) as HTMLInputElement
      ).value
    ).toBe(String(DEFAULT_SQL_FORMAT_OPTIONS.tabWidth))
    expect(
      screen
        .getByRole("checkbox", { name: messages.checkSelectStarLabel })
        .getAttribute("aria-checked")
    ).toBe(String(DEFAULT_SQL_LINT_OPTIONS.checkSelectStar))
  })
})
