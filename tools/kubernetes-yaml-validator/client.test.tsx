import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it } from "vitest"

import KubernetesValidator from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

it("checks the example and explains invalid and unsupported resources", async () => {
  render(<KubernetesValidator messages={messages} />)
  const validate = screen.getByRole("button", { name: messages.validate })
  const input = screen.getByLabelText<HTMLTextAreaElement>(messages.inputLabel)
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  fireEvent.click(validate)
  expect(await screen.findByText(messages.valid)).toBeTruthy()

  fireEvent.change(input, {
    target: {
      value: `apiVersion: example.com/v1
kind: Widget
---
apiVersion: v1
kind: ConfigMap
data:
  count: 2
`,
    },
  })
  fireEvent.click(validate)
  expect(await screen.findByText(messages.unknownSchema)).toBeTruthy()
  expect(await screen.findByText("must be string")).toBeTruthy()
})
