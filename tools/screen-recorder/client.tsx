import { OutputCard } from "./components/output-card"
import { RecorderCard } from "./components/recorder-card"
import { SettingsCard } from "./components/settings-card"
import { useScreenRecorder } from "./use-screen-recorder"

import type { ScreenRecorderMessages } from "./types"

type ScreenRecorderClientProps = Readonly<{
  messages: ScreenRecorderMessages
}>

function ScreenRecorderClient({ messages }: ScreenRecorderClientProps) {
  const { actions, state } = useScreenRecorder(messages)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <RecorderCard
          alerts={messages.alerts}
          messages={messages.recorder}
          status={state.status}
          supportStatus={state.supportStatus}
          error={state.error}
          formattedDuration={state.formattedDuration}
          isPreparing={state.isPreparing}
          isPaused={state.isPaused}
          isRecording={state.isRecording}
          isSupported={state.isSupported}
          onStart={actions.startRecording}
          onPause={actions.pauseRecording}
          onResume={actions.resumeRecording}
          onStop={actions.stopRecording}
        />
        <SettingsCard
          messages={messages.settings}
          includeSystemAudio={state.includeSystemAudio}
          includeMicrophone={state.includeMicrophone}
          microphoneSupported={state.microphoneSupported}
          disabled={state.settingsDisabled}
          onSystemAudioChange={actions.setIncludeSystemAudio}
          onMicrophoneChange={actions.setIncludeMicrophone}
        />
      </div>

      <OutputCard
        messages={messages.output}
        output={state.output}
        outputUrl={state.outputUrl}
        displayMimeType={state.displayMimeType}
        fileName={state.fileName}
        fileSizeLabel={state.fileSizeLabel}
        downloadName={state.downloadName}
        onFileNameChange={actions.setFileName}
        onClear={actions.clearRecording}
      />
    </div>
  )
}

export default ScreenRecorderClient
