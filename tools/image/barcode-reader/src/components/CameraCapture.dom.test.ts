import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const barcodeReaderMocks = vi.hoisted(() => ({
  decodeFromVideoDevice: vi.fn(),
  createBarcodeReader: vi.fn(),
  isIgnorableDecodeError: vi.fn(() => false),
  toBarcodeResult: vi.fn(() => ({ text: 'decoded', format: 'QR_CODE' })),
}))

vi.mock('../barcode-reader', () => ({
  createBarcodeReader: barcodeReaderMocks.createBarcodeReader,
  isIgnorableDecodeError: barcodeReaderMocks.isIgnorableDecodeError,
  toBarcodeResult: barcodeReaderMocks.toBarcodeResult,
}))

import { mount } from '@vue/test-utils'
import CameraCapture from './CameraCapture.vue'

const originalMediaDevices = navigator.mediaDevices

const setMediaDevices = (value: MediaDevices | undefined) => {
  Object.defineProperty(navigator, 'mediaDevices', {
    value,
    configurable: true,
  })
}

describe('CameraCapture', () => {
  beforeEach(() => {
    barcodeReaderMocks.decodeFromVideoDevice.mockReset()
    barcodeReaderMocks.createBarcodeReader.mockReset()
    barcodeReaderMocks.isIgnorableDecodeError.mockReset()
    barcodeReaderMocks.toBarcodeResult.mockReset()
    barcodeReaderMocks.createBarcodeReader.mockReturnValue({
      decodeFromVideoDevice: barcodeReaderMocks.decodeFromVideoDevice,
    })
    setMediaDevices({ getUserMedia: vi.fn() } as unknown as MediaDevices)
  })

  afterEach(() => {
    setMediaDevices(originalMediaDevices)
  })

  it('shows unsupported message when camera is unavailable', () => {
    setMediaDevices(undefined)

    const wrapper = mount(CameraCapture)
    expect(wrapper.text()).toContain('Camera is not supported in this browser')
  })

  it('emits decoded data when a code is found', async () => {
    const controls = { stop: vi.fn() }

    barcodeReaderMocks.decodeFromVideoDevice.mockImplementation((_id, _video, callback) => {
      callback({ getText: () => 'raw', getBarcodeFormat: () => 0 } as never, undefined)
      return Promise.resolve(controls)
    })

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startCamera()
    await wrapper.vm.$nextTick()

    expect(barcodeReaderMocks.createBarcodeReader).toHaveBeenCalled()
    expect(wrapper.emitted('decoded')?.[0]).toEqual([{ text: 'decoded', format: 'QR_CODE' }])
    expect(controls.stop).toHaveBeenCalled()
  })

  it('returns early when the video element is missing', async () => {
    setMediaDevices(undefined)
    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
    }

    await vm.startCamera()

    expect(barcodeReaderMocks.decodeFromVideoDevice).not.toHaveBeenCalled()
  })

  it('shows guidance text while scanning', async () => {
    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as { isScanning: boolean }

    vm.isScanning = true
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Point camera at a barcode or QR code')
  })

  it('emits an error when decoding fails', async () => {
    const controls = { stop: vi.fn() }

    barcodeReaderMocks.isIgnorableDecodeError.mockReturnValue(false)
    barcodeReaderMocks.decodeFromVideoDevice.mockImplementation((_id, _video, callback) => {
      callback(undefined, new Error('bad'))
      return Promise.resolve(controls)
    })

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startCamera()

    expect(wrapper.emitted('error')?.[0]).toEqual(['Failed to access camera'])
    expect(controls.stop).toHaveBeenCalled()
  })

  it('ignores non-fatal decode errors', async () => {
    const controls = { stop: vi.fn() }

    barcodeReaderMocks.isIgnorableDecodeError.mockReturnValue(true)
    barcodeReaderMocks.decodeFromVideoDevice.mockImplementation((_id, _video, callback) => {
      callback(undefined, new Error('temporary'))
      return Promise.resolve(controls)
    })

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startCamera()

    expect(wrapper.emitted('error')).toBeUndefined()
  })

  it('stops camera controls and media tracks', async () => {
    const controls = { stop: vi.fn() }

    barcodeReaderMocks.decodeFromVideoDevice.mockResolvedValue(controls)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      stopCamera: () => void
    }

    await vm.startCamera()

    const video = wrapper.find('video').element as HTMLVideoElement
    const trackStop = vi.fn()
    const stream = { getTracks: () => [{ stop: trackStop }] } as unknown as MediaStream
    Object.defineProperty(video, 'srcObject', {
      value: stream,
      writable: true,
    })

    vm.stopCamera()

    expect(controls.stop).toHaveBeenCalled()
    expect(trackStop).toHaveBeenCalled()
    expect(video.srcObject).toBeNull()
  })

  it('retries camera permissions on request', async () => {
    const controls = { stop: vi.fn() }

    barcodeReaderMocks.decodeFromVideoDevice.mockResolvedValue(controls)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      requestCamera: () => Promise<void>
      permissionDenied: boolean
    }

    vm.permissionDenied = true
    await wrapper.vm.$nextTick()

    await vm.requestCamera()

    expect(vm.permissionDenied).toBe(false)
    expect(barcodeReaderMocks.decodeFromVideoDevice).toHaveBeenCalled()
  })

  it('handles permission denied errors', async () => {
    const error = Object.assign(new Error('denied'), { name: 'NotAllowedError' })

    barcodeReaderMocks.decodeFromVideoDevice.mockRejectedValue(error)

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startCamera()

    const emittedError = wrapper.emitted('error')?.[0]?.[0]
    expect(String(emittedError).toLowerCase()).toContain('permission denied')
    expect(vm.permissionDenied).toBe(true)
  })

  it('emits a generic error for unexpected failures', async () => {
    barcodeReaderMocks.decodeFromVideoDevice.mockRejectedValue(new Error('boom'))

    const wrapper = mount(CameraCapture)
    const vm = wrapper.vm as unknown as {
      startCamera: () => Promise<void>
      permissionDenied: boolean
    }

    await vm.startCamera()

    expect(wrapper.emitted('error')?.[0]).toEqual(['Failed to access camera'])
    expect(vm.permissionDenied).toBe(false)
  })
})
