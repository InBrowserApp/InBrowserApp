import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NSwitch } from 'naive-ui'
import ScreenRecorderSettings from './ScreenRecorderSettings.vue'

describe('ScreenRecorderSettings', () => {
  it('emits v-model updates for both switches', async () => {
    const onUpdateSystemAudio = vi.fn()
    const onUpdateMicrophone = vi.fn()

    const wrapper = mount(ScreenRecorderSettings, {
      props: {
        settingsDisabled: false,
        isMicSupported: true,
        includeSystemAudio: true,
        includeMicrophone: false,
        'onUpdate:includeSystemAudio': onUpdateSystemAudio,
        'onUpdate:includeMicrophone': onUpdateMicrophone,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
        },
      },
    })

    const switches = wrapper.findAllComponents(NSwitch)
    expect(switches).toHaveLength(2)

    switches[0]?.vm.$emit('update:value', false)
    switches[1]?.vm.$emit('update:value', true)

    expect(onUpdateSystemAudio).toHaveBeenCalledWith(false)
    expect(onUpdateMicrophone).toHaveBeenCalledWith(true)
  })

  it('disables switches based on settings and microphone support', () => {
    const wrapper = mount(ScreenRecorderSettings, {
      props: {
        settingsDisabled: true,
        isMicSupported: false,
        includeSystemAudio: true,
        includeMicrophone: false,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h3><slot /></h3>' },
        },
      },
    })

    const switches = wrapper.findAllComponents(NSwitch)
    expect(switches).toHaveLength(2)
    expect(switches[0]?.props('disabled')).toBe(true)
    expect(switches[1]?.props('disabled')).toBe(true)
  })
})
