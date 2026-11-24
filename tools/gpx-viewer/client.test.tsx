import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"

vi.mock("@workspace/ui/components/tool/offline-map", () => ({
  OfflineMap: ({
    highlight,
    labels,
  }: {
    highlight?: number[]
    labels: ReadonlyMap<number, string>
  }) => (
    <div data-testid="map">
      {highlight?.join(",")}
      {Array.from(labels.values()).join(" ")}
    </div>
  ),
}))

afterEach(cleanup)

it("loads the example, shows the stats and moves along the profile", () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  expect(screen.getByText(messages.empty)).toBeDefined()
  fireEvent.click(screen.getByRole("button", { name: messages.example }))
  expect(screen.getByText(messages.ascent)).toBeDefined()
  const slider = screen.getByRole("slider", { name: messages.profile })
  expect(slider.getAttribute("aria-valuetext")).toContain("202")
  fireEvent.change(slider, { target: { value: "10" } })
  expect(slider.getAttribute("aria-valuetext")).toContain("599")
  expect(screen.getByTestId("map").textContent).toContain("Mount Takao")
  const chart = container.querySelector('svg[viewBox="0 0 800 200"]')!
  vi.spyOn(chart, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, 800, 200)
  )
  fireEvent.pointerMove(chart, { pointerType: "touch", clientX: 10 })
  expect(slider.getAttribute("aria-valuetext")).toContain("599")
  fireEvent.pointerMove(chart, { pointerType: "mouse", clientX: 10 })
  expect(slider.getAttribute("aria-valuetext")).toContain("202")
  fireEvent.pointerDown(chart, { pointerType: "touch", clientX: 790 })
  expect(slider.getAttribute("aria-valuetext")).toContain("571")
})

it("loads local waypoint-only files and reports invalid input", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  const click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.openFile }))
  expect(click).toHaveBeenCalledOnce()
  fireEvent.change(picker, {
    target: {
      files: [new File(['<gpx><wpt lat="1" lon="2"/></gpx>'], "places.gpx")],
    },
  })
  expect(await screen.findByText(messages.noElevation)).toBeDefined()
  expect(screen.getByText("places.gpx")).toBeDefined()
  expect(screen.getByTestId("map").textContent).toBe("Waypoint 1")
  fireEvent.change(picker, {
    target: { files: [new File(["<gpx/>"], "empty.gpx")] },
  })
  expect(await screen.findByText(messages.invalid)).toBeDefined()
  const failed = new File([], "failed.gpx")
  vi.spyOn(failed, "text").mockRejectedValue(new Error("Read failed"))
  fireEvent.change(picker, { target: { files: [failed] } })
})

it("draws a single sample and keeps its range control stable", async () => {
  const { container } = render(<Client messages={messages} lang="en" />)
  const picker =
    container.querySelector<HTMLInputElement>('input[type="file"]')!
  fireEvent.change(picker, {
    target: {
      files: [
        new File(
          ['<gpx><rte><rtept lat="1" lon="2"><ele>8</ele></rtept></rte></gpx>'],
          "route.gpx"
        ),
      ],
    },
  })
  const slider = await screen.findByRole("slider", { name: messages.profile })
  expect(slider).toHaveProperty("disabled", true)
  expect(slider.getAttribute("aria-valuetext")).toContain("8")
})
