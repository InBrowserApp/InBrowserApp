import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "geo",
  secondaryCategories: ["json"],
  icon: "file-json-2",
  tags: ["kml", "geojson", "gis", "converter", "google-earth", "map"],
})
