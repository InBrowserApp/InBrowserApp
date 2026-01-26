import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AudioRecorderController from './AudioRecorderController.vue'

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

describe('AudioRecorderController', () => {
  beforeEach(() => {
    FakeMediaRecorder.instances = []
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
    vi.restoreAllMocks()
  })

  it('shows unsupported message when recording is unavailable', () => {
    setMediaDevices(undefined)
    vi.stubGlobal('MediaRecorder', undefined)

    const wrapper = mount(AudioRecorderController, {
      global: {
        stubs: {
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
        },
      },
    })

    expect(wrapper.text()).toContain('notSupported')
  })

  it('starts and stops recording with a blob', async () => {
    const stopTrack = vi.fn()
    const stream = { getTracks: () => [{ stop: stopTrack }] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(AudioRecorderController, {
      global: {
        stubs: {
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
        },
      },
    })

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

  it('handles permission denied errors', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    const getUserMedia = vi.fn().mockRejectedValue(error)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(AudioRecorderController, {
      global: {
        stubs: {
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
        },
      },
    })

    const vm = wrapper.vm as unknown as {
      startRecording: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startRecording()

    expect(vm.permissionDenied).toBe(true)
  })

  it('pauses and resumes recording', async () => {
    const stream = { getTracks: () => [] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(AudioRecorderController, {
      global: {
        stubs: {
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
        },
      },
    })

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
})
