import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AudioRecorderController from './AudioRecorderController.vue'

const recorderUtils = vi.hoisted(() => ({
  getSupportedMimeType: vi.fn(),
}))

vi.mock('../utils/recorder', async () => {
  const actual = await vi.importActual<typeof import('../utils/recorder')>('../utils/recorder')
  return {
    ...actual,
    getSupportedMimeType: (...args: unknown[]) => recorderUtils.getSupportedMimeType(...args),
  }
})

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

const setMediaDevices = (value: MediaDevices | undefined) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  })
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = []
  static isTypeSupported = vi.fn((type: string) => type === 'audio/webm')

  state: RecordingState = 'inactive'
  mimeType: string
  ondataavailable: ((event: BlobEvent) => void) | null = null
  onstop: (() => void) | null = null
  onstart: (() => void) | null = null
  onpause: (() => void) | null = null
  onresume: (() => void) | null = null

  constructor(_stream: MediaStream, options?: MediaRecorderOptions) {
    this.mimeType = options?.mimeType ?? 'audio/webm'
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
  NTag: { template: '<span><slot /></span>' },
  NText: { template: '<span><slot /></span>' },
}

const mountController = () =>
  mount(AudioRecorderController, {
    global: {
      stubs: globalStubs,
    },
  })

describe('AudioRecorderController', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = []
    FakeMediaRecorder.isTypeSupported.mockReset()
    FakeMediaRecorder.isTypeSupported.mockImplementation((type: string) => type === 'audio/webm')
    recorderUtils.getSupportedMimeType.mockReset()
    recorderUtils.getSupportedMimeType.mockReturnValue('audio/webm')

    setMediaDevices({ getUserMedia: vi.fn() } as unknown as MediaDevices)
    vi.stubGlobal('MediaRecorder', FakeMediaRecorder)
  })

  afterEach(() => {
    setMediaDevices(originalMediaDevices)
    if (originalMediaRecorder) {
      vi.stubGlobal('MediaRecorder', originalMediaRecorder)
    } else {
      vi.stubGlobal('MediaRecorder', undefined)
    }
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows unsupported message when recording is unavailable', () => {
    setMediaDevices(undefined)
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mountController()

    expect(wrapper.text()).toContain('notSupported')
  })

  it('starts and stops recording with a blob', async () => {
    const stopTrack = vi.fn()
    const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()

    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      recordingBlob: Blob | null
    }

    await vm.startRecording()
    expect(getUserMedia).toHaveBeenCalled()
    expect(FakeMediaRecorder.instances.length).toBe(1)

    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(stopTrack).toHaveBeenCalled()
    expect(vm.recordingBlob).toBeInstanceOf(Blob)
  })

  it('returns early when preparing, already recording, or controls are unavailable', async () => {
    const getUserMedia = vi
      .fn()
      .mockResolvedValue({ getTracks: () => [] } as unknown as MediaStream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      pauseRecording: () => void
      resumeRecording: () => void
      stopRecording: () => void
      isPreparing: boolean
      recorderState: 'inactive' | 'recording' | 'paused'
    }

    vm.isPreparing = true
    await vm.startRecording()
    expect(getUserMedia).not.toHaveBeenCalled()

    vm.isPreparing = false
    vm.recorderState = 'recording'
    await vm.startRecording()
    expect(getUserMedia).not.toHaveBeenCalled()

    vm.pauseRecording()
    vm.resumeRecording()
    vm.stopRecording()

    expect(FakeMediaRecorder.instances).toHaveLength(0)
  })

  it('handles permission denied errors', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    const getUserMedia = vi.fn().mockRejectedValue(error)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()

    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(vm.permissionDenied).toBe(true)
    expect(wrapper.text()).toContain('permissionDenied')
    expect(wrapper.text()).toContain('retryPermission')
  })

  it('falls back to plain MediaRecorder when options constructor fails', async () => {
    class ThrowOnOptionsRecorder extends FakeMediaRecorder {
      constructor(stream: MediaStream, options?: MediaRecorderOptions) {
        if (options?.mimeType) {
          throw new Error('options not supported')
        }
        super(stream, options)
      }
    }

    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)
    vi.stubGlobal('MediaRecorder', ThrowOnOptionsRecorder as unknown as typeof MediaRecorder)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      mediaRecorder: MediaRecorder | null
    }

    await vm.startRecording()

    expect(vm.mediaRecorder).toBeTruthy()
    expect(getUserMedia).toHaveBeenCalledTimes(1)
  })

  it('handles empty chunks and propagates output file-name updates', async () => {
    class EmptyChunkRecorder extends FakeMediaRecorder {
      stop = vi.fn(() => {
        this.state = 'inactive'
        this.ondataavailable?.({
          data: new Blob([], { type: this.mimeType }),
        } as BlobEvent)
        this.onstop?.()
      })
    }

    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)
    vi.stubGlobal('MediaRecorder', EmptyChunkRecorder as unknown as typeof MediaRecorder)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      fileName: string
      recordingBlob: Blob | null
    }

    await vm.startRecording()
    vm.stopRecording()
    await wrapper.vm.$nextTick()

    const output = wrapper.findComponent({ name: 'AudioRecorderOutput' })
    expect(output.exists()).toBe(true)

    output.vm.$emit('update:fileName', 'renamed')
    await wrapper.vm.$nextTick()

    expect(vm.fileName).toBe('renamed')
    expect(vm.recordingBlob).toBeInstanceOf(Blob)
    expect(vm.recordingBlob?.size).toBe(0)
  })

  it('uses a fallback mime value when preferred type is unavailable', async () => {
    class EmptyTypeRecorder extends FakeMediaRecorder {
      constructor(stream: MediaStream, options?: MediaRecorderOptions) {
        super(stream, options)
        this.mimeType = ''
      }
    }

    recorderUtils.getSupportedMimeType.mockReturnValue(undefined)

    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)
    vi.stubGlobal('MediaRecorder', EmptyTypeRecorder as unknown as typeof MediaRecorder)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      stopRecording: () => void
      mimeType: string
    }

    await vm.startRecording()
    vm.mimeType = 'invalid type'
    vm.stopRecording()
    await wrapper.vm.$nextTick()

    expect(vm.mimeType).toBe('invalid type')
  })

  it('shows resume control when paused', async () => {
    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()

    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      pauseRecording: () => void
    }

    await vm.startRecording()

    vm.pauseRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('resume')
  })

  it('pauses and resumes recording', async () => {
    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()

    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      pauseRecording: () => void
      resumeRecording: () => void
    }

    await vm.startRecording()

    vm.pauseRecording()
    vm.resumeRecording()

    const recorder = FakeMediaRecorder.instances[0]
    expect(recorder?.pause).toHaveBeenCalled()
    expect(recorder?.resume).toHaveBeenCalled()
  })

  it('keeps existing recording when start fails', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new Error('boom'))
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      recordingBlob: Blob | null
      mimeType: string
      fileName: string
      elapsedMs: number
    }

    const existingBlob = new Blob(['old'], { type: 'audio/webm' })
    vm.recordingBlob = existingBlob
    vm.mimeType = 'audio/webm'
    vm.fileName = 'existing'
    vm.elapsedMs = 1200

    await wrapper.vm.$nextTick()
    await vm.startRecording()
    await wrapper.vm.$nextTick()

    expect(vm.recordingBlob).not.toBeNull()
    expect(vm.recordingBlob?.size).toBe(existingBlob.size)
    expect(vm.recordingBlob?.type).toBe(existingBlob.type)
    expect(vm.mimeType).toBe('audio/webm')
    expect(vm.fileName).toBe('existing')
    expect(vm.elapsedMs).toBe(1200)
    expect(wrapper.text()).toContain('recordingFailed')
  })

  it('renders output details and clears recording', async () => {
    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      recordingBlob: Blob | null
      mimeType: string
      fileName: string
      clearRecording: () => void
    }

    vm.recordingBlob = new Blob(['data'], { type: 'audio/webm' })
    vm.mimeType = 'audio/webm'
    vm.fileName = 'demo'
    await wrapper.vm.$nextTick()

    expect(wrapper.find('audio').exists()).toBe(true)
    expect(wrapper.text()).toContain('download')
    expect(wrapper.text()).toContain('clear')

    vm.clearRecording()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('audio').exists()).toBe(false)
  })

  it('updates elapsed time while recording', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'))

    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      elapsedMs: number
    }

    await vm.startRecording()
    vi.advanceTimersByTime(400)
    await wrapper.vm.$nextTick()

    expect(vm.elapsedMs).toBeGreaterThan(0)
  })

  it('stops recorder and stream during unmount when still active', async () => {
    const stopTrack = vi.fn()
    const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mountController()
    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
    }

    await vm.startRecording()

    const recorder = FakeMediaRecorder.instances[0]
    wrapper.unmount()

    expect(recorder?.stop).toHaveBeenCalled()
    expect(stopTrack).toHaveBeenCalled()
  })
})
