import { watermarkLayout } from "../core/layout"
import { useObjectUrl } from "./use-watermark"
import type { PageGeometry, PreparedLayer } from "../types"

function WatermarkArt({
  item,
  geometry,
  height,
}: Readonly<{ item: PreparedLayer; geometry: PageGeometry; height: number }>) {
  const url = useObjectUrl(item.mark?.blob ?? null)
  if (!url || !item.mark) return null
  const { options } = item.layer
  const layout = watermarkLayout(
    geometry,
    item.mark.width / item.mark.height,
    options
  )
  return (
    <g data-watermark-layer={item.layer.id}>
      {layout.centers.map((c, i) => (
        <image
          key={i}
          href={url}
          width={layout.markWidth}
          height={layout.markHeight}
          x={-layout.markWidth / 2}
          y={-layout.markHeight / 2}
          transform={`translate(${c.x} ${height - c.y}) rotate(${options.rotation})`}
          opacity={options.opacity / 100}
        />
      ))}
    </g>
  )
}

export { WatermarkArt }
