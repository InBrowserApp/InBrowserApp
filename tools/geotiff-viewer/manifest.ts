import { defineTool } from "@workspace/tool-sdk"

export const tool = defineTool({
  category: "geo",
  secondaryCategories: ["image"],
  icon: "image",
  tags: [
    "geotiff",
    "tiff",
    "raster",
    "gis",
    "viewer",
    "cog",
    "elevation",
    "crs",
  ],
})
