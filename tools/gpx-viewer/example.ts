const climb = [
  [139.2708, 35.6317, 202],
  [139.2681, 35.6322, 228],
  [139.2671, 35.6347, 281],
  [139.2649, 35.6345, 330],
  [139.264, 35.6327, 388],
  [139.2618, 35.6331, 410],
  [139.2602, 35.6317, 447],
  [139.2584, 35.6308, 492],
  [139.2557, 35.6304, 516],
  [139.2539, 35.6293, 566],
  [139.2526, 35.6253, 599],
  [139.2506, 35.6259, 553],
  [139.247, 35.6263, 515],
  [139.244, 35.6282, 544],
  [139.241, 35.6295, 571],
]
const example = `<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="InBrowser.App">
  <wpt lat="35.6317" lon="139.2708"><name>Kiyotaki</name></wpt>
  <wpt lat="35.6253" lon="139.2526"><name>Mount Takao</name></wpt>
  <trk><name>Mount Takao hike</name><trkseg>${climb.map(([lon, lat, elevation]) => `<trkpt lat="${lat}" lon="${lon}"><ele>${elevation}</ele></trkpt>`).join("")}</trkseg></trk>
</gpx>`

export { example }
