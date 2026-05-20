import { AudioRecorderControlCard } from "./components/control-card"
import { AudioRecorderOutputCard } from "./components/output-card"
import { useAudioRecorder } from "./client/use-audio-recorder"

import type { AudioRecorderMessages } from "./types"

type AudioRecorderClientProps = Readonly<{
  messages: AudioRecorderMessages
}>

function AudioRecorderClient({ messages }: AudioRecorderClientProps) {
  const recorder = useAudioRecorder()

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
      <AudioRecorderControlCard
        messages={messages}
        isSupported={recorder.isSupported}
        recorderState={recorder.recorderState}
        isPreparing={recorder.isPreparing}
        error={recorder.error}
        elapsedMs={recorder.elapsedMs}
        onStart={recorder.startRecording}
        onPause={recorder.pauseRecording}
        onResume={recorder.resumeRecording}
        onStop={recorder.stopRecording}
      />
      <AudioRecorderOutputCard
        messages={messages}
        recording={recorder.recording}
        onClear={recorder.clearRecording}
      />
    </div>
  )
}

export default AudioRecorderClient
