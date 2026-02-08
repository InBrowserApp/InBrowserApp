import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, type Ref } from 'vue'
import CameraController from './CameraController.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', () => ({
  useObjectUrl: (source: Ref<Blob | null>) => computed(() => (source.value ? 'blob:mock' : null)),
}))

const originalMediaDevices = navigator.mediaDevices
const originalMediaRecorder = globalThis.MediaRecorder
const originalPlay = HTMLMediaElement.prototype.play
const originalSrcObjectDescriptor = Object.getOwnPropertyDescriptor(
  HTMLMediaElement.prototype,
  'srcObject',
)
const originalGetContext = HTMLCanvasElement.prototype.getContext
const originalToBlob = HTMLCanvasElement.prototype.toBlob

const setMediaDevices = (value: MediaDevices | undefined) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  })
}

const createStream = (
  options: {
    videoCapabilities?: MediaTrackCapabilities
    videoSettings?: MediaTrackSettings | undefined
    videoTrackOverrides?: Partial<MediaStreamTrack>
    audioTrackOverrides?: Partial<MediaStreamTrack>
  } = {},
) => {
  const videoTrack = {
    stop: vi.fn(),
    applyConstraints: vi.fn().mockResolvedValue(undefined),
    getCapabilities: vi.fn(() => options.videoCapabilities ?? {}),
    getSettings: vi.fn(() => options.videoSettings ?? {}),
    ...options.videoTrackOverrides,
  } as unknown as MediaStreamTrack

  const audioTrack = {
    stop: vi.fn(),
    enabled: true,
    ...options.audioTrackOverrides,
  } as unknown as MediaStreamTrack

  return {
    getTracks: () => [videoTrack, audioTrack],
    getVideoTracks: () => [videoTrack],
    getAudioTracks: () => [audioTrack],
  } as unknown as MediaStream
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static isTypeSupported = vi.fn((type: string) => type === 'video/webm')
  static emittedData = new Blob(['data'], { type: 'video/webm' })
  static forcedMimeType: string | null = null
  static lastOptions: MediaRecorderOptions | undefined
  static shouldThrowOnStart = false
  static shouldThrowWhenOptions = false

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    if (options && FakeMediaRecorder.shouldThrowWhenOptions) {
      throw new Error('failed-with-options')
    }
    this.mimeType = FakeMediaRecorder.forcedMimeType ?? options?.mimeType ?? 'video/webm'
    FakeMediaRecorder.lastOptions = options
    FakeMediaRecorder.instances.push(this)
  }

  start = vi.fn(() => {
    if (FakeMediaRecorder.shouldThrowOnStart) {
      throw new Error('failed-to-start')
    }
    this.state = 'recording'
    this.onstart?.()
  })

  stop = vi.fn(() => {
    this.state = 'inactive'
    this.ondataavailable?.({ data: FakeMediaRecorder.emittedData } as BlobEvent)
    this.onstop?.()
  })
}

const globalStubs = {
  ToolSection: { template: '<section><slot /></section>' },
  ToolSectionHeader: { template: '<h3><slot /></h3>' },
  NButton: { template: '<button><slot /></button>' },
  NFlex: { template: '<div><slot /></div>' },
  NGrid: { template: '<div><slot /></div>' },
  NGi: { template: '<div><slot /></div>' },
  NIcon: { template: '<span />' },
  NSlider: { template: '<input type="range" />' },
  NText: { template: '<span><slot /></span>' },
}

const mountController = () =>
  mount(CameraController, {
    global: {
      stubs: globalStubs,
    },
  })

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

const waitForIdle = async (predicate: () => boolean) => {
  for (let i = 0; i < 5; i += 1) {
    if (predicate()) return
    await flushPromises()
  }
}

const setModeToVideo = async (
  wrapper: ReturnType<typeof mountController>,
  vm: {
    mode: 'photo' | 'video'
    setMode?: (mode: 'photo' | 'video') => void
    isPreparing: boolean
  },
) => {
  vm.setMode?.('video')

  if (vm.mode !== 'video') {
    const internalMode = (
      wrapper.vm as unknown as { $: { setupState: { mode?: { value: string } } } }
    ).$?.setupState?.mode

    if (internalMode?.value !== undefined) {
      internalMode.value = 'video'
    } else {
      vm.mode = 'video'
    }
  }

  await wrapper.vm.$nextTick()
  await waitForIdle(() => !vm.isPreparing)
}

