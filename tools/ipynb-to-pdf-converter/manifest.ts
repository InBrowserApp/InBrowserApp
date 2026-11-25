import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "pdf",
  secondaryCategories: ["document"],
  icon: "file-text",
  tags: ["ipynb", "jupyter", "notebook", "pdf", "converter", "print", "colab"],
})
