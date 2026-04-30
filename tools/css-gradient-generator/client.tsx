import { ExportCard } from "./client/export-card"
import { JsonCard } from "./client/json-card"
import { LayerEditorCard } from "./client/layer-editor-card"
import { LayersCard } from "./client/layers-card"
import { OutputCard } from "./client/output-card"
import { PresetsCard, PreviewCard } from "./client/preview-card"
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
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.64fr)]">
      <div className="order-2 grid content-start gap-6 xl:order-none">
        <PresetsCard
          messages={messages}
          onApplyPreset={editor.applyPreset}
          presetId={editor.presetId}
          presets={editor.presets}
        />
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

      <aside className="contents xl:sticky xl:top-6 xl:grid xl:content-start xl:gap-6">
        <div className="order-1 xl:order-none">
          <PreviewCard
            backgroundImage={editor.previewBackgroundImage}
            blendMode={editor.previewBlendMode}
            messages={messages}
            onRandomizeAll={editor.randomizeAll}
            onRandomizeLayer={editor.randomizeLayer}
          />
        </div>
        <div className="order-3 xl:order-none">
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
        </div>
      </aside>
    </div>
  )
}

export default CssGradientGeneratorClient
