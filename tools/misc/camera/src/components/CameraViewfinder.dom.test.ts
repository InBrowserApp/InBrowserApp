import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CameraViewfinder from './CameraViewfinder.vue'

const coreLabels = {
  camera: 'Camera',
  cameraNotSupported: 'Camera not supported',
  cameraPermissionDenied: 'Permission denied',
  retryPermission: 'Retry',
  preparingCamera: 'Preparing camera',
}

const controlLabels = {
  torch: 'Torch',
  micOn: 'Mic on',
  micOff: 'Mic off',
  recording: 'REC',
  switchCamera: 'Flip',
  photoMode: 'Photo',
  videoMode: 'Video',
  videoNotSupported: 'Video not supported',
}

const CoreStub = {
  template: '<div><slot :labels="labels" /></div>',
  data: () => ({ labels: coreLabels }),
}

const ControlsStub = {
  template: '<div><slot :labels="labels" /></div>',
  data: () => ({ labels: controlLabels }),
}

const TopBarStub = {
  template:
    '<div><button data-testid="toggle-torch" @click="$emit(\'toggle-torch\')" />' +
    '<button data-testid="toggle-mic" @click="$emit(\'toggle-mic\')" />' +
    '<button data-testid="switch-camera" @click="$emit(\'switch-camera\')" /></div>',
}

const BottomBarStub = {
  template:
    '<div><button data-testid="set-video" @click="$emit(\'set-mode\', \'video\')" />' +
    '<button data-testid="shutter" @click="$emit(\'shutter\')" /></div>',
}

const ZoomBarStub = {
  template: '<button data-testid="zoom" @click="$emit(\'apply-zoom\', 2)" />',
}

const NButtonStub = {
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot /></button>',
}

const baseProps = {
  viewfinderAspectRatio: 1,
  isSupported: true,
  permissionDenied: false,
  errorMessage: '',
  isPreparing: false,
  torchSupported: false,
  torchEnabled: false,
  isVideoMode: false,
  micEnabled: true,
  isRecording: false,
  formattedDuration: '00:00',
  canSwitchMode: true,
  zoomSupported: false,
  zoomValue: 1,
  zoomMin: 1,
  zoomMax: 2,
  zoomStep: 0.5,
  zoomDisplay: '1.0x',
  outputBlob: null as Blob | null,
  outputKind: '' as 'photo' | 'video' | '',
  outputUrl: '',
  mode: 'photo' as 'photo' | 'video',
  shutterDisabled: false,
  isRecorderSupported: true,
}

const mountViewfinder = (overrides = {}) =>
  mount(CameraViewfinder, {
    props: {
      ...baseProps,
      ...overrides,
    },
    global: {
      stubs: {
        ToolSection: { template: '<section><slot /></section>' },
        ToolSectionHeader: { template: '<h3><slot /></h3>' },
        NButton: NButtonStub,
        CameraViewfinderLabelsCore: CoreStub,
        CameraViewfinderLabelsControls: ControlsStub,
        CameraViewfinderTopBar: TopBarStub,
        CameraViewfinderBottomBar: BottomBarStub,
        CameraViewfinderZoomBar: ZoomBarStub,
      },
    },
  })

describe('CameraViewfinder', () => {
  it('renders overlays for unsupported, permission denied, errors, and preparing states', async () => {
    expect(mountViewfinder({ isSupported: false }).text()).toContain(coreLabels.cameraNotSupported)

    const deniedWrapper = mountViewfinder({ permissionDenied: true })
    const retryButton = deniedWrapper
      .findAll('button')
      .find((button) => button.text() === coreLabels.retryPermission)

    expect(retryButton).toBeDefined()
    await retryButton!.trigger('click')
    expect(deniedWrapper.emitted('retry-permission')).toBeTruthy()

    expect(mountViewfinder({ errorMessage: 'Boom' }).text()).toContain('Boom')
    expect(mountViewfinder({ isPreparing: true }).text()).toContain(coreLabels.preparingCamera)
  })

  it('emits viewfinder actions and renders output previews', async () => {
    const wrapper = mountViewfinder({
      zoomSupported: true,
      outputBlob: new Blob(['photo']),
      outputKind: 'photo',
      outputUrl: 'blob:photo',
    })

    await wrapper.find('[data-testid="toggle-torch"]').trigger('click')
    await wrapper.find('[data-testid="toggle-mic"]').trigger('click')
    await wrapper.find('[data-testid="switch-camera"]').trigger('click')
    await wrapper.find('[data-testid="set-video"]').trigger('click')
    await wrapper.find('[data-testid="shutter"]').trigger('click')
    await wrapper.find('[data-testid="zoom"]').trigger('click')

    expect(wrapper.emitted('toggle-torch')).toBeTruthy()
    expect(wrapper.emitted('toggle-mic')).toBeTruthy()
    expect(wrapper.emitted('switch-camera')).toBeTruthy()
    expect(wrapper.emitted('set-mode')).toEqual([['video']])
    expect(wrapper.emitted('shutter')).toBeTruthy()
    expect(wrapper.emitted('apply-zoom')).toEqual([[2]])
    expect(wrapper.find('img').attributes('src')).toBe('blob:photo')
  })

  it('renders video thumbnails when output kind is video', () => {
    const wrapper = mountViewfinder({
      outputBlob: new Blob(['video']),
      outputKind: 'video',
      outputUrl: 'blob:video',
    })

    expect(wrapper.find('video').attributes('src')).toBe('blob:video')
  })
})
