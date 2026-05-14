type MutableRef<T> = {
  current: T
}

function releaseRecorder(
  recorderRef: MutableRef<MediaRecorder | null>,
  recordedChunksRef: MutableRef<Blob[]>
) {
  const recorder = recorderRef.current
  recorderRef.current = null
  recordedChunksRef.current = []
  if (recorder && recorder.state !== "inactive") {
    recorder.ondataavailable = null
    recorder.onerror = null
    recorder.onstop = null
    recorder.stop()
  }
}

export { releaseRecorder }
