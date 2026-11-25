import { TextFormatConverter } from "@workspace/ui/components/tool/text-format-converter"
import { convertGpx, readGpxFile } from "./convert"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const formats = [
  {
    name: "GPX",
    extension: "gpx",
    accept: ".gpx",
    example: `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="InBrowser.App" xmlns="http://www.topografix.com/GPX/1/1">
  <wpt lat="37.809" lon="-122.410"><name>Viewpoint</name></wpt>
  <rte>
    <name>Planned route</name>
    <rtept lat="37.808" lon="-122.422"/>
    <rtept lat="37.803" lon="-122.437"/>
  </rte>
  <trk>
    <name>Recorded walk</name>
    <trkseg>
      <trkpt lat="37.803" lon="-122.437"><ele>23</ele></trkpt>
      <trkpt lat="37.800" lon="-122.450"><ele>31</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`,
  },
  { name: "GeoJSON", extension: "geojson", accept: ".geojson,.json" },
] as const

export default function Client({ messages }: Readonly<{ messages: Messages }>) {
  return (
    <TextFormatConverter
      oneWay
      formats={formats}
      convert={convertGpx}
      readFile={readGpxFile}
      messages={messages}
    />
  )
}
