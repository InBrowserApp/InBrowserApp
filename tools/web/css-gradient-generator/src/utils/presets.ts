import type { GradientLayerSeed } from '../types'

export type GradientPreset = {
  id: string
  layers: GradientLayerSeed[]
}

export const gradientPresets: GradientPreset[] = [
  {
    id: 'aurora',
    layers: [
      {
        type: 'linear',
        angle: 135,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'oklch',
        blendMode: 'normal',
        stops: [
          { color: '#0B1020FF', position: 0 },
          { color: '#2563EBFF', position: 42 },
          { color: '#22D3EEFF', position: 100 },
        ],
      },
      {
        type: 'radial',
        angle: 0,
        centerX: 22,
        centerY: 18,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'oklch',
        blendMode: 'screen',
        stops: [
          { color: '#A855F7CC', position: 0 },
          { color: '#A855F700', position: 62 },
          { color: '#00000000', position: 100 },
        ],
      },
    ],
  },
  {
    id: 'sunset',
    layers: [
      {
        type: 'linear',
        angle: 120,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'srgb',
        blendMode: 'normal',
        stops: [
          { color: '#FDBA74FF', position: 0 },
          { color: '#FB7185FF', position: 48 },
          { color: '#9333EAFF', position: 100 },
        ],
      },
      {
        type: 'radial',
        angle: 0,
        centerX: 78,
        centerY: 18,
        radialShape: 'ellipse',
        radialSize: 'farthest-corner',
        colorSpace: 'srgb',
        blendMode: 'screen',
        stops: [
          { color: '#FDE68AFF', position: 0 },
          { color: '#FDE68A00', position: 65 },
          { color: '#FDE68A00', position: 100 },
        ],
      },
    ],
  },
  {
    id: 'ocean',
    layers: [
      {
        type: 'radial',
        angle: 0,
        centerX: 50,
        centerY: 30,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'oklch',
        blendMode: 'normal',
        stops: [
          { color: '#0F172AFF', position: 0 },
          { color: '#1E3A8AFF', position: 58 },
          { color: '#0EA5E9FF', position: 100 },
        ],
      },
      {
        type: 'linear',
        angle: 160,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'srgb',
        blendMode: 'soft-light',
        stops: [
          { color: '#38BDF866', position: 0 },
          { color: '#0EA5E900', position: 62 },
          { color: '#0EA5E900', position: 100 },
        ],
      },
    ],
  },
  {
    id: 'neon',
    layers: [
      {
        type: 'conic',
        angle: 10,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'oklch',
        blendMode: 'normal',
        stops: [
          { color: '#22D3EEFF', position: 0 },
          { color: '#A855F7FF', position: 38 },
          { color: '#F43F5EFF', position: 70 },
          { color: '#22D3EEFF', position: 100 },
        ],
      },
      {
        type: 'radial',
        angle: 0,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'closest-side',
        colorSpace: 'srgb',
        blendMode: 'screen',
        stops: [
          { color: '#00000000', position: 0 },
          { color: '#0F172AFF', position: 100 },
        ],
      },
    ],
  },
  {
    id: 'dawn',
    layers: [
      {
        type: 'radial',
        angle: 0,
        centerX: 50,
        centerY: 40,
        radialShape: 'ellipse',
        radialSize: 'farthest-corner',
        colorSpace: 'srgb',
        blendMode: 'normal',
        stops: [
          { color: '#FEF3C7FF', position: 0 },
          { color: '#FBCFE8FF', position: 48 },
          { color: '#93C5FDFF', position: 100 },
        ],
      },
    ],
  },
  {
    id: 'citrus',
    layers: [
      {
        type: 'linear',
        angle: 110,
        centerX: 50,
        centerY: 50,
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        colorSpace: 'srgb',
        blendMode: 'normal',
        stops: [
          { color: '#FDE047FF', position: 0 },
          { color: '#84CC16FF', position: 55 },
          { color: '#22D3EEFF', position: 100 },
        ],
      },
      {
        type: 'radial',
        angle: 0,
        centerX: 82,
        centerY: 22,
        radialShape: 'circle',
        radialSize: 'closest-side',
        colorSpace: 'srgb',
        blendMode: 'overlay',
        stops: [
          { color: '#F59E0B88', position: 0 },
          { color: '#F59E0B00', position: 68 },
          { color: '#F59E0B00', position: 100 },
        ],
      },
    ],
  },
]
