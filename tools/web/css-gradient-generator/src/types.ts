export type GradientType = 'linear' | 'radial' | 'conic'
export type ColorSpace = 'srgb' | 'oklch'
export type RadialShape = 'circle' | 'ellipse'
export type RadialSize = 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'
export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'

export type ColorFormat = 'hex' | 'rgba'

export type GradientStop = {
  id: string
  color: string
  position: number
}

export type GradientLayer = {
  id: string
  type: GradientType
  angle: number
  centerX: number
  centerY: number
  radialShape: RadialShape
  radialSize: RadialSize
  colorSpace: ColorSpace
  blendMode: BlendMode
  stops: GradientStop[]
}

export type GradientStopSeed = Omit<GradientStop, 'id'>
export type GradientLayerSeed = Omit<GradientLayer, 'id' | 'stops'> & {
  stops: GradientStopSeed[]
}