describe('CameraController additional branches', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = []
    FakeMediaRecorder.emittedData = new Blob(['data'], { type: 'video/webm' })
    FakeMediaRecorder.forcedMimeType = null
    FakeMediaRecorder.lastOptions = undefined
    FakeMediaRecorder.shouldThrowOnStart = false
    FakeMediaRecorder.shouldThrowWhenOptions = false
    FakeMediaRecorder.isTypeSupported.mockReset()
    FakeMediaRecorder.isTypeSupported.mockImplementation((type: string) => type === 'video/webm')

    setMediaDevices({
      getUserMedia: vi.fn().mockResolvedValue(createStream()),
    } as unknown as MediaDevices)

    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', {
      configurable: true,
      writable: true,
      value: null,
    })

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => {
      cb?.(new Blob(['photo'], { type: 'image/jpeg' }))
    })
  })

  afterEach(() => {
    setMediaDevices(originalMediaDevices)
    if (originalMediaRecorder) {
      vi.stubGlobal('MediaRecorder', originalMediaRecorder)
    } else {
      vi.stubGlobal('MediaRecorder', undefined)
    }
    HTMLMediaElement.prototype.play = originalPlay
    if (originalSrcObjectDescriptor) {
      Object.defineProperty(HTMLMediaElement.prototype, 'srcObject', originalSrcObjectDescriptor)
    } else {
      delete (HTMLMediaElement.prototype as { srcObject?: unknown }).srcObject
    }
    HTMLCanvasElement.prototype.getContext = originalGetContext
    HTMLCanvasElement.prototype.toBlob = originalToBlob
    vi.restoreAllMocks()
  })

  it('shows default metadata and falls back to image/jpeg for typeless photo blobs', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      outputUrl: string
      displayMimeType: string
      fileSizeLabel: string
      downloadName: string
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    expect(vm.outputUrl).toBe('')
    expect(vm.displayMimeType).toBe('formatUnknown')
    expect(vm.fileSizeLabel).toBe('0 B')
    expect(vm.downloadName).toBe('')

    const video = wrapper.find('video').element as HTMLVideoElement
    Object.defineProperty(video, 'videoWidth', { value: 640, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 480, configurable: true })
    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => {
      cb?.(new Blob(['photo']))
    })

    await vm.handleShutter()
    await flushPromises()

    expect(vm.displayMimeType).toBe('image/jpeg')
    expect(vm.downloadName).toContain('.jpg')
    expect(vm.outputUrl).toBe('blob:mock')
  })

  it('skips restricted actions while recording and handles missing tracks', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      switchCamera: () => void
      setMode: (mode: 'photo' | 'video') => void
      applyZoom: (value: number) => Promise<void>
      toggleTorch: () => Promise<void>
      toggleMic: () => void
      micEnabled: boolean
      isMirrored: boolean
      mode: 'photo' | 'video'
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    const setupState = (
      wrapper.vm as unknown as {
        $: {
          setupState: {
            isRecording: boolean | { value: boolean }
            videoTrack: MediaStreamTrack | null | { value: MediaStreamTrack | null }
            audioTrack: MediaStreamTrack | null | { value: MediaStreamTrack | null }
          }
        }
      }
    ).$.setupState

    if (typeof setupState.isRecording === 'object') {
      setupState.isRecording.value = true
    } else {
      setupState.isRecording = true
    }

    const getUserMedia = navigator.mediaDevices.getUserMedia as unknown as ReturnType<typeof vi.fn>
    getUserMedia.mockClear()

    await vm.startCamera()
    vm.switchCamera()
    vm.setMode('video')

    const videoTrackState = setupState.videoTrack
    if (videoTrackState && typeof videoTrackState === 'object' && 'value' in videoTrackState) {
      videoTrackState.value = null
    } else {
      setupState.videoTrack = null
    }

    const audioTrackState = setupState.audioTrack
    if (audioTrackState && typeof audioTrackState === 'object' && 'value' in audioTrackState) {
      audioTrackState.value = null
    } else {
      setupState.audioTrack = null
    }

    await vm.applyZoom(2)
    await vm.toggleTorch()
    vm.toggleMic()

    expect(getUserMedia).not.toHaveBeenCalled()
    expect(vm.isMirrored).toBe(false)
    expect(vm.mode).toBe('photo')
    expect(vm.micEnabled).toBe(false)
  })

  it('records without mime hints and ignores empty data chunks', async () => {
    FakeMediaRecorder.isTypeSupported.mockReturnValue(false)
    FakeMediaRecorder.forcedMimeType = ''
    FakeMediaRecorder.emittedData = new Blob([])

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      setMode?: (mode: 'photo' | 'video') => void
      handleShutter: () => Promise<void>
      outputBlob: Blob | null
      outputKind: string
      displayMimeType: string
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)
    await setModeToVideo(wrapper, vm)

    await vm.handleShutter()
    expect(FakeMediaRecorder.lastOptions).toBeUndefined()

    await vm.handleShutter()
    await flushPromises()

    expect(vm.outputKind).toBe('video')
    expect(vm.outputBlob?.size).toBe(0)
    expect(vm.displayMimeType).toBe('formatUnknown')
  })

  it('stops an active recorder during unmount cleanup', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      setMode?: (mode: 'photo' | 'video') => void
      handleShutter: () => Promise<void>
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)
    await setModeToVideo(wrapper, vm)
    await vm.handleShutter()

    const recorder = FakeMediaRecorder.instances[0]
    expect(recorder).toBeDefined()

    wrapper.unmount()

    expect(recorder?.stop).toHaveBeenCalled()
  })

  it('covers metadata callbacks and aspect ratio fallbacks', async () => {
    const streamWithInfiniteAspect = createStream({
      videoSettings: {
        aspectRatio: Number.POSITIVE_INFINITY,
      } as MediaTrackSettings,
    })
    const streamWithoutSettings = createStream({
      videoTrackOverrides: {
        getSettings: vi.fn(() => undefined) as unknown as () => MediaTrackSettings,
      },
    })
    const streamWithDimensions = createStream({
      videoSettings: {
        width: 1280,
        height: 720,
      } as MediaTrackSettings,
    })

    const getUserMedia = vi
      .fn()
      .mockResolvedValueOnce(streamWithInfiniteAspect)
      .mockResolvedValueOnce(streamWithoutSettings)
      .mockResolvedValueOnce(streamWithDimensions)

    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    const setupState = (
      wrapper.vm as unknown as {
        $: {
          setupState: {
            previewRef?: { value: HTMLVideoElement | null }
          }
        }
      }
    ).$.setupState

    if (setupState.previewRef && 'value' in setupState.previewRef) {
      setupState.previewRef.value = null
    }

    await vm.startCamera()

    const video = wrapper.find('video').element as HTMLVideoElement
    if (setupState.previewRef && 'value' in setupState.previewRef) {
      setupState.previewRef.value = video
    }

    Object.defineProperty(video, 'videoWidth', { value: 800, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 600, configurable: true })

    vm.errorMessage = 'cameraNotReady'
    await vm.startCamera()
    video.onloadedmetadata?.(new Event('loadedmetadata'))
    await flushPromises()

    expect(getUserMedia).toHaveBeenCalledTimes(3)
    expect(vm.errorMessage).toBe('')
  })

  it('handles zoom and torch failures, switching camera, and clearing output', async () => {
    const stream = createStream({
      videoCapabilities: {
        torch: true,
        zoom: { min: 1, max: 3, step: 0.5 },
      } as MediaTrackCapabilities,
      videoSettings: {
        zoom: 2,
      } as MediaTrackSettings,
      videoTrackOverrides: {
        applyConstraints: vi.fn().mockRejectedValue(new Error('constraint-failed')),
      },
    })

    setMediaDevices({
      getUserMedia: vi.fn().mockResolvedValue(stream),
    } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      applyZoom: (value: number) => Promise<void>
      toggleTorch: () => Promise<void>
      switchCamera: () => void
      clearOutput: () => void
      outputBlob: Blob | null
      outputKind: '' | 'photo' | 'video'
      zoomValue: number
      isMirrored: boolean
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    await vm.applyZoom(2.3)
    await vm.toggleTorch()
    vm.switchCamera()

    const setupState = (
      wrapper.vm as unknown as {
        $: {
          setupState: {
            videoTrack?: { value: MediaStreamTrack | null }
            outputBlob?: { value: Blob | null }
            outputKind?: { value: '' | 'photo' | 'video' }
          }
        }
      }
    ).$.setupState

    if (setupState.videoTrack && 'value' in setupState.videoTrack) {
      setupState.videoTrack.value = null
    }
    await vm.applyZoom(1.2)

    if (setupState.outputBlob && 'value' in setupState.outputBlob) {
      setupState.outputBlob.value = new Blob(['x'], { type: 'image/jpeg' })
    }
    if (setupState.outputKind && 'value' in setupState.outputKind) {
      setupState.outputKind.value = 'photo'
    }

    vm.clearOutput()

    expect(vm.zoomValue).toBe(2)
    expect(vm.isMirrored).toBe(true)
    expect(vm.outputBlob).toBeNull()
    expect(vm.outputKind).toBe('')
  })

  it('handles recording guard branches and recorder start failures', async () => {
    FakeMediaRecorder.shouldThrowWhenOptions = true
    FakeMediaRecorder.shouldThrowOnStart = true

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      setMode?: (mode: 'photo' | 'video') => void
      handleShutter: () => Promise<void>
      isPreparing: boolean
      isRecording: boolean
      errorMessage: string
    }

    await waitForIdle(() => !vm.isPreparing)
    await setModeToVideo(wrapper, vm)

    vm.isPreparing = true
    await vm.handleShutter()

    vm.isPreparing = false
    vm.isRecording = true
    await vm.handleShutter()

    vm.isRecording = false
    await vm.handleShutter()

    expect(vm.errorMessage).toContain('recordingFailed')
    expect(FakeMediaRecorder.instances.length).toBe(1)
    expect(FakeMediaRecorder.lastOptions).toBeUndefined()
  })

  it('skips restart watcher for unsupported and recording states', async () => {
    setMediaDevices(undefined)

    const unsupportedWrapper = mountController()
    const unsupportedVm = unsupportedWrapper.vm as unknown as {
      mode: 'photo' | 'video'
      isPreparing: boolean
    }

    await waitForIdle(() => !unsupportedVm.isPreparing)
    unsupportedVm.mode = 'video'
    await unsupportedWrapper.vm.$nextTick()

    const getUserMedia = vi.fn().mockResolvedValue(createStream())
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const recordingWrapper = mountController()
    const recordingVm = recordingWrapper.vm as unknown as {
      mode: 'photo' | 'video'
      isPreparing: boolean
      isRecording: boolean
    }

    await waitForIdle(() => !recordingVm.isPreparing)

    getUserMedia.mockClear()
    recordingVm.isRecording = true
    recordingVm.mode = 'video'
    await recordingWrapper.vm.$nextTick()

    expect(getUserMedia).not.toHaveBeenCalled()
  })

  it('handles preview lifecycle fallback branches when playback fails', async () => {
    const getUserMedia = vi.fn().mockResolvedValue(createStream())
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, 'play')
      .mockRejectedValue(new Error('play-failed'))

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    const setupState = (
      wrapper.vm as unknown as {
        $: {
          setupState: {
            previewRef?: { value: HTMLVideoElement | null }
          }
        }
      }
    ).$.setupState

    if (setupState.previewRef && 'value' in setupState.previewRef) {
      setupState.previewRef.value = null
    }

    vm.errorMessage = 'cameraNotReady'
    await vm.startCamera()
    expect(vm.errorMessage).toBe('')

    const video = wrapper.find('video').element as HTMLVideoElement
    if (setupState.previewRef && 'value' in setupState.previewRef) {
      setupState.previewRef.value = video
    }

    vm.errorMessage = 'cameraNotReady'
    await vm.startCamera()
    expect(vm.errorMessage).toBe('')

    vm.errorMessage = 'cameraNotReady'
    video.onloadedmetadata?.(new Event('loadedmetadata'))
    await flushPromises()

    expect(vm.errorMessage).toBe('')
    expect(playSpy).toHaveBeenCalled()
  })

  it('covers capture guard returns and zoom fallback without a track', async () => {
    const previewRefState = { current: undefined as { value: HTMLVideoElement | null } | undefined }

    const getUserMedia = vi
      .fn()
      .mockRejectedValueOnce(new Error('camera-start-failed'))
      .mockImplementation(async () => {
        if (previewRefState.current) {
          previewRefState.current.value = null
        }
        return createStream()
      })

    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      applyZoom: (value: number) => Promise<void>
      isPreparing: boolean
      zoomValue: number
      outputKind: '' | 'photo' | 'video'
    }

    await waitForIdle(() => !vm.isPreparing)

    const setupState = (
      wrapper.vm as unknown as {
        $: {
          setupState: {
            previewRef?: { value: HTMLVideoElement | null }
          }
        }
      }
    ).$.setupState

    previewRefState.current = setupState.previewRef

    vm.isPreparing = true
    await vm.handleShutter()
    vm.isPreparing = false

    await vm.applyZoom(1.7)
    expect(vm.zoomValue).toBe(1.7)

    const video = wrapper.find('video').element as HTMLVideoElement
    if (previewRefState.current) {
      previewRefState.current.value = video
    }

    await vm.handleShutter()
    expect(vm.outputKind).toBe('')

    await vm.handleShutter()

    expect(getUserMedia).toHaveBeenCalledTimes(2)
  })

  it('returns early when recording starts without an available stream', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new Error('camera-offline'))
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      setMode?: (mode: 'photo' | 'video') => void
      handleShutter: () => Promise<void>
      isPreparing: boolean
      isRecording: boolean
    }

    await waitForIdle(() => !vm.isPreparing)
    await setModeToVideo(wrapper, vm)

    FakeMediaRecorder.instances = []
    await vm.handleShutter()

    expect(vm.isRecording).toBe(false)
    expect(FakeMediaRecorder.instances).toHaveLength(0)
  })

  it('updates formatted duration while recording timer ticks', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      setMode?: (mode: 'photo' | 'video') => void
      handleShutter: () => Promise<void>
      isPreparing: boolean
      isRecording: boolean
      formattedDuration: string
    }

    await waitForIdle(() => !vm.isPreparing)
    await setModeToVideo(wrapper, vm)

    await vm.handleShutter()
    expect(vm.isRecording).toBe(true)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    expect(vm.formattedDuration).toBe('00:01')

    await vm.handleShutter()
  })
})
