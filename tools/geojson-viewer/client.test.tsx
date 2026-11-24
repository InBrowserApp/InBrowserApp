import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/components/tool/offline-map", () => ({
  OfflineMap: ({ onSelect }: { onSelect: (index: number) => void }) => (
    <button onClick={() => onSelect(1)}>Select on map</button>
  ),
}))

afterEach(cleanup)

it("opens the example and inspects features through the map and list", () => {
  render(<Client messages={messages} lang="en" />)
  expect(screen.getByText(messages.empty)).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByText("Tokyo Station", { selector: "dd" })).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: "Select on map" }))
  expect(
    screen.getByText("Sumida River walk", { selector: "dd" })
  ).toBeDefined()
  fireEvent.change(screen.getByRole("combobox", { name: messages.features }), {
    target: { value: "2" },
  })
  expect(
    screen.getByText("Imperial Palace grounds", { selector: "dd" })
  ).toBeDefined()
})

it("renders pasted data and handles malformed and non-renderable geometry", () => {
  render(<Client messages={messages} lang="en" />)
  fireEvent.click(screen.getByRole("button", { name: messages.paste }))
  const input = screen.getByRole("textbox", { name: messages.paste })
  const submit = screen.getByRole("button", { name: messages.render })
  function paste(text: string) {
    fireEvent.change(input, { target: { value: text } })
    fireEvent.click(submit)
  }

  paste('{"type":"Feature","geometry":null,"properties":{"tags":[1,2]}}')
  expect(screen.getByText(messages.noGeometry)).toBeDefined()
  expect(screen.getByText("[1,2]")).toBeDefined()
  paste('{"type":"Point","coordinates":[0,0]}')
  expect(screen.getByText(messages.noProperties)).toBeDefined()
  paste('{"type":"FeatureCollection","features":[]}')
  expect(screen.getByText(messages.noGeometry)).toBeDefined()
  paste('{"type":"Point","coordinates":[198,0]}')
  expect(screen.getByText(messages.invalid)).toBeDefined()
})

it("opens a file and clears stale results on a read error", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.openFile }))
  expect(click).toHaveBeenCalledOnce()
  fireEvent.change(picker, {
    target: {
      files: [
        new File(['{"type":"Point","coordinates":[1,2]}'], "map.geojson"),
      ],
    },
  })
  expect(await screen.findByText("map.geojson")).toBeDefined()
  const failed = new File([], "failed.json")
  vi.spyOn(failed, "text").mockRejectedValue(new Error("Read failed"))
  fireEvent.change(picker, { target: { files: [failed] } })
  expect(await screen.findByText(messages.invalid)).toBeDefined()
  expect(screen.queryByText("map.geojson")).toBeNull()
})
