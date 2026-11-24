import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "geo",
  secondaryCategories: ["json"],
  icon: "map",
  tags: [
    "geojson",
    "map",
    "gis",
    "viewer",
    "offline",
    "polygon",
    "feature",
    "latitude",
    "longitude",
  ],
})
