import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, it, vi } from "vitest"

import CidCalculator from "./client"
import messages from "./messages/en.json"

afterEach(cleanup)

const helloCid = "bafkreicysg23kiwv34eg2d7qweipxwosdo2py4ldv42nbauguluen5v6am"
const calculate = () =>
  fireEvent.click(screen.getByRole("button", { name: messages.calculate }))

it("compares a local file CID and keeps the reference when settings change", async () => {
  const { container } = render(
    <CidCalculator language="en" messages={messages} />
  )
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  expect(
    screen.getByRole("button", { name: messages.calculate })
  ).toHaveProperty("disabled", true)
  fireEvent.change(input, {
    target: { files: [new File(["hello\n"], "hello.txt")] },
  })
  calculate()
  await screen.findByText(helloCid)
  const reference = screen.getByLabelText(messages.compare)
  fireEvent.change(reference, { target: { value: "invalid" } })
  expect(screen.getByText(messages.invalidCid)).toBeTruthy()
  fireEvent.change(reference, { target: { value: helloCid } })
  expect(screen.getByText(messages.match)).toBeTruthy()
  fireEvent.change(screen.getByLabelText(messages.version), {
    target: { value: "0" },
  })
  expect(screen.queryByText(helloCid)).toBeNull()
  expect(screen.getByLabelText(messages.rawLeaves)).toHaveProperty(
    "disabled",
    true
  )
  calculate()
  await screen.findByText(messages.different)
  expect(reference).toHaveProperty("value", helloCid)
  expect(
    screen.getByRole("button", {
      name: `${messages.copy}: ${messages.command}`,
    })
  ).toBeTruthy()
})

it("keeps the primary task usable after an invalid drop or a failed read", async () => {
  render(<CidCalculator language="en" messages={messages} />)
  const dropTarget = screen.getByText(messages.drop).parentElement!
  const unavailable = new File(["hello\n"], "unavailable.txt")
  vi.spyOn(unavailable, "slice").mockImplementation(() => {
    throw new Error("Moved")
  })
  fireEvent.dragOver(dropTarget, { dataTransfer: {} })
  fireEvent.dragLeave(dropTarget)
  fireEvent.drop(dropTarget, {
    dataTransfer: { files: [unavailable, unavailable] },
  })
  expect(screen.getByRole("alert").textContent).toContain(messages.singleFile)
  fireEvent.drop(dropTarget, { dataTransfer: { files: [unavailable] } })
  calculate()
  await screen.findByText(messages.failed)
  expect(screen.getByText(unavailable.name)).toBeTruthy()
  fireEvent.drop(dropTarget, {
    dataTransfer: { files: [new File(["hello\n"], "hello.txt")] },
  })
  calculate()
  await screen.findByText(helloCid)
})

it("can cancel a calculation and calculate the selected folder", async () => {
  const { container } = render(
    <CidCalculator language="en" messages={messages} />
  )
  const inputs =
    container.querySelectorAll<HTMLInputElement>('input[type="file"]')
  const file = new File(["hello\n"], "hello.txt")
  Object.defineProperty(file, "webkitRelativePath", { value: "docs/hello.txt" })
  fireEvent.change(inputs[1]!, { target: { files: [file] } })
  expect(screen.getByText("docs")).toBeTruthy()
  calculate()
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  await waitFor(() =>
    expect(screen.getByText(messages.resultEmpty)).toBeTruthy()
  )
  fireEvent.change(screen.getByLabelText(messages.chunkSize), {
    target: { value: "524288" },
  })
  fireEvent.click(screen.getByLabelText(messages.rawLeaves))
  fireEvent.click(screen.getByLabelText(messages.wrap))
  calculate()
  await screen.findByText(/ipfs add --only-hash.*--wrap-with-directory/)
})
