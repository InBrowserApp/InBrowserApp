import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { NSwitch } from 'naive-ui'
import ColorPickerOutputSection from './ColorPickerOutputSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

describe('ColorPickerOutputSection', () => {
  it('emits show-alpha updates from the switch', async () => {
    const onUpdateShowAlpha = vi.fn()
    const wrapper = mount(ColorPickerOutputSection, {
      props: {
        showAlpha: true,
        cssColor: 'rgba(10, 20, 30, 0.4)',
        pickedSource: 'screen',
        hexValue: '#0A141E66',
        rgbValue: 'rgba(10, 20, 30, 0.4)',
        hslValue: 'hsla(210, 50%, 8%, 0.4)',
        hsvValue: 'hsva(210, 67%, 12%, 0.4)',
        cmykValue: '67%, 33%, 0%, 88%',
        alphaValue: '40%',
        'onUpdate:showAlpha': onUpdateShowAlpha,
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ColorPickerOutputFields: { template: '<div data-testid="output-fields" />' },
        },
      },
    })

    wrapper.findComponent(NSwitch).vm.$emit('update:value', false)
    await wrapper.vm.$nextTick()

    expect(onUpdateShowAlpha).toHaveBeenCalledWith(false)
    expect(wrapper.text()).toContain('sourceScreen')
  })

  it('shows fallback source text when no source is picked', () => {
    const wrapper = mount(ColorPickerOutputSection, {
      props: {
        showAlpha: false,
        cssColor: 'rgb(0, 0, 0)',
        pickedSource: null,
        hexValue: '#000000',
        rgbValue: 'rgb(0, 0, 0)',
        hslValue: 'hsl(0, 0%, 0%)',
        hsvValue: 'hsv(0, 0%, 0%)',
        cmykValue: '0%, 0%, 0%, 100%',
        alphaValue: '100%',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ColorPickerOutputFields: { template: '<div data-testid="output-fields" />' },
        },
      },
    })

    expect(wrapper.text()).toContain('sourceUnknown')
  })
})
