import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { EncodingPicker } from "./encoding-picker"
import m from "./messages/en.json"

afterEach(cleanup)

test.each([true, false])(
  "keeps encoding options inside the reader dialog when present (%s)",
  async (insideDialog) => {
    const onChange = vi.fn()
    const picker = <EncodingPicker value="auto" onChange={onChange} m={m} />
    const { container } = render(
      insideDialog ? <dialog open>{picker}</dialog> : picker
    )
    fireEvent.keyDown(screen.getByRole("combobox", { name: m.encoding }), {
      key: "ArrowDown",
    })
    const option = await screen.findByRole("option", { name: "UTF-8" })
    expect(option.closest("dialog")).toBe(container.querySelector("dialog"))
    fireEvent.click(option)
    expect(onChange).toHaveBeenCalledExactlyOnceWith("utf-8")
    expect(screen.queryByRole("listbox")).toBeNull()
  }
)
