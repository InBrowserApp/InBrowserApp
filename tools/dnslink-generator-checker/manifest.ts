import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "ipfs",
  secondaryCategories: ["network"],
  icon: "link-2",
  tags: ["dnslink", "_dnslink", "ipfs", "ipns", "dns", "txt", "domain"],
})
