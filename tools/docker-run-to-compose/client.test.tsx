import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import DockerRunToComposeClient from "./client"
import { DEFAULT_DOCKER_RUN_INPUT, STORAGE_KEYS } from "./client/constants"

const messages = {
  meta: {
    name: "Docker Run to Compose",
    description: "Convert docker run commands into a docker-compose.yml file.",
  },
  dockerRunLabel: "Docker Run Commands",
  dockerRunDescription:
    "Paste docker run commands directly or import a .txt or .sh file from this device.",
  dockerRunPlaceholder: "Paste docker run commands here...",
  composeLabel: "docker-compose.yml",
  composeDescription:
    "Compose output updates as soon as the input contains a valid docker run command.",
  composeEmptyDescription:
    "Paste a valid docker run command on the left to preview the generated Compose file here.",
  invalidDockerRunLabel: "No valid docker run commands found",
  warningsTitle: "Conversion warnings",
  useSampleLabel: "Use sample",
  clearLabel: "Clear",
  importFromFileLabel: "Import from file",
  copyComposeLabel: "Copy Compose",
  copiedLabel: "Copied",
  downloadComposeLabel: "Download Compose",
} as const

beforeEach(() => {
  vi.stubGlobal(
    "URL",
    Object.assign({}, globalThis.URL, {
      createObjectURL: vi.fn(() => "blob:converted-compose"),
      revokeObjectURL: vi.fn(),
    })
  )

  window.localStorage.clear()
})

afterEach(cleanup)

function getInput() {
  return screen.getByRole("textbox", {
    name: messages.dockerRunLabel,
  }) as HTMLTextAreaElement
}

function getOutput() {
  return screen.getByRole("region", {
    name: messages.composeLabel,
  })
}

function getFileInput() {
  return document.querySelector('input[type="file"]') as HTMLInputElement
}

describe("DockerRunToComposeClient", () => {
  test("renders the sample input and compose output", () => {
    render(<DockerRunToComposeClient messages={messages} />)

    const input = getInput()
    const output = getOutput()

    expect(screen.getByText(messages.dockerRunDescription)).toBeTruthy()
    expect(screen.getByText(messages.composeDescription)).toBeTruthy()
    expect(input.value).toBe(DEFAULT_DOCKER_RUN_INPUT)
    expect(output.textContent).toContain("services:")
    expect(output.textContent).toContain("api:")
    expect(output.textContent).toContain("redis:")
    expect(URL.createObjectURL).toHaveBeenCalled()
  })

  test("shows conversion warnings above the output", () => {
    render(<DockerRunToComposeClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        value: "docker run nginx:latest && docker run redis:7-alpine",
      },
    })

    const warningAlert = screen.getByRole("alert")
    expect(within(warningAlert).getByText(messages.warningsTitle)).toBeTruthy()
    expect(warningAlert.textContent).toContain("Found shell operators")
    expect(getOutput().textContent).toContain("nginx:")
    expect(getOutput().textContent).toContain("redis:")
  })

  test("shows an error state when no valid docker run command is found", () => {
    render(<DockerRunToComposeClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: 'echo "hello"' },
    })

    const output = getOutput()
    const outputAlert = within(output).getByRole("alert")

    expect(outputAlert.textContent).toContain(messages.invalidDockerRunLabel)
    expect(
      screen.getByRole("button", { name: messages.copyComposeLabel })
    ).toHaveProperty("disabled", true)
    expect(
      screen.getByRole("button", { name: messages.downloadComposeLabel })
    ).toHaveProperty("disabled", true)
  })

  test("imports commands from a selected file", async () => {
    render(<DockerRunToComposeClient messages={messages} />)

    const file = new File(
      ["docker run --name web -p 80:80 nginx:latest"],
      "demo.sh",
      {
        type: "text/plain",
      }
    )

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await waitFor(() => {
      expect(getInput().value).toBe(
        "docker run --name web -p 80:80 nginx:latest"
      )
    })

    expect(getOutput().textContent).toContain("web:")
    expect(getOutput().textContent).toContain("image: nginx:latest")
  })

  test("can clear the input and then restore the sample", () => {
    render(<DockerRunToComposeClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: messages.clearLabel }))

    expect(getInput().value).toBe("")
    expect(getOutput().textContent).toContain(messages.composeEmptyDescription)

    fireEvent.click(
      screen.getByRole("button", { name: messages.useSampleLabel })
    )

    expect(getInput().value).toBe(DEFAULT_DOCKER_RUN_INPUT)
    expect(getOutput().textContent).toContain("services:")
  })

  test("restores the last stored input from local storage", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.inputText,
      "docker run --name db -p 5432:5432 postgres:16"
    )

    render(<DockerRunToComposeClient messages={messages} />)

    expect(getInput().value).toBe(
      "docker run --name db -p 5432:5432 postgres:16"
    )
    expect(getOutput().textContent).toContain("db:")
  })

  test("persists edits to local storage", () => {
    render(<DockerRunToComposeClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: { value: "docker run hello-world" },
    })

    expect(window.localStorage.getItem(STORAGE_KEYS.inputText)).toBe(
      "docker run hello-world"
    )
  })
})
