// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { gzipSync, zipSync } from "fflate"
import { afterEach, expect, test } from "vitest"
import Client from "./client"
import { example } from "./example"
import messages from "./messages/en.json"

const exampleBytes = new TextEncoder().encode(example)

afterEach(cleanup)

function renderViewer() {
  return render(<Client messages={messages} language="en" />)
}

const click = (name: string) =>
  fireEvent.click(screen.getByRole("button", { name }))
const input = (name: string, value: string) =>
  fireEvent.change(screen.getByLabelText(name), { target: { value } })
const picker = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[type="file"]')!
function chooseFile(
  container: HTMLElement,
  name: string,
  arrayBuffer: () => Promise<ArrayBuffer>
) {
  fireEvent.change(picker(container), {
    target: { files: [{ name, arrayBuffer }] },
  })
}
const bytes = (value: Uint8Array) => async () => Uint8Array.from(value).buffer

test("loads the sample, shows the weighted counts, and filters without changing report totals", () => {
  renderViewer()
  click(messages.example)
  expect(screen.getByText("180")).toBeTruthy()
  expect(screen.getByText("164")).toBeTruthy()
  expect(screen.getByText("16")).toBeTruthy()
  expect(screen.getByText("4 of 4 records")).toBeTruthy()
  input(messages.filter, "192.0.2.55")
  expect(screen.getByText("2 of 4 records")).toBeTruthy()
  fireEvent.click(screen.getByText(messages.rawAuth))
  expect(screen.getByText("example.net")).toBeTruthy()
  expect(screen.getByText("provider")).toBeTruthy()
  expect(screen.getByText("mailing_list")).toBeTruthy()
  expect(screen.getByText("180")).toBeTruthy()
  input(messages.filter, "NEWS.EXAMPLE")
  expect(screen.getByText("1 of 4 records")).toBeTruthy()
  input(messages.filter, "no-match")
  expect(screen.getByText(messages.noMatches)).toBeTruthy()
})

test("accepts pasted XML and gives the user recoverable feedback", () => {
  renderViewer()
  fireEvent.click(screen.getByText(messages.paste))
  const submit = screen.getByRole("button", { name: messages.view })
  expect((submit as HTMLButtonElement).disabled).toBeTruthy()
  input(messages.xml, "<feedback>")
  click(messages.view)
  expect(screen.getByRole("alert").textContent).toBe(messages.invalidXml)
  const empty =
    "<feedback><report_metadata/><policy_published><domain>example.org</domain></policy_published></feedback>"
  input(messages.xml, empty)
  click(messages.view)
  expect(screen.getByText(messages.noRecords)).toBeTruthy()
})

test("opens compressed attachments and gives feedback on multi-report archives", async () => {
  const { container } = renderViewer()
  chooseFile(container, "report.xml.gz", bytes(gzipSync(exampleBytes)))
  expect(await screen.findByText("Example Mail")).toBeTruthy()
  expect(screen.getByText("report.xml.gz")).toBeTruthy()

  chooseFile(
    container,
    "multi.zip",
    bytes(zipSync({ "a.xml": exampleBytes, "b.xml": exampleBytes }))
  )
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.archiveContents
  )
  chooseFile(container, "broken.xml", async () => {
    throw new Error("read failure")
  })
  expect((await screen.findByRole("alert")).textContent).toBe(
    messages.readError
  )
})

test("new input wins when an earlier attachment completes late", async () => {
  const { container } = renderViewer()
  let resolve!: (data: ArrayBuffer) => void
  let reject!: (error: Error) => void
  chooseFile(
    container,
    "slow.xml",
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  expect(screen.getByRole("status").textContent).toBe(messages.reading)
  chooseFile(
    container,
    "slow-error.xml",
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  click(messages.example)
  await act(async () => {
    resolve(new ArrayBuffer(0))
    reject(new Error("read failure"))
  })
  expect(screen.getByText("Example Mail")).toBeTruthy()
  expect(screen.queryByRole("alert")).toBeNull()
})

test("displays unknown alignment and readable raw results from partial legacy records", () => {
  renderViewer()
  fireEvent.click(screen.getByText(messages.paste))
  input(
    messages.xml,
    `<feedback><report_metadata/><policy_published><domain>example.org</domain></policy_published><record>
    <row><source_ip>192.0.2.19</source_ip><count>4</count><policy_evaluated><spf>fail</spf><reason><type>local_policy</type></reason></policy_evaluated></row>
    <auth_results><dkim/></auth_results></record></feedback>`
  )
  click(messages.view)
  expect(screen.getAllByText(messages.unknown)).toHaveLength(3)
  expect(screen.getByText(messages.reason)).toBeTruthy()
})
