import { useEffect, useRef, useState } from "react"
import { feature } from "topojson-client"
import atlas from "world-atlas/land-110m.json"
import { Button } from "@workspace/ui/components/ui/button"
import { Maximize2, ZoomIn, ZoomOut } from "@workspace/ui/icons"
import type { Feature, Geometry } from "geojson"
import type { GeoJSON, Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import "../../styles/offline-map.css"

type MapMessages = Readonly<{
  map: string
  fit: string
  zoomIn: string
  zoomOut: string
}>

type MapState = Readonly<{ leaflet: typeof import("leaflet"); map: LeafletMap }>

const worldLand = feature(
  atlas as unknown as Parameters<typeof feature>[0],
  "land"
)
const worldCenter: [number, number] = [24, 0]
const dataStyle = {
  color: "var(--offline-map-accent)",
  fillColor: "var(--offline-map-accent)",
  fillOpacity: 0.24,
  weight: 3,
}

function renderable(geometry: Geometry): Geometry | null {
  if (geometry.type === "GeometryCollection") {
    const geometries = geometry.geometries.flatMap((child) => {
      const valid = renderable(child)
      return valid ? [valid] : []
    })
    return geometries.length ? { ...geometry, geometries } : null
  }
  return geometry.coordinates.length ? geometry : null
}

function fit(map: LeafletMap, layer: GeoJSON | null) {
  const bounds = layer?.getBounds()
  if (bounds?.isValid())
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 })
  else map.setView(worldCenter, 1)
}

function OfflineMap({
  messages,
  features,
  selected,
  onSelect,
  highlight,
  labels,
}: Readonly<{
  messages: MapMessages
  features: readonly Feature<Geometry | null>[]
  selected?: number
  onSelect?: (index: number) => void
  highlight?: readonly [number, number]
  labels?: ReadonlyMap<number, string>
}>) {
  const container = useRef<HTMLDivElement>(null)
  const dataLayer = useRef<GeoJSON | null>(null)
  const [state, setState] = useState<MapState>()

  useEffect(() => {
    const element = container.current
    if (!element) return

    let disposed = false
    let map: LeafletMap | undefined
    void import("leaflet").then((leaflet) => {
      if (disposed) return
      map = leaflet
        .map(element, {
          zoomControl: false,
          // A new file can remove the map before Leaflet’s zoom transition finishes.
          zoomAnimation: false,
          attributionControl: true,
          minZoom: 1,
          maxZoom: 20,
          scrollWheelZoom: false,
        })
        .setView(worldCenter, 1)
      map.attributionControl.setPrefix(false)
      map.attributionControl.addAttribution("Natural Earth")
      leaflet.control.scale({ imperial: false }).addTo(map)
      leaflet
        .geoJSON(worldLand, {
          style: {
            interactive: false,
            color: "var(--offline-map-border)",
            fillColor: "var(--offline-map-land)",
            weight: 1,
            fillOpacity: 1,
          },
        })
        .addTo(map)
      setState({ leaflet, map })
    })

    return () => {
      disposed = true
      map?.remove()
    }
  }, [])

  useEffect(() => {
    if (!state) return
    const { leaflet, map } = state
    type MapFeature = Feature<Geometry, { index: number }>
    const shapes: MapFeature[] = []
    const points: MapFeature[] = []
    features.forEach(({ geometry }, index) => {
      const shape = geometry && renderable(geometry)
      if (!shape) return
      const layer =
        shape.type === "Point" || shape.type === "MultiPoint" ? points : shapes
      layer.push({ type: "Feature", geometry: shape, properties: { index } })
    })
    // Keep point markers clickable where a path crosses them.
    const layer = leaflet.geoJSON<{ index: number }>([...shapes, ...points], {
      style: dataStyle,
      pointToLayer: (_, point) =>
        leaflet.circleMarker(point, {
          ...dataStyle,
          radius: 6,
          fillOpacity: 0.82,
        }),
      onEachFeature({ properties: { index } }, item) {
        if (onSelect) item.on("click", () => onSelect(index))
        const label = labels?.get(index)
        if (label) {
          const tooltip = document.createElement("span")
          tooltip.dir = "auto"
          tooltip.textContent = label
          item.bindTooltip(tooltip)
        }
      },
    })
    layer.addTo(map)
    dataLayer.current = layer
    fit(map, layer)
    return () => {
      layer.remove()
    }
  }, [features, labels, onSelect, state])

  useEffect(() => {
    if (!state) return
    const { leaflet, map } = state
    const geometry =
      selected === undefined ? undefined : features[selected]?.geometry
    const active = geometry && renderable(geometry)
    if (!active) return
    const style = {
      ...dataStyle,
      color: "var(--offline-map-highlight)",
      weight: 5,
      interactive: false,
    }
    const layer = leaflet
      .geoJSON(active, {
        style,
        pointToLayer: (_, point) =>
          leaflet.circleMarker(point, { ...style, radius: 8 }),
      })
      .addTo(map)
    return () => {
      layer.remove()
    }
  }, [features, selected, state])

  useEffect(() => {
    if (!state || !highlight) return
    const [longitude, latitude] = highlight
    const marker = state.leaflet
      .circleMarker([latitude, longitude], {
        color: "var(--offline-map-highlight)",
        fillColor: "var(--offline-map-accent)",
        fillOpacity: 1,
        radius: 7,
        weight: 3,
        interactive: false,
      })
      .addTo(state.map)
    return () => {
      marker.remove()
    }
  }, [highlight, state])

  return (
    <div
      className="offline-map relative isolate overflow-hidden rounded-lg border"
      dir="ltr"
    >
      <div
        ref={container}
        role="region"
        aria-label={messages.map}
        className="h-72 sm:h-96"
      />
      <div className="absolute end-3 top-3 z-[500] grid gap-1 rounded-md bg-background/95 p-1 shadow-sm">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={messages.zoomIn}
          title={messages.zoomIn}
          onClick={() => state?.map.zoomIn()}
          disabled={!state}
        >
          <ZoomIn aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={messages.zoomOut}
          title={messages.zoomOut}
          onClick={() => state?.map.zoomOut()}
          disabled={!state}
        >
          <ZoomOut aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={messages.fit}
          title={messages.fit}
          onClick={() => state && fit(state.map, dataLayer.current)}
          disabled={!state}
        >
          <Maximize2 aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export { OfflineMap }
