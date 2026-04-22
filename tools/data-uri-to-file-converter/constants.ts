const STORAGE_KEYS = {
  input: "tools:data-uri-to-file-converter:input",
} as const

const DEFAULT_SAMPLE_INPUT =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%27240%27%20height%3D%27120%27%20viewBox%3D%270%200%20240%20120%27%3E%3Crect%20width%3D%27240%27%20height%3D%27120%27%20rx%3D%2724%27%20fill%3D%27%230f766e%27/%3E%3Ctext%20x%3D%2750%25%27%20y%3D%2750%25%27%20dominant-baseline%3D%27middle%27%20text-anchor%3D%27middle%27%20fill%3D%27white%27%20font-size%3D%2728%27%20font-family%3D%27Arial%2Csans-serif%27%3EData%20URI%3C/text%3E%3C/svg%3E"

export { DEFAULT_SAMPLE_INPUT, STORAGE_KEYS }
