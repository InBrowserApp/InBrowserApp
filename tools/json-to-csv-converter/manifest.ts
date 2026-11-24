import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "json",
  secondaryCategories: ["spreadsheet"],
  icon: "file-json-2",
  tags: ["code", "json", "csv", "converter"],
})
