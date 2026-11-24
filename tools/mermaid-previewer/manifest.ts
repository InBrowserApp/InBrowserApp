import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "diagram",
  secondaryCategories: ["developer"],
  icon: "blocks",
  tags: [
    "mermaid",
    "diagram",
    "flowchart",
    "sequence diagram",
    "svg",
    "png",
    "pdf",
    "preview",
  ],
})
