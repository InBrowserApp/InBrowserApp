import { ExportCard } from "./client/export-card"
import { JsonCard } from "./client/json-card"
import { LayerEditorCard } from "./client/layer-editor-card"
import { LayersCard } from "./client/layers-card"
import { OutputCard } from "./client/output-card"
import { PreviewCard } from "./client/preview-card"
import { StopsCard } from "./client/stops-card"
import { useGradientEditor } from "./client/use-gradient-editor"

import type { CssGradientGeneratorMessages } from "./types"

type CssGradientGeneratorClientProps = Readonly<{
  messages: CssGradientGeneratorMessages
}>

function CssGradientGeneratorClient({
  messages,
}: CssGradientGeneratorClientProps) {
  const editor = useGradientEditor()

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid gap-6">
          <PreviewCard
            backgroundImage={editor.previewBackgroundImage}
            blendMode={editor.previewBlendMode}
            messages={messages}
            onApplyPreset={editor.applyPreset}
            onRandomizeAll={editor.randomizeAll}
            onRandomizeLayer={editor.randomizeLayer}
            presetId={editor.presetId}
            presets={editor.presets}
          />
          <StopsCard
            activeLayer={editor.activeLayer}
            activeStopId={editor.activeStop.id}
            messages={messages}
            onAddStop={() => {
              editor.addStop()
            }}
            onAddStopAtPosition={editor.addStop}
            onRemoveStop={editor.removeStop}
            onSelectStop={editor.setActiveStop}
            onStopColorChange={editor.updateStopColor}
            onStopPositionChange={editor.updateStopPosition}
            showError={editor.showStopError}
          />
        </div>

        <div className="grid gap-6">
          <LayersCard
            activeLayerId={editor.activeLayer.id}
            layers={editor.layers}
            messages={messages}
            onAddLayer={editor.addLayer}
            onDuplicateLayer={editor.duplicateLayer}
            onMoveLayer={editor.moveLayer}
            onRemoveLayer={editor.removeLayer}
            onSetActive={editor.setActiveLayer}
            showError={editor.showLayerError}
          />
          <LayerEditorCard
            layer={editor.activeLayer}
            messages={messages}
            onAngleChange={(value) => {
              editor.updateActiveLayer({ angle: value })
            }}
            onBlendModeChange={(value) => {
              editor.updateActiveLayer({ blendMode: value })
            }}
            onCenterXChange={(value) => {
              editor.updateActiveLayer({ centerX: value })
            }}
            onCenterYChange={(value) => {
              editor.updateActiveLayer({ centerY: value })
            }}
            onColorSpaceChange={(value) => {
              editor.updateActiveLayer({ colorSpace: value })
            }}
            onRadialShapeChange={(value) => {
              editor.updateActiveLayer({ radialShape: value })
            }}
            onRadialSizeChange={(value) => {
              editor.updateActiveLayer({ radialSize: value })
            }}
            onTypeChange={(value) => {
              editor.updateActiveLayer({ type: value })
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(20rem,0.72fr)]">
        <OutputCard
          backgroundBlendDeclaration={editor.backgroundBlendDeclaration}
          backgroundDeclaration={editor.backgroundDeclaration}
          backgroundImageDeclaration={editor.backgroundImageDeclaration}
          cssDownloadUrl={editor.cssDownloadUrl}
          cssOutput={editor.cssOutput}
          hasBlendModes={editor.hasBlendModes}
          messages={messages}
          onOutputFormatChange={editor.setOutputFormat}
          outputFormat={editor.outputFormat}
        />
        <div className="grid content-start gap-6">
          <ExportCard
            exportHeight={editor.exportHeight}
            exportWidth={editor.exportWidth}
            messages={messages}
            onExportHeightChange={editor.setExportHeight}
            onExportImage={editor.exportImage}
            onExportWidthChange={editor.setExportWidth}
            showError={editor.showExportError}
            svgDownloadUrl={editor.svgDownloadUrl}
          />
          <JsonCard
            jsonDownloadUrl={editor.jsonDownloadUrl}
            jsonInput={editor.jsonInput}
            messages={messages}
            onJsonInputChange={editor.setJsonInput}
            onLoadJson={editor.loadJson}
            serializedConfig={editor.serializedConfig}
            showError={editor.showJsonError}
          />
        </div>
      </div>
    </div>
  )
}

export default CssGradientGeneratorClient
