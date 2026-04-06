import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test } from "vitest"

import { ToolPageShell } from "./tool-page-shell"

afterEach(cleanup)

describe("ToolPageShell", () => {
  test("renders title and description", () => {
    render(
      <ToolPageShell title="My Tool" description="A great tool">
        <div>content</div>
      </ToolPageShell>
    )

    expect(screen.getByText("My Tool")).toBeTruthy()
    expect(screen.getByText("A great tool")).toBeTruthy()
    expect(screen.getByText("content")).toBeTruthy()
  })

  test("renders action slot when provided", () => {
    render(
      <ToolPageShell
        title="Tool"
        description="Desc"
        action={<button type="button">Action</button>}
      >
        <div>content</div>
      </ToolPageShell>
    )

    expect(screen.getByText("Action")).toBeTruthy()
  })

  test("does not render action slot when not provided", () => {
    render(
      <ToolPageShell title="Tool" description="Desc">
        <div>content</div>
      </ToolPageShell>
    )

    expect(screen.queryByText("Action")).toBeNull()
  })
})
