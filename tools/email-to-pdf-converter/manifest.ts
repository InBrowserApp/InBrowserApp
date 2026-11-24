import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["pdf"],
  icon: "mail",
  tags: ["email", "eml", "emlx", "msg", "pdf", "converter"],
})
