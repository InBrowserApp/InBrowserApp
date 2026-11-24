import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "video",
  secondaryCategories: ["image"],
  icon: "film",
  tags: [
    "video",
    "frame",
    "screenshot",
    "timestamp",
    "interval",
    "mp4",
    "webm",
    "jpg",
    "png",
    "zip",
  ],
})
