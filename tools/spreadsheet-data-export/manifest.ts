import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "spreadsheet",
  secondaryCategories: ["json"],
  icon: "file-text",
  tags: [
    "xlsx",
    "xlsm",
    "xltx",
    "xltm",
    "excel",
    "spreadsheet",
    "csv",
    "tsv",
    "json",
    "markdown",
    "export",
    "local",
  ],
})
