import { TextFormatConverter } from "@workspace/ui/components/tool/text-format-converter"
import { convert } from "./core/convert"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const formats = [
  {
    name: "WKT",
    extension: "wkt",
    accept: ".wkt,.txt",
    example: "LINESTRING (139.700 35.689, 139.740 35.676, 139.767 35.681)",
  },
  {
    name: "GeoJSON",
    extension: "geojson",
    accept: ".geojson,.json",
    example: JSON.stringify(
      { type: "Point", coordinates: [139.767, 35.681] },
      null,
      2
    ),
  },
] as const

export default function Client({ messages }: Readonly<{ messages: Messages }>) {
  return (
    <TextFormatConverter
      formats={formats}
      convert={convert}
      messages={messages}
    />
  )
}
