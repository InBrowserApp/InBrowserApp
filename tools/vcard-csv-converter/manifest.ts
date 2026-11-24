import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "document",
  secondaryCategories: ["spreadsheet"],
  icon: "arrow-left-right",
  tags: ["vcard", "vcf", "csv", "contacts", "address book", "converter"],
})
