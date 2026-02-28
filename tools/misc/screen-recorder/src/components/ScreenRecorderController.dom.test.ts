import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import ScreenRecorderController from './ScreenRecorderController.vue'
import ScreenRecorderOutput from './ScreenRecorderOutput.vue'
import ScreenRecorderSettings from './ScreenRecorderSettings.vue'

vi.mock('@vueuse/core', () => ({
  useObjectUrl: () => ref('blob:mock'),
}))

const originalMediaDevices = navigator.mediaDevices
const originalMediaRecorder = globalThis.MediaRecorder
const originalAudioContext = globalThis.AudioContext
const originalMediaStream = globalThis.MediaStream

const setMediaDevices = (value: MediaDevices | undefined) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  })
}

const createTrack = (kind: 'video' | 'audio') => {
  const listeners = new Map<string, Set<() => void>>()
  return {
    kind,
    stop: vi.fn(),
    addEventListener: vi.fn((event: string, handler: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event)?.add(handler)
    }),
    trigger(event: string) {
      listeners.get(event)?.forEach((handler) => handler())
    },
  }
}

const createStream = ({ videoTracks = 1, audioTracks = 0 } = {}) => {
  const video = Array.from({ length: videoTracks }, () => createTrack('video'))
  const audio = Array.from({ length: audioTracks }, () => createTrack('audio'))
  return {
    getTracks: () => [...video, ...audio],
    getVideoTracks: () => video,
    getAudioTracks: () => audio,
    video,
    audio,
  }
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static constructorOptions: Array<MediaRecorderOptions | undefined> = []
  static isTypeSupported = vi.fn((type: string) => type === 'video/webm')
  static shouldThrow = false
  static forceEmptyMimeType = false

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null
  onpause: (() => void) | null = null
  onresume: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    if (FakeMediaRecorder.shouldThrow && options) {
      throw new Error('fail')
    }
    FakeMediaRecorder.constructorOptions.push(options)
    this.mimeType = FakeMediaRecorder.forceEmptyMimeType ? '' : (options?.mimeType ?? 'video/webm')
    FakeMediaRecorder.instances.push(this)
  }

  start = vi.fn(() => {
    this.state = 'recording'
    this.onstart?.()
  })

  stop = vi.fn(() => {
    this.state = 'inactive'
    this.ondataavailable?.({
      data: new Blob(['data'], { type: this.mimeType }),
    } as BlobEvent)
    this.onstop?.()
  })

  pause = vi.fn(() => {
    this.state = 'paused'
    this.onpause?.()
  })

  resume = vi.fn(() => {
    this.state = 'recording'
    this.onresume?.()
  })
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  static destinationAudioTracks = 1
  sources: Array<{ connect: () => void; disconnect: () => void }> = []

  constructor() {
    FakeAudioContext.instances.push(this)
  }

  createMediaStreamDestination = vi.fn(() => ({
    stream: createStream({ audioTracks: FakeAudioContext.destinationAudioTracks }),
  }))

  createMediaStreamSource = vi.fn(() => {
    const node = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    }
    this.sources.push(node)
    return node
  })

  close = vi.fn(() => Promise.resolve())
}

class FakeMediaStream {
  private tracks: MediaStreamTrack[] = []

  constructor(tracks: MediaStreamTrack[] = []) {
    this.tracks = [...tracks]
  }

  addTrack(track: MediaStreamTrack) {
    this.tracks.push(track)
  }

  getTracks() {
    return this.tracks
  }

  getVideoTracks() {
    return this.tracks.filter((track) => track.kind === 'video')
  }

  getAudioTracks() {
    return this.tracks.filter((track) => track.kind === 'audio')
  }
}

const globalStubs = {
  ToolSection: { template: '<section><slot /></section>' },
  ToolSectionHeader: { template: '<h3><slot /></h3>' },
  NAlert: { template: '<div><slot /></div>' },
  NButton: { template: '<button><slot /></button>' },
  NFlex: { template: '<div><slot /></div>' },
  NGrid: { template: '<div><slot /></div>' },
  NGi: { template: '<div><slot /></div>' },
  NIcon: { template: '<span />' },
  NInput: { template: '<input />' },
  NSwitch: { template: '<input type="checkbox" />' },
  NTag: { template: '<span><slot /></span>' },
  NText: { template: '<span><slot /></span>' },
}

const mountController = () =>
  mount(ScreenRecorderController, {
    global: {
      stubs: globalStubs,
    },
  })

