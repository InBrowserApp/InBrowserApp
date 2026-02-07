import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CameraCapture from './CameraCapture.vue'
import { readQRFromVideo } from '../qr-reader'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('../qr-reader', () => ({
  readQRFromVideo: vi.fn(),
}))

const originalMediaDevices = navigator.mediaDevices

const setMediaDevices = (value: MediaDevices | undefined) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  })
}

describe('CameraCapture', () => {
  let playSpy: ReturnType<typeof vi.spyOn>
  let requestAnimationFrameMock: ReturnType<typeof vi.fn>
  let cancelAnimationFrameMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.mocked(readQRFromVideo).mockReset()
    setMediaDevices({ getUserMedia: vi.fn() } as unknown as MediaDevices)
    playSpy = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
    requestAnimationFrameMock = vi.fn(() => 1)
    cancelAnimationFrameMock = vi.fn()
    vi.stubGlobal('requestAnimationFrame', requestAnimationFrameMock)
    vi.stubGlobal('cancelAnimationFrame', cancelAnimationFrameMock)
  })

  afterEach(() => {
    playSpy.mockRestore()
    setMediaDevices(originalMediaDevices)
    vi.unstubAllGlobals()
  })

  it('shows a warning when the camera is unsupported', () => {
    setMediaDevices(undefined)

    const wrapper = mount(CameraCapture)

    expect(wrapper.text()).toContain('cameraNotSupported')
  })

  it('returns early when the video element is unavailable', async () => {
    const getUserMedia = vi.fn()
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      videoRef: HTMLVideoElement | undefined
    }

    vm.videoRef = undefined
    await vm.startCamera()

    expect(getUserMedia).not.toHaveBeenCalled()
  })

  it('retries permission and starts scanning successfully', async () => {
    const trackStop = vi.fn()
    const stream = { getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream
    const getUserMedia = vi.fn().mockResolvedValue(stream)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      requestCamera: () => Promise<void>
      scanLoop: () => void
      stopCamera: () => void
      isScanning: boolean
      permissionDenied: boolean
    }
    const video = wrapper.find('video').element as HTMLVideoElement

    Object.defineProperty(video, 'srcObject', {
      value: null,
      writable: true,
    })

    vm.permissionDenied = true
    await vm.requestCamera()

    expect(getUserMedia).toHaveBeenCalledTimes(1)
    expect(vm.permissionDenied).toBe(false)
    expect(vm.isScanning).toBe(true)
    expect(video.srcObject).toBe(stream)

    requestAnimationFrameMock.mockClear()
    vm.isScanning = false
    vm.scanLoop()

    expect(requestAnimationFrameMock).not.toHaveBeenCalled()

    vm.stopCamera()
    expect(trackStop).toHaveBeenCalled()
  })

  it('emits decoded data and stops the camera when a QR code is found', async () => {
    const trackStop = vi.fn()
    const stream = { getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream
    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      scanLoop: () => void
      isScanning: boolean
      videoRef: HTMLVideoElement | undefined
    }
    const video = wrapper.find('video').element as HTMLVideoElement

    Object.defineProperty(video, 'srcObject', {
      value: stream,
      writable: true,
    })

    vm.videoRef = video
    vm.isScanning = true
    vi.mocked(readQRFromVideo).mockReturnValue('payload')

    await nextTick()
    vm.scanLoop()
    await nextTick()

    expect(wrapper.emitted('decoded')?.[0]).toEqual(['payload'])
    expect(trackStop).toHaveBeenCalled()
    expect(video.srcObject).toBeNull()
  })

  it('handles permission denied errors', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })
    const getUserMedia = vi.fn().mockRejectedValue(error)
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await wrapper.vm.$nextTick()
    await vm.startCamera()

    expect(wrapper.emitted('error')?.[0]).toEqual(['cameraPermissionDenied'])
    expect(vm.permissionDenied).toBe(true)
  })

  it('emits a generic error for unexpected failures', async () => {
    const getUserMedia = vi.fn().mockRejectedValue(new Error('boom'))
    setMediaDevices({ getUserMedia } as unknown as MediaDevices)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await wrapper.vm.$nextTick()
    await vm.startCamera()

    expect(wrapper.emitted('error')?.[0]).toEqual(['cameraError'])
    expect(vm.permissionDenied).toBe(false)
  })

  it('cancels animation frames and stops tracks when scanning is stopped', async () => {
    const trackStop = vi.fn()
    const stream = { getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream
    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      scanLoop: () => void
      stopCamera: () => void
      isScanning: boolean
      videoRef: HTMLVideoElement | undefined
    }
    const video = wrapper.find('video').element as HTMLVideoElement

    Object.defineProperty(video, 'srcObject', {
      value: stream,
      writable: true,
    })

    vm.videoRef = video
    vm.isScanning = true
    vi.mocked(readQRFromVideo).mockReturnValue(null)

    await nextTick()
    vm.scanLoop()
    vm.stopCamera()

    expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1)
    expect(trackStop).toHaveBeenCalled()
  })
})
