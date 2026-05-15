type ScreenRecorderSupport = Readonly<{
  screen: boolean
  microphone: boolean
  recorder: boolean
}>

type AudioMixer = Readonly<{
  context: AudioContext | null
  sources: readonly MediaStreamAudioSourceNode[]
  track: MediaStreamTrack | null
}>

const screenPermissionErrorNames = [
  "NotAllowedError",
  "PermissionDeniedError",
  "AbortError",
] as const
const microphonePermissionErrorNames = [
  "NotAllowedError",
  "PermissionDeniedError",
] as const

function detectScreenRecorderSupport(): ScreenRecorderSupport {
  const mediaDevices =
    typeof navigator === "undefined" ? undefined : navigator.mediaDevices

  return {
    screen: typeof mediaDevices?.getDisplayMedia === "function",
    microphone: typeof mediaDevices?.getUserMedia === "function",
    recorder: typeof MediaRecorder !== "undefined",
  }
}

function buildDisplayMediaOptions(includeSystemAudio: boolean) {
  return {
    video: true,
    audio: includeSystemAudio,
  } satisfies DisplayMediaStreamOptions
}

function isNamedError(error: unknown, names: readonly string[]) {
  return error instanceof DOMException
    ? names.includes(error.name)
    : error instanceof Error && names.includes(error.name)
}

function isScreenPermissionError(error: unknown) {
  return isNamedError(error, screenPermissionErrorNames)
}

function isMicrophonePermissionError(error: unknown) {
  return isNamedError(error, microphonePermissionErrorNames)
}

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

function createAudioMixer(tracks: readonly MediaStreamTrack[]): AudioMixer {
  if (tracks.length === 0) {
    return { context: null, sources: [], track: null }
  }

  if (tracks.length === 1 || typeof AudioContext === "undefined") {
    return { context: null, sources: [], track: tracks[0] ?? null }
  }

  const context = new AudioContext()
  const destination = context.createMediaStreamDestination()
  const sources = tracks.map((track) => {
    const source = context.createMediaStreamSource(new MediaStream([track]))
    source.connect(destination)
    return source
  })

  return {
    context,
    sources,
    track: destination.stream.getAudioTracks()[0] ?? null,
  }
}

function closeAudioMixer(mixer: AudioMixer | null) {
  mixer?.sources.forEach((source) => source.disconnect())
  void mixer?.context?.close()
}

function createRecordingStream(
  displayStream: MediaStream,
  microphoneStream: MediaStream | null
) {
  const audioTracks = [displayStream, microphoneStream]
    .filter((stream): stream is MediaStream => Boolean(stream))
    .flatMap((stream) => stream.getAudioTracks())
  const mixer = createAudioMixer(audioTracks)
  const stream = new MediaStream()
  displayStream.getVideoTracks().forEach((track) => stream.addTrack(track))
  if (mixer.track) {
    stream.addTrack(mixer.track)
  }

  return { mixer, stream }
}

function createMediaRecorder(stream: MediaStream, mimeType: string) {
  if (!mimeType) {
    return new MediaRecorder(stream)
  }

  try {
    return new MediaRecorder(stream, { mimeType })
  } catch {
    return new MediaRecorder(stream)
  }
}

export {
  buildDisplayMediaOptions,
  closeAudioMixer,
  createAudioMixer,
  createMediaRecorder,
  createRecordingStream,
  detectScreenRecorderSupport,
  isMicrophonePermissionError,
  isScreenPermissionError,
  stopMediaStream,
}
export type { AudioMixer, ScreenRecorderSupport }
