import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "geo",
  secondaryCategories: ["json"],
  icon: "braces",
  tags: [
    "wkt",
    "well-known-text",
    "geojson",
    "gis",
    "geometry",
    "converter",
    "postgis",
  ],
})
