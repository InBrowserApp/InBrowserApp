import { afterEach, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { DocumentWorkspace } from "./document-workspace"

const messages = {
  open: "Open",
  replace: "Replace",
  clear: "Close",
  reader: "Reader",
  privacy: "Local only",
  focus: "Focus",
  exitFocus: "Exit focus",
  releaseFile: "Release file",
}
const file = new File([new Uint8Array(1500)], "sample.pdf")
afterEach(cleanup)

test("keeps the document mounted through focus mode and restores scroll locking", () => {
  document.body.style.overflow = "auto"
  const props = {
    tool: "sample",
    file,
    onFile: vi.fn(),
    accept: ".pdf",
    active: true,
    messages,
  }
  const { rerender, unmount } = render(
    <DocumentWorkspace {...props}>
      <canvas data-testid="canvas" />
    </DocumentWorkspace>
  )
  const canvas = screen.getByTestId("canvas")
  expect(screen.getByText(/1.5 kB/)).toBeTruthy()
  fireEvent.click(screen.getByLabelText("Focus"))
  expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true")
  expect(document.body.style.overflow).toBe("hidden")
  expect(screen.getByTestId("canvas")).toBe(canvas)
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { cancelable: true })
  )
  expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull()
  expect(document.body.style.overflow).toBe("auto")
  expect(document.activeElement).toBe(screen.getByLabelText("Focus"))
  fireEvent.click(screen.getByLabelText("Focus"))
  rerender(
    <DocumentWorkspace {...props} file={null} active={false}>
      <canvas data-testid="canvas" />
    </DocumentWorkspace>
  )
  expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull()
  expect(document.body.style.overflow).toBe("auto")
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Open" })
  )
  rerender(
    <DocumentWorkspace {...props}>
      <canvas data-testid="canvas" />
    </DocumentWorkspace>
  )
  fireEvent.click(screen.getByLabelText("Focus"))
  unmount()
  expect(document.body.style.overflow).toBe("auto")
})

test("keeps file drag feedback across nested targets and clears it on drop", () => {
  const onFile = vi.fn()
  const { container } = render(
    <DocumentWorkspace
      tool="sample"
      file={null}
      onFile={onFile}
      accept=".pdf"
      active={false}
      messages={messages}
    >
      <p>Drop target</p>
    </DocumentWorkspace>
  )
  const section = container.querySelector("section")!
  const dataTransfer = { types: ["Files"], files: [file] }
  fireEvent.dragEnter(section, { dataTransfer })
  fireEvent.dragEnter(screen.getByText("Drop target"), { dataTransfer })
  fireEvent.dragLeave(screen.getByText("Drop target"), { dataTransfer })
  expect(screen.getByText("Release file")).toBeTruthy()
  fireEvent.drop(section, { dataTransfer })
  expect(onFile).toHaveBeenCalledExactlyOnceWith(file)
  expect(screen.queryByText("Release file")).toBeNull()
  fireEvent.dragEnter(section, { dataTransfer })
  fireEvent.dragLeave(section, { dataTransfer })
  expect(screen.queryByText("Release file")).toBeNull()
})
