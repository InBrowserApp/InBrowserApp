import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "image",
  secondaryCategories: ["geo"],
  icon: "image",
  tags: ["image", "exif", "metadata", "photo", "camera", "gps", "privacy"],
})
