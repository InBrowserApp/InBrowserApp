import { useCallback, useRef } from "react"

import { OutputCard } from "./components/output-card"
import { CameraViewfinder } from "./components/camera-viewfinder"
import { useCameraController } from "./use-camera-controller"

import type { CameraMessages } from "./types"

type CameraClientProps = Readonly<{
  messages: CameraMessages
}>

function CameraClient({ messages }: CameraClientProps) {
  const { actions, state, videoRef } = useCameraController(messages)
  const outputRef = useRef<HTMLDivElement>(null)
  const handleOpenOutput = useCallback(() => {
    const shouldReduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    outputRef.current?.scrollIntoView({
      behavior: shouldReduceMotion ? "auto" : "smooth",
      block: "start",
    })
    outputRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <CameraViewfinder
        messages={messages}
        videoRef={videoRef}
        mode={state.mode}
        supportState={state.supportState}
        hasStarted={state.hasStarted}
        isPreparing={state.isPreparing}
        isRecording={state.isRecording}
        permissionDenied={state.permissionDenied}
        errorMessage={state.errorMessage}
        formattedDuration={state.formattedDuration}
        recorderSupported={state.recorderSupported}
        micEnabled={state.micEnabled}
        torchSupported={state.torchSupported}
        torchEnabled={state.torchEnabled}
        zoomSupported={state.zoom.supported}
        zoomValue={state.zoom.value}
        zoomMin={state.zoom.min}
        zoomMax={state.zoom.max}
        zoomStep={state.zoom.step}
        outputKind={state.output?.kind ?? null}
        outputUrl={state.outputUrl}
        isMirrored={state.isMirrored}
        onStartCamera={actions.startCamera}
        onStopCamera={actions.stopCamera}
        onModeChange={actions.handleModeChange}
        onShutter={actions.handleShutter}
        onSwitchCamera={actions.switchCamera}
        onToggleTorch={actions.toggleTorch}
        onToggleMic={actions.toggleMic}
        onZoomChange={actions.applyZoom}
        onOpenOutput={handleOpenOutput}
      />
      <div
        ref={outputRef}
        tabIndex={-1}
        className="scroll-mt-24 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <OutputCard
          messages={messages}
          output={state.output}
          outputUrl={state.outputUrl}
          onClear={actions.clearOutput}
        />
      </div>
    </div>
  )
}

export default CameraClient
