import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CameraViewfinderTopBar from './CameraViewfinderTopBar.vue'

const labels = {
  torch: 'Torch',
  micOn: 'Mic on',
  micOff: 'Mic off',
  recording: 'REC',
  switchCamera: 'Flip',
}

const NButtonStub = {
  inheritAttrs: false,
  props: ['disabled'],
  emits: ['click'],
  template:
    '<button v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
}

const mountTopBar = (
  overrides: Partial<{
    torchSupported: boolean
    torchEnabled: boolean
    isVideoMode: boolean
    micEnabled: boolean
    isRecording: boolean
    formattedDuration: string
    canSwitchMode: boolean
  }> = {},
) =>
  mount(CameraViewfinderTopBar, {
    props: {
      labels,
      torchSupported: false,
      torchEnabled: false,
      isVideoMode: false,
      micEnabled: true,
      isRecording: false,
      formattedDuration: '00:00',
      canSwitchMode: true,
      ...overrides,
    },
    global: {
      stubs: {
        NButton: NButtonStub,
        NIcon: { template: '<span />' },
      },
    },
  })

describe('CameraViewfinderTopBar', () => {
  it('renders torch and mic buttons and emits actions', async () => {
    const wrapper = mountTopBar({ torchSupported: true, isVideoMode: true })

    await wrapper.find('button[aria-label="Torch"]').trigger('click')
    await wrapper.find('button[aria-label="Mic on"]').trigger('click')
    await wrapper.find('button[aria-label="Flip"]').trigger('click')

    expect(wrapper.emitted('toggle-torch')).toBeTruthy()
    expect(wrapper.emitted('toggle-mic')).toBeTruthy()
    expect(wrapper.emitted('switch-camera')).toBeTruthy()
  })

  it('uses the mic-off label when microphone input is disabled', async () => {
    const wrapper = mountTopBar({
      torchSupported: true,
      torchEnabled: true,
      isVideoMode: true,
      micEnabled: false,
    })

    const micButton = wrapper.find('button[aria-label="Mic off"]')
    expect(micButton.exists()).toBe(true)

    await micButton.trigger('click')
    expect(wrapper.emitted('toggle-mic')).toBeTruthy()
  })

  it('shows recording status and disables switching', () => {
    const wrapper = mountTopBar({
      isRecording: true,
      formattedDuration: '00:07',
      canSwitchMode: false,
    })

    expect(wrapper.text()).toContain(labels.recording)
    expect(wrapper.text()).toContain('00:07')
    expect(wrapper.find('button[aria-label="Flip"]').attributes('disabled')).toBeDefined()
  })
})
