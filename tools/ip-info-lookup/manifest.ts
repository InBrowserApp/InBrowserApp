import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "network",
  secondaryCategories: ["geo"],
  icon: "network",
  tags: ["ip", "dns", "domain", "geolocation", "isp", "asn"],
})
