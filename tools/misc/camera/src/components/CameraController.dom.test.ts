import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import CameraController from './CameraController.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', () => ({
  useObjectUrl: () => ref('blob:mock'),
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
    applyConstraints: vi.fn(),
    getCapabilities: vi.fn(() => ({})),
    getSettings: vi.fn(() => ({})),
  } as unknown as MediaStreamTrack
  const audioTrack = { stop: vi.fn() } as unknown as MediaStreamTrack
  return {
    getTracks: () => [videoTrack, audioTrack],
    getVideoTracks: () => [videoTrack],
    getAudioTracks: () => [audioTrack],
  } as unknown as MediaStream
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static isTypeSupported = vi.fn((type: string) => type === 'video/webm')

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = options?.mimeType ?? 'video/webm'
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
    setMediaDevices({ getUserMedia: vi.fn().mockResolvedValue(createStream()) } as MediaDevices)
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
    if (typeof (vm as { setMode?: (mode: 'photo' | 'video') => void }).setMode === 'function') {
      ;(vm as { setMode: (mode: 'photo' | 'video') => void }).setMode('video')
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
    } as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as { permissionDenied: boolean }

    await flushPromises()

    expect(vm.permissionDenied).toBe(true)
    expect(wrapper.text()).toContain('cameraPermissionDenied')
  })
})
