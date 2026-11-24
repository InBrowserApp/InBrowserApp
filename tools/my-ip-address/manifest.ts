import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "network",
  secondaryCategories: ["geo"],
  icon: "network",
  tags: ["ip", "ipv4", "ipv6", "webrtc", "geolocation", "isp"],
})
