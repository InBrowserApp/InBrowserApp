import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, ref, type Ref } from 'vue'
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
    videoSettings?: MediaTrackSettings
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
  static shouldThrowOnStart = false
  static emittedData = new Blob(['data'], { type: 'video/webm' })
  static forcedMimeType: string | null = null
  static lastOptions: MediaRecorderOptions | undefined

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = FakeMediaRecorder.forcedMimeType ?? options?.mimeType ?? 'video/webm'
    FakeMediaRecorder.lastOptions = options
    FakeMediaRecorder.instances.push(this)
  }

  start = vi.fn(() => {
    if (FakeMediaRecorder.shouldThrowOnStart) {
      throw new Error('recording failed')
    }
    this.state = 'recording'
    this.onstart?.()
  })

  stop = vi.fn(() => {
    this.state = 'inactive'
    this.ondataavailable?.({
      data: FakeMediaRecorder.emittedData,
    } as BlobEvent)
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

describe('CameraController', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = []
    FakeMediaRecorder.shouldThrowOnStart = false
    FakeMediaRecorder.emittedData = new Blob(['data'], { type: 'video/webm' })
    FakeMediaRecorder.forcedMimeType = null
    FakeMediaRecorder.lastOptions = undefined
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

  it('shows unsupported message when camera is unavailable', () => {
    setMediaDevices(undefined)
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mountController()

    expect(wrapper.text()).toContain('cameraNotSupported')
  })

  it('captures a photo and keeps only the latest output', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      outputKind: string
      outputBlob: Blob | null
    }

    await flushPromises()

    const video = wrapper.find('video').element as HTMLVideoElement
    Object.defineProperty(video, 'videoWidth', { value: 1280, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 720, configurable: true })

    await vm.handleShutter()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(vm.outputKind).toBe('photo')
    expect(vm.outputBlob).toBeInstanceOf(Blob)
  })

  it('records a video and outputs a blob', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      mode: 'photo' | 'video'
      handleShutter: () => Promise<void>
      outputKind: string
      outputBlob: Blob | null
      isRecording: boolean
      isPreparing: boolean
    }

    await flushPromises()
    await waitForIdle(() => !vm.isPreparing)
    const setMode = (vm as unknown as { setMode?: (mode: 'photo' | 'video') => void }).setMode
    if (typeof setMode === 'function') {
      setMode('video')
    }
    if (vm.mode !== 'video') {
      vm.mode = 'video'
    }
    await vm.startCamera()
    await waitForIdle(() => !vm.isPreparing)

    await waitForIdle(() => !vm.isPreparing)
    expect(vm.mode).toBe('video')
    expect(typeof MediaRecorder).toBe('function')
    expect((vm as unknown as { isRecorderSupported: boolean }).isRecorderSupported).toBe(true)
    expect((vm as unknown as { isVideoMode: boolean }).isVideoMode).toBe(true)
    expect(vm.isPreparing).toBe(false)
    expect(typeof vm.handleShutter).toBe('function')
    await vm.handleShutter()
    expect(FakeMediaRecorder.instances.length).toBe(1)
    expect(vm.isRecording).toBe(true)

    await vm.handleShutter()
    await wrapper.vm.$nextTick()
    await flushPromises()

    expect(vm.outputKind).toBe('video')
    expect(vm.outputBlob).toBeInstanceOf(Blob)
  })

  it('sets permissionDenied when getUserMedia is rejected', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    setMediaDevices({
      getUserMedia: vi.fn().mockRejectedValue(error),
    } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { permissionDenied: boolean }

    await flushPromises()

    expect(vm.permissionDenied).toBe(true)
    expect(wrapper.text()).toContain('cameraPermissionDenied')
  })

  it('applies zoom, toggles torch, and toggles mic when supported', async () => {
    const stream = createStream({
      videoCapabilities: {
        torch: true,
        zoom: { min: 1, max: 3, step: 0.5 },
      } as MediaTrackCapabilities,
      videoSettings: { zoom: 2 } as MediaTrackSettings,
    })

    setMediaDevices({
      getUserMedia: vi.fn().mockResolvedValue(stream),
    } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      applyZoom: (value: number) => Promise<void>
      toggleTorch: () => Promise<void>
      toggleMic: () => void
      zoomSupported: boolean
      torchSupported: boolean
      zoomValue: number
      zoomDisplay: string
      torchEnabled: boolean
      micEnabled: boolean
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)

    const videoTrack = stream.getVideoTracks()[0] as unknown as {
      applyConstraints: ReturnType<typeof vi.fn>
    }
    const audioTrack = stream.getAudioTracks()[0] as unknown as { enabled: boolean }

    expect(vm.zoomSupported).toBe(true)
    expect(vm.torchSupported).toBe(true)
    expect(vm.zoomValue).toBe(2)
    expect(vm.zoomDisplay).toBe('2.0x')

    await vm.applyZoom(2.5)
    expect(videoTrack.applyConstraints).toHaveBeenCalled()
    expect(vm.zoomValue).toBe(2.5)

    await vm.toggleTorch()
    expect(vm.torchEnabled).toBe(true)

    vm.toggleMic()
    expect(vm.micEnabled).toBe(false)
    expect(audioTrack.enabled).toBe(false)
  })

  it('reports camera errors for unsupported or incomplete captures', async () => {
    setMediaDevices({
      getUserMedia: vi.fn().mockRejectedValue(new Error('boom')),
    } as unknown as MediaDevices)

    const errorWrapper = mountController()
    const errorVm = errorWrapper.vm as unknown as { errorMessage: string; isPreparing: boolean }

    await waitForIdle(() => !errorVm.isPreparing)
    expect(errorVm.errorMessage).toContain('cameraError')

    setMediaDevices({
      getUserMedia: vi.fn().mockResolvedValue(createStream()),
    } as unknown as MediaDevices)

    const notReadyWrapper = mountController()
    const notReadyVm = notReadyWrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
    }

    await waitForIdle(() => !notReadyVm.isPreparing)
    await notReadyVm.handleShutter()
    await flushPromises()

    expect(notReadyVm.errorMessage).toContain('cameraNotReady')

    const contextWrapper = mountController()
    const contextVm = contextWrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
    }
    const video = contextWrapper.find('video').element as HTMLVideoElement
    Object.defineProperty(video, 'videoWidth', { value: 640, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 480, configurable: true })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    await waitForIdle(() => !contextVm.isPreparing)
    await contextVm.handleShutter()
    await flushPromises()

    expect(contextVm.errorMessage).toContain('cameraError')
  })

  it('reports camera errors when photo blobs fail', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      handleShutter: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
    }

    const video = wrapper.find('video').element as HTMLVideoElement
    Object.defineProperty(video, 'videoWidth', { value: 640, configurable: true })
    Object.defineProperty(video, 'videoHeight', { value: 480, configurable: true })

    vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation((cb) => {
      cb?.(null)
    })

    await waitForIdle(() => !vm.isPreparing)
    await vm.handleShutter()
    await flushPromises()

    expect(vm.errorMessage).toContain('cameraError')
  })

  it('sets video not supported when recorder is unavailable', async () => {
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      setMode: (mode: 'photo' | 'video') => void
      errorMessage: string
      isPreparing: boolean
    }

    await waitForIdle(() => !vm.isPreparing)
    vm.setMode('video')

    expect(vm.errorMessage).toContain('videoNotSupported')
  })

  it('sets recordingFailed when the recorder emits an error', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      mode: 'photo' | 'video'
      handleShutter: () => Promise<void>
      errorMessage: string
      isPreparing: boolean
      isVideoMode: boolean
      isRecorderSupported: boolean
    }

    await waitForIdle(() => !vm.isPreparing)
    const internalMode = (
      wrapper.vm as unknown as { $: { setupState: { mode?: { value: string } } } }
    ).$?.setupState?.mode
    if (internalMode?.value !== undefined) {
      internalMode.value = 'video'
    } else {
      vm.mode = 'video'
    }
    await wrapper.vm.$nextTick()
    await waitForIdle(() => !vm.isPreparing)

    await vm.handleShutter()
    await flushPromises()

    expect(vm.isVideoMode).toBe(true)
    expect(vm.isRecorderSupported).toBe(true)
    expect(FakeMediaRecorder.instances.length).toBe(1)

    FakeMediaRecorder.instances[0]?.onerror?.()

    expect(vm.errorMessage).toContain('recordingFailed')
  })
})
