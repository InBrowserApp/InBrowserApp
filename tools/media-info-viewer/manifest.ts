import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "video",
  secondaryCategories: ["audio"],
  icon: "file-text",
  tags: [
    "audio",
    "video",
    "media",
    "metadata",
    "codec",
    "bitrate",
    "mediainfo",
  ],
})
