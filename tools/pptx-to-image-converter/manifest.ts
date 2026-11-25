import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "image",
  secondaryCategories: ["document"],
  icon: "file-image",
  tags: [
    "pptx",
    "powerpoint",
    "presentation",
    "slide",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "zip",
  ],
})
