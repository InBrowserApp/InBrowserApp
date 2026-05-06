import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Slider } from "@workspace/ui/components/ui/slider"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import {
  BLEND_MODES,
  COLOR_SPACES,
  RADIAL_SHAPES,
  RADIAL_SIZES,
} from "../core/gradient"

import type {
  BlendMode,
  ColorSpace,
  GradientLayer,
  GradientType,
  RadialShape,
  RadialSize,
} from "../core/gradient"
import type { CssGradientGeneratorMessages } from "../types"

type LayerEditorCardProps = Readonly<{
  layer: GradientLayer
  messages: CssGradientGeneratorMessages
  onAngleChange: (value: number) => void
  onBlendModeChange: (value: BlendMode) => void
  onCenterXChange: (value: number) => void
  onCenterYChange: (value: number) => void
  onColorSpaceChange: (value: ColorSpace) => void
  onRadialShapeChange: (value: RadialShape) => void
  onRadialSizeChange: (value: RadialSize) => void
  onTypeChange: (value: GradientType) => void
}>

function SliderField({
  label,
  max,
  onChange,
  suffix,
  value,
}: Readonly<{
  label: string
  max: number
  onChange: (value: number) => void
  suffix: string
  value: number
}>) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2 text-sm font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <Slider
        max={max}
        min={0}
        onValueChange={(values) => {
          onChange(values[0] ?? value)
        }}
        value={[value]}
      />
    </div>
  )
}

function SelectField({
  label,
  onChange,
  options,
  value,
}: Readonly<{
  label: string
  onChange: (value: string) => void
  options: readonly { label: string; value: string }[]
  value: string
}>) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-medium">{label}</div>
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function LayerEditorCard({
  layer,
  messages,
  onAngleChange,
  onBlendModeChange,
  onCenterXChange,
  onCenterYChange,
  onColorSpaceChange,
  onRadialShapeChange,
  onRadialSizeChange,
  onTypeChange,
}: LayerEditorCardProps) {
  const showAngle = layer.type !== "radial"
  const showCenter = layer.type !== "linear"
  const showRadialControls = layer.type === "radial"

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.settingsTitle}</CardTitle>
        <CardDescription>{messages.settingsSubtitle}</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-5">
        <div className="grid gap-2">
          <div className="text-sm font-medium">{messages.gradientType}</div>
          <ToggleGroup
            className="w-full flex-wrap"
            onValueChange={(value) => {
              if (value) {
                onTypeChange(value as GradientType)
              }
            }}
            size="sm"
            type="single"
            value={layer.type}
            variant="outline"
          >
            {(["linear", "radial", "conic"] as const).map((type) => (
              <ToggleGroupItem className="flex-1" key={type} value={type}>
                {messages.type[type]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {showAngle ? (
          <SliderField
            label={messages.angle}
            max={360}
            onChange={onAngleChange}
            suffix="°"
            value={layer.angle}
          />
        ) : null}

        {showCenter ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <SliderField
              label={messages.centerX}
              max={100}
              onChange={onCenterXChange}
              suffix="%"
              value={layer.centerX}
            />
            <SliderField
              label={messages.centerY}
              max={100}
              onChange={onCenterYChange}
              suffix="%"
              value={layer.centerY}
            />
          </div>
        ) : null}

        {showRadialControls ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label={messages.shapeLabel}
              onChange={(value) => {
                onRadialShapeChange(value as RadialShape)
              }}
              options={RADIAL_SHAPES.map((value) => ({
                label: messages.shape[value],
                value,
              }))}
              value={layer.radialShape}
            />
            <SelectField
              label={messages.sizeLabel}
              onChange={(value) => {
                onRadialSizeChange(value as RadialSize)
              }}
              options={RADIAL_SIZES.map((value) => ({
                label: messages.size[value],
                value,
              }))}
              value={layer.radialSize}
            />
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            label={messages.colorSpaceLabel}
            onChange={(value) => {
              onColorSpaceChange(value as ColorSpace)
            }}
            options={COLOR_SPACES.map((value) => ({
              label: messages.colorSpace[value],
              value,
            }))}
            value={layer.colorSpace}
          />

          <div className="grid gap-2">
            <div className="text-sm font-medium">{messages.blendMode}</div>
            <Select
              onValueChange={(value) => {
                onBlendModeChange(value as BlendMode)
              }}
              value={layer.blendMode}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{messages.blendMode}</SelectLabel>
                  {BLEND_MODES.slice(0, 8).map((value) => (
                    <SelectItem key={value} value={value}>
                      {messages.blend[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>{messages.blendMode}</SelectLabel>
                  {BLEND_MODES.slice(8).map((value) => (
                    <SelectItem key={value} value={value}>
                      {messages.blend[value]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { LayerEditorCard }
