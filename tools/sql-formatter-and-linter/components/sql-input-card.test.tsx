import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import messagesJson from "../messages/en.json"
import meta from "../meta/en.json"
import { SqlInputCard } from "./sql-input-card"

const messages = {
  meta,
  ...messagesJson,
} as const

describe("SqlInputCard", () => {
  test("forwards textarea and button actions", () => {
    const onClear = vi.fn()
    const onFileChange = vi.fn()
    const onSourceSqlChange = vi.fn()
    const onUseSample = vi.fn()
    const fileInputRef = { current: null as HTMLInputElement | null }

    render(
      <SqlInputCard
        fileInputRef={fileInputRef}
        hasInputError={false}
        messages={messages}
        sourceSql="select 1;"
        onClear={onClear}
        onFileChange={onFileChange}
        onSourceSqlChange={onSourceSqlChange}
        onUseSample={onUseSample}
      />
    )

    const clickSpy = vi.spyOn(fileInputRef.current!, "click")

    fireEvent.change(
      screen.getByRole("textbox", { name: messages.sourceSqlLabel }),
      {
        target: { value: "select 2;" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )
    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))
    fireEvent.click(
      screen.getByRole("button", { name: messages.importFromFileLabel })
    )
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: { files: [new File(["select 3;"], "query.sql")] },
    })

    expect(onSourceSqlChange).toHaveBeenCalledWith("select 2;")
    expect(onUseSample).toHaveBeenCalled()
    expect(onClear).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(onFileChange).toHaveBeenCalled()
  })
})
