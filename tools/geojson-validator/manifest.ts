import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "geo",
  secondaryCategories: ["json"],
  icon: "file-check",
  tags: [
    "geojson",
    "geojsonlint",
    "validator",
    "validation",
    "json",
    "gis",
    "coordinates",
    "rfc-7946",
  ],
})
