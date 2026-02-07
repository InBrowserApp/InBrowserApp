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

const createStream = () => {
  const videoTrack = {
    stop: vi.fn(),
    applyConstraints: vi.fn().mockResolvedValue(undefined),
    getCapabilities: vi.fn(() => ({})),
    getSettings: vi.fn(() => ({})),
  } as unknown as MediaStreamTrack

  const audioTrack = {
    stop: vi.fn(),
    enabled: true,
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

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = FakeMediaRecorder.forcedMimeType ?? options?.mimeType ?? 'video/webm'
    FakeMediaRecorder.lastOptions = options
    FakeMediaRecorder.instances.push(this)
  }

  start = vi.fn(() => {
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
})