describe('ScreenRecorderController', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = []
    FakeMediaRecorder.constructorOptions = []
    FakeMediaRecorder.shouldThrow = false
    FakeMediaRecorder.forceEmptyMimeType = false
    FakeMediaRecorder.isTypeSupported.mockReset()
    FakeMediaRecorder.isTypeSupported.mockImplementation((type: string) => type === 'video/webm')
    FakeAudioContext.instances = []
    FakeAudioContext.destinationAudioTracks = 1
    setMediaDevices({ getDisplayMedia: vi.fn(), getUserMedia: vi.fn() } as unknown as MediaDevices)
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    vi.stubGlobal('AudioContext', FakeAudioContext)
    vi.stubGlobal('MediaStream', FakeMediaStream)
  })

  afterEach(() => {
    setMediaDevices(originalMediaDevices)
    if (originalMediaRecorder) {
      vi.stubGlobal('MediaRecorder', originalMediaRecorder)
    } else {
      vi.stubGlobal('MediaRecorder', undefined)
    }
    if (originalAudioContext) {
      vi.stubGlobal('AudioContext', originalAudioContext)
    } else {
      vi.stubGlobal('AudioContext', undefined)
    }
    if (originalMediaStream) {
      vi.stubGlobal('MediaStream', originalMediaStream)
    } else {
      vi.stubGlobal('MediaStream', undefined)
    }
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows unsupported message when recording is unavailable', () => {
    setMediaDevices(undefined)
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mountController()

    expect(wrapper.text()).toContain('Screen recording is not supported')
  })

  it('no-ops when startRecording is called without support', async () => {
    setMediaDevices(undefined)
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { startRecording: () => Promise<void> }

    await vm.startRecording()

    expect(wrapper.text()).toContain('Screen recording is not supported')
  })

  it('starts and stops recording', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      recordingBlob: Blob | null
    }

    await vm.startRecording()

    expect(getDisplayMedia).toHaveBeenCalledWith({
      video: true,
      audio: true,
    })
    expect(wrapper.text()).toContain('Recording')

    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(display.video[0]?.stop).toHaveBeenCalled()
    expect(vm.recordingBlob).toBeInstanceOf(Blob)
    expect(wrapper.text()).toContain('Output')
    expect(wrapper.text()).toContain('Idle')
  })

  it('uses audio settings', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 0 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      includeSystemAudio: boolean
    }

    vm.includeSystemAudio = false
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    vm.stopRecording()

    expect(getDisplayMedia).toHaveBeenCalledWith({
      video: true,
      audio: false,
    })
  })

  it('does not start when already recording or preparing', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      isPreparing: boolean
    }

    await vm.startRecording()
    await vm.startRecording()
    expect(getDisplayMedia).toHaveBeenCalledTimes(1)

    vm.isPreparing = true
    await vm.startRecording()
    expect(getDisplayMedia).toHaveBeenCalledTimes(1)
  })

  it('handles permission denied errors', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    const getDisplayMedia = vi.fn().mockRejectedValue(error)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { startRecording: () => Promise<void> }

    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Screen permission denied')
    expect(wrapper.text()).toContain('Retry')
  })

  it('handles microphone permission denied', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    const micError = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    const getUserMedia = vi.fn().mockRejectedValue(micError)
    setMediaDevices({ getDisplayMedia, getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeMicrophone: boolean
      startRecording: () => Promise<void>
    }

    vm.includeMicrophone = true
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Microphone permission denied')
    expect(display.video[0]?.stop).toHaveBeenCalled()
    expect(FakeMediaRecorder.instances.length).toBe(0)
  })

  it('shows a message when microphone is not supported', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeMicrophone: boolean
      startRecording: () => Promise<void>
    }

    vm.includeMicrophone = true
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Microphone capture is not supported in this browser.')
    expect(getDisplayMedia).not.toHaveBeenCalled()
  })

  it('handles microphone errors as recording failures', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    const getUserMedia = vi.fn().mockRejectedValue(new Error('boom'))
    setMediaDevices({ getDisplayMedia, getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeMicrophone: boolean
      startRecording: () => Promise<void>
    }

    vm.includeMicrophone = true
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Failed to start recording.')
  })

  it('keeps existing recording when start fails', async () => {
    const getDisplayMedia = vi.fn().mockRejectedValue(new Error('boom'))
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      recordingBlob: Blob | null
      mimeType: string
      fileName: string
      elapsedMs: number
    }

    const existingBlob = new Blob(['old'], { type: 'video/webm' })
    vm.recordingBlob = existingBlob
    vm.mimeType = 'video/webm'
    vm.fileName = 'existing'
    vm.elapsedMs = 1200

    await wrapper.vm.$nextTick()
    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(vm.recordingBlob?.size).toBe(existingBlob.size)
    expect(vm.mimeType).toBe('video/webm')
    expect(vm.fileName).toBe('existing')
    expect(vm.elapsedMs).toBe(1200)
    expect(wrapper.text()).toContain('Failed to start recording.')
  })

  it('pauses and resumes recording', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      pauseRecording: () => void
      resumeRecording: () => void
    }

    await vm.startRecording()
    vm.pauseRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Paused')
    expect(wrapper.text()).toContain('Resume')

    vm.resumeRecording()
    await wrapper.vm.$nextTick()

    const recorder = FakeMediaRecorder.instances[0]
    expect(recorder?.pause).toHaveBeenCalled()
    expect(recorder?.resume).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Recording')
  })

  it('stops when display track ends', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 0 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      recordingBlob: Blob | null
    }

    await vm.startRecording()

    display.video[0]?.trigger('ended')
    await wrapper.vm.$nextTick()

    expect(vm.recordingBlob).toBeInstanceOf(Blob)
  })

  it('mixes system and microphone audio tracks', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const mic = createStream({ videoTracks: 0, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    const getUserMedia = vi.fn().mockResolvedValue(mic)
    setMediaDevices({ getDisplayMedia, getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeMicrophone: boolean
      startRecording: () => Promise<void>
      stopRecording: () => void
    }

    vm.includeMicrophone = true
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(FakeAudioContext.instances.length).toBe(1)
    const context = FakeAudioContext.instances[0]
    if (!context) throw new Error('Missing audio context')
    expect(context.createMediaStreamSource).toHaveBeenCalledTimes(2)
    expect(context.close).toHaveBeenCalled()
  })

  it('clears recording output', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      recordingBlob: Blob | null
      mimeType: string
      fileName: string
      clearRecording: () => void
    }

    vm.recordingBlob = new Blob(['data'], { type: 'video/webm' })
    vm.mimeType = 'video/webm'
    vm.fileName = 'demo'
    await wrapper.vm.$nextTick()

    expect(wrapper.find('video').exists()).toBe(true)

    vm.clearRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('video').exists()).toBe(false)
  })

  it('exposes fallback labels when no recording exists', () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      displayMimeType: string
      fileSizeLabel: string
      downloadName: string
    }

    expect(vm.displayMimeType).toBe('Unknown')
    expect(vm.fileSizeLabel).toBe('0 B')
    expect(vm.downloadName).toBe('screen-recording.webm')
  })

  it('updates elapsed time while recording', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'))

    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { startRecording: () => Promise<void>; elapsedMs: number }

    await vm.startRecording()
    vi.advanceTimersByTime(400)
    await wrapper.vm.$nextTick()

    expect(vm.elapsedMs).toBeGreaterThan(0)
  })

  it('falls back when MediaRecorder options fail', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)
    FakeMediaRecorder.shouldThrow = true

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { startRecording: () => Promise<void> }

    await vm.startRecording()

    expect(FakeMediaRecorder.instances.length).toBe(1)
  })

  it('applies child v-model updates from settings and output components', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeSystemAudio: boolean
      includeMicrophone: boolean
      fileName: string
      recordingBlob: Blob | null
    }

    vm.recordingBlob = new Blob(['data'], { type: 'video/webm' })
    await wrapper.vm.$nextTick()

    const settings = wrapper.findComponent(ScreenRecorderSettings)
    settings.vm.$emit('update:includeSystemAudio', false)
    settings.vm.$emit('update:includeMicrophone', true)

    const output = wrapper.findComponent(ScreenRecorderOutput)
    output.vm.$emit('update:fileName', 'renamed-recording')
    await wrapper.vm.$nextTick()

    expect(vm.includeSystemAudio).toBe(false)
    expect(vm.includeMicrophone).toBe(true)
    expect(vm.fileName).toBe('renamed-recording')
  })

  it('falls back to undefined recorder options and mime placeholders', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    FakeMediaRecorder.isTypeSupported.mockReturnValue(false)
    FakeMediaRecorder.forceEmptyMimeType = true

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      mimeType: string
    }

    await vm.startRecording()

    const recorder = FakeMediaRecorder.instances[0]
    if (!recorder) throw new Error('Missing media recorder')
    recorder.ondataavailable?.({ data: new Blob([]) } as BlobEvent)
    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(FakeMediaRecorder.constructorOptions[0]).toBeUndefined()
    expect(vm.mimeType).toBe('')
  })

  it('uses supported mime type when recorder mime type is empty', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    FakeMediaRecorder.forceEmptyMimeType = true

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      mimeType: string
    }

    await vm.startRecording()

    expect(vm.mimeType).toBe('video/webm')
  })

  it('handles streams without video tracks and with no mixed audio output', async () => {
    const display = createStream({ videoTracks: 0, audioTracks: 1 })
    const mic = createStream({ videoTracks: 0, audioTracks: 1 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    const getUserMedia = vi.fn().mockResolvedValue(mic)
    setMediaDevices({ getDisplayMedia, getUserMedia } as unknown as MediaDevices)

    FakeAudioContext.destinationAudioTracks = 0

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      includeMicrophone: boolean
      startRecording: () => Promise<void>
      stopRecording: () => void
      errorMessage: string
    }

    vm.includeMicrophone = true
    await wrapper.vm.$nextTick()

    await vm.startRecording()
    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(vm.errorMessage).toBe('')
    expect(FakeAudioContext.instances.length).toBe(1)
  })

  it('exposes file sizes and cleans up active streams on unmount', async () => {
    const display = createStream({ videoTracks: 1, audioTracks: 0 })
    const getDisplayMedia = vi.fn().mockResolvedValue(display)
    setMediaDevices({ getDisplayMedia, getUserMedia: vi.fn() } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      recordingBlob: Blob | null
      fileSizeLabel: string
    }

    vm.recordingBlob = new Blob(['1234'], { type: 'video/webm' })
    await wrapper.vm.$nextTick()

    expect(vm.fileSizeLabel).toBe('4 B')

    await vm.startRecording()
    wrapper.unmount()

    expect(display.getTracks().every((track) => track.stop.mock.calls.length > 0)).toBe(true)
  })
})
