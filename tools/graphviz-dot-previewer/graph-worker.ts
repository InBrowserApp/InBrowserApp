import { instance } from "@viz-js/viz"

type GraphInput = { source: string; engine: string }

type GraphResult = GraphInput & {
  svg?: string
  notes: string[]
}

const renderer = instance()

self.addEventListener("message", async (event: MessageEvent<GraphInput>) => {
  const input = event.data
  try {
    const viz = await renderer
    const result = viz.render(input.source, {
      engine: input.engine,
      format: "svg",
    })
    const response: GraphResult = {
      ...input,
      svg: result.status === "success" ? result.output : undefined,
      notes: result.errors.map(({ message }) => message),
    }
    self.postMessage(response)
  } catch (error) {
    self.postMessage({
      ...input,
      notes: error instanceof Error ? [error.message] : [],
    } satisfies GraphResult)
  }
})

export type { GraphInput, GraphResult }
