import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import WorkflowValidator from "./client"
import { checkWorkflow } from "./engine/check-workflow"
import messages from "./messages/en.json"

vi.mock("./engine/check-workflow", () => ({ checkWorkflow: vi.fn() }))
afterEach(cleanup)

it("loads the workflow example and reports its validation result", async () => {
  vi.mocked(checkWorkflow).mockResolvedValue([])
  render(<WorkflowValidator messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  fireEvent.click(screen.getByRole("button", { name: messages.validate }))
  expect(await screen.findByText(messages.valid)).toBeTruthy()
  expect(checkWorkflow).toHaveBeenCalledWith(
    expect.stringContaining("on: [push, pull_request]")
  )
})

it("shows localized and engine diagnostics in the results", async () => {
  vi.mocked(checkWorkflow).mockResolvedValue([
    { code: "singleDocument", location: { line: 3, column: 1, offset: 15 } },
    { message: "Unknown trigger", location: { line: 1, column: 1, offset: 0 } },
  ])
  render(<WorkflowValidator messages={messages} />)
  fireEvent.change(screen.getByLabelText(messages.inputLabel), {
    target: { value: "on: missing" },
  })
  fireEvent.click(screen.getByRole("button", { name: messages.validate }))
  expect(await screen.findByText(messages.singleDocument)).toBeTruthy()
  expect(screen.getByText("Unknown trigger").getAttribute("lang")).toBe("en")
})
