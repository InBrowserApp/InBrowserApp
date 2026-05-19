const DEMO_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="56" fill="url(#g)" />
  <path
    d="M64 80 h24 v96 h-24 z M104 80 h64 a32 32 0 0 1 0 64 h-40 v32 h-24 z M128 100 v24 h36 a12 12 0 0 0 0 -24 z M184 80 h24 v96 h-24 z"
    fill="#ffffff"
  />
</svg>
`

const DEMO_ICON_MIME = "image/svg+xml"

function createDemoIconFile(filename: string): File {
  const blob = new Blob([DEMO_ICON_SVG], { type: DEMO_ICON_MIME })
  return new File([blob], filename, { type: DEMO_ICON_MIME })
}

export { createDemoIconFile }
