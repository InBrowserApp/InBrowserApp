import { describe, expect, it } from "vitest"
import { load } from "js-yaml"

import { convertDockerRunToCompose } from "./convert-docker-run-to-compose"

describe("docker-run-to-compose-converter", () => {
  it("returns empty output for blank input", () => {
    const result = convertDockerRunToCompose("   ")

    expect(result).toEqual({ output: "", warnings: [] })
  })

  it("converts a docker run command into compose yaml", () => {
    const result = convertDockerRunToCompose(
      "docker run --name api -p 8080:8080 -e NODE_ENV=production -v ./data:/data node:20-alpine node server.js"
    )

    expect(result.error).toBeUndefined()
    expect(load(result.output)).toEqual({
      services: {
        api: {
          image: "node:20-alpine",
          container_name: "api",
          ports: ["8080:8080"],
          environment: ["NODE_ENV=production"],
          volumes: ["./data:/data"],
          command: ["node", "server.js"],
        },
      },
    })
  })

  it("supports multiple docker run commands", () => {
    const result = convertDockerRunToCompose(
      "docker run --name api -p 8080:8080 node:20-alpine\n\n" +
        "docker run redis:7-alpine"
    )

    expect(result.error).toBeUndefined()
    expect(result.output).toContain("api:")
    expect(result.output).toContain("redis:")
  })

  it("adds top-level networks and volumes when named resources are used", () => {
    const result = convertDockerRunToCompose(
      "docker run --name api --network appnet -v data-volume:/var/lib/data nginx:latest"
    )

    expect(result.output).toContain("networks:")
    expect(result.output).toContain("appnet:")
    expect(result.output).toContain("volumes:")
    expect(result.output).toContain("data-volume:")
  })

  it("collects warnings for shell operators and invalid tokens", () => {
    const splitResult = convertDockerRunToCompose(
      "docker run nginx:latest && docker run redis:7-alpine"
    )

    expect(splitResult.warnings.join(" ")).toContain("Found shell operators")
    expect(splitResult.output).toContain("nginx:")
    expect(splitResult.output).toContain("redis:")

    const errorResult = convertDockerRunToCompose('docker run "nginx')
    expect(errorResult.warnings).toContain(
      "Unclosed quote detected in docker run input."
    )
    expect(errorResult.error).toBe("No valid docker run commands found.")
  })

  it("returns an error when no docker run command is found", () => {
    const result = convertDockerRunToCompose('echo "hello"')

    expect(result.error).toBeTruthy()
  })
})
