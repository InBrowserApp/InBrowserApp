import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import { EditableField } from "./editable-field"
import { KeywordField } from "./keyword-field"

import type { ColorConverterMessages } from "./types"

type FormatsCardProps = Readonly<{
  messages: ColorConverterMessages
  values: {
    hex: string
    rgb: string
    hsl: string
    hsv: string
    hwb: string
    lab: string
    lch: string
    cmyk: string
    keyword: string
  }
  onCmykCommit: (value: string) => boolean
  onHexCommit: (value: string) => boolean
  onHslCommit: (value: string) => boolean
  onHsvCommit: (value: string) => boolean
  onHwbCommit: (value: string) => boolean
  onKeywordCommit: (value: string) => boolean
  onLabCommit: (value: string) => boolean
  onLchCommit: (value: string) => boolean
  onRgbCommit: (value: string) => boolean
}>

export function FormatsCard({
  messages,
  values,
  onCmykCommit,
  onHexCommit,
  onHslCommit,
  onHsvCommit,
  onHwbCommit,
  onKeywordCommit,
  onLabCommit,
  onLchCommit,
  onRgbCommit,
}: FormatsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.resultsTitle}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="grid gap-4 lg:grid-cols-2">
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.hexInfo}
          inputTestId="hex-input"
          invalidMessage={messages.invalidColorMessage}
          label="HEX"
          onCommit={onHexCommit}
          value={values.hex}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.rgbInfo}
          inputTestId="rgb-input"
          invalidMessage={messages.invalidColorMessage}
          label="RGB"
          onCommit={onRgbCommit}
          value={values.rgb}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.hslInfo}
          inputTestId="hsl-input"
          invalidMessage={messages.invalidColorMessage}
          label="HSL"
          onCommit={onHslCommit}
          value={values.hsl}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.hsvInfo}
          inputTestId="hsv-input"
          invalidMessage={messages.invalidColorMessage}
          label="HSV"
          onCommit={onHsvCommit}
          value={values.hsv}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.hwbInfo}
          inputTestId="hwb-input"
          invalidMessage={messages.invalidColorMessage}
          label="HWB"
          onCommit={onHwbCommit}
          value={values.hwb}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.labInfo}
          inputTestId="lab-input"
          invalidMessage={messages.invalidColorMessage}
          label="LAB"
          onCommit={onLabCommit}
          value={values.lab}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.lchInfo}
          inputTestId="lch-input"
          invalidMessage={messages.invalidColorMessage}
          label="LCH"
          onCommit={onLchCommit}
          value={values.lch}
        />
        <EditableField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.cmykInfo}
          inputTestId="cmyk-input"
          invalidMessage={messages.invalidColorMessage}
          label="CMYK"
          onCommit={onCmykCommit}
          value={values.cmyk}
        />
        <KeywordField
          copiedLabel={messages.copiedLabel}
          copyLabel={messages.copyValueLabel}
          description={messages.keywordInfo}
          invalidMessage={messages.invalidColorMessage}
          label={messages.keywordLabel}
          onCommit={onKeywordCommit}
          value={values.keyword}
        />
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
