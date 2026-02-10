import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CameraViewfinderBottomBar from './CameraViewfinderBottomBar.vue'

const labels = {
  photoMode: 'Photo',
  videoMode: 'Video',
  videoNotSupported: 'Video not supported',
}

const mountBottomBar = (
  overrides: Partial<{
    mode: 'photo' | 'video'
    canSwitchMode: boolean
    isRecorderSupported: boolean
    shutterDisabled: boolean
    isRecording: boolean
  }> = {},
) =>
  mount(CameraViewfinderBottomBar, {
    props: {
      labels,
      mode: 'photo',
      canSwitchMode: true,
      isRecorderSupported: true,
      shutterDisabled: false,
      isRecording: false,
      ...overrides,
    },
    global: {
      stubs: {
        NText: { template: '<span><slot /></span>' },
      },
    },
  })

describe('CameraViewfinderBottomBar', () => {
  it('emits mode changes and shutter clicks', async () => {
    const wrapper = mountBottomBar()
    const buttons = wrapper.findAll('button')
    const photoButton = buttons[0]!
    const videoButton = buttons[1]!
    const shutterButton = buttons[2]!

    await photoButton.trigger('click')
    await videoButton.trigger('click')
    await shutterButton.trigger('click')

    expect(wrapper.emitted('set-mode')).toEqual([['photo'], ['video']])
    expect(wrapper.emitted('shutter')).toBeTruthy()

    const unsupportedWrapper = mountBottomBar({ isRecorderSupported: false })
    const unsupportedButtons = unsupportedWrapper.findAll('button')
    const unsupportedVideoButton = unsupportedButtons[1]!
    expect(unsupportedWrapper.text()).toContain(labels.videoNotSupported)
    expect(unsupportedVideoButton.attributes('disabled')).toBeDefined()
  })

  it('disables controls when switching is blocked', () => {
    const wrapper = mountBottomBar({ canSwitchMode: false, shutterDisabled: true })
    const buttons = wrapper.findAll('button')
    const photoButton = buttons[0]!
    const videoButton = buttons[1]!
    const shutterButton = buttons[2]!

    expect(photoButton.attributes('disabled')).toBeDefined()
    expect(videoButton.attributes('disabled')).toBeDefined()
    expect(shutterButton.attributes('disabled')).toBeDefined()
  })
})
