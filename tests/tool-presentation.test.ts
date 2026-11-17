import { describe, expect, test } from "vitest"
import type { ToolDefinition } from "../packages/tool-sdk/src/types"
import { toolIconMap } from "../packages/ui/src/components/tool/tool-icon"

const manifests = import.meta.glob<{ tool: ToolDefinition }>(
  "../tools/*/manifest.ts"
)

describe("tool discovery icons", () => {
  test("discovers tool manifests", () => {
    expect(Object.keys(manifests).length).toBeGreaterThan(0)
  })

  test.each(Object.entries(manifests))(
    "%s has an explicit icon mapping instead of the runtime fallback",
    async (_path, load) => {
      const { tool } = await load()
      expect({
        icon: tool.icon,
        mapped: Object.hasOwn(toolIconMap, tool.icon),
      }).toEqual({ icon: tool.icon, mapped: true })
    }
  )
})
