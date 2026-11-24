// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { expect, it } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

it("selects a matching conversion direction for a local file", async () => {
  const { container } = render(<Client messages={messages} />)
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  fireEvent.change(picker, {
    target: {
      files: [
        new File(['{"type":"Point","coordinates":[1,2]}'], "places.geojson"),
      ],
    },
  })
  await waitFor(() => {
    expect(screen.getByRole("textbox", { name: "KML" })).toHaveProperty(
      "value",
      expect.stringContaining("<Point><coordinates>1,2</coordinates>")
    )
  })
  expect(
    screen.getByRole("button", { name: messages.download })
  ).toHaveProperty("disabled", false)
})
