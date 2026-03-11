import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: { name: 'ToolSection', template: '<section><slot /></section>' },
  ToolSectionHeader: { name: 'ToolSectionHeader', template: '<h2><slot /></h2>' },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const passthrough = (name: string, tag = 'div') =>
    defineComponent({
      name,
      props: {
        disabled: {
          type: Boolean,
          default: false,
        },
        value: {
          type: [String, Number, Object],
          default: null,
        },
        label: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value', 'click'],
      setup(props, { slots, emit }) {
        return () =>
          h(
            tag,
            {
              'data-name': name,
              'data-disabled': String(props.disabled),
              'data-value': props.value == null ? '' : String(props.value),
              'data-label': props.label,
              onClick: () => emit('click'),
            },
            [slots.icon?.(), slots.default?.()],
          )
      },
    })

  return {
    NButton: passthrough('NButton', 'button'),
    NColorPicker: passthrough('NColorPicker'),
    NFormItemGi: passthrough('NFormItemGi'),
    NGrid: passthrough('NGrid'),
    NIcon: passthrough('NIcon', 'i'),
    NInputNumber: passthrough('NInputNumber'),
    NSelect: passthrough('NSelect'),
    NSlider: passthrough('NSlider'),
    NStatistic: defineComponent({
      name: 'NStatistic',
      props: {
        label: {
          type: String,
          default: '',
        },
        value: {
          type: String,
          default: '',
        },
      },
      setup(props) {
        return () => h('div', { 'data-stat': props.label }, props.value)
      },
    }),
  }
})

import { mount } from '@vue/test-utils'
import CropSettingsPanel from './CropSettingsPanel.vue'
import type { ExportOptions } from '../types'

const baseOptions: ExportOptions = {
  format: 'original',
  quality: 92,
  background: '#ffffff',
  targetWidth: null,
  targetHeight: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('CropSettingsPanel', () => {
  it('renders crop and export statistics', () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: baseOptions,
        cropWidth: 1200,
        cropHeight: 800,
        sourceMimeType: 'image/png',
        sourceHasAlpha: true,
        isProcessing: false,
        canCrop: true,
      },
    })

    expect(wrapper.text()).toContain('1200 × 800')
    expect(wrapper.text()).toContain('Crop image')
    expect(wrapper.findComponent({ name: 'NColorPicker' }).exists()).toBe(false)
    expect(wrapper.getComponent({ name: 'NSlider' }).attributes('data-disabled')).toBe('true')
  })

  it('updates the export format and reveals the jpeg background control when needed', async () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: baseOptions,
        cropWidth: 1200,
        cropHeight: 800,
        sourceMimeType: 'image/png',
        sourceHasAlpha: true,
        isProcessing: false,
        canCrop: true,
      },
    })

    wrapper.getComponent({ name: 'NSelect' }).vm.$emit('update:value', 'jpeg')
    const updatedOptions = wrapper.emitted('update:exportOptions')?.[0]?.[0] as ExportOptions

    expect(updatedOptions).toEqual({
      ...baseOptions,
      format: 'jpeg',
    })

    await wrapper.setProps({ exportOptions: updatedOptions })
    expect(wrapper.findComponent({ name: 'NColorPicker' }).exists()).toBe(true)
    expect(wrapper.getComponent({ name: 'NSlider' }).attributes('data-disabled')).toBe('false')

    wrapper.getComponent({ name: 'NColorPicker' }).vm.$emit('update:value', '#101010')
    expect(wrapper.emitted('update:exportOptions')?.[1]?.[0]).toEqual({
      ...updatedOptions,
      background: '#101010',
    })
  })

  it('clamps quality updates and keeps target dimensions in sync', () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: baseOptions,
        cropWidth: 1200,
        cropHeight: 800,
        sourceMimeType: 'image/jpeg',
        sourceHasAlpha: false,
        isProcessing: false,
        canCrop: true,
      },
    })

    wrapper.getComponent({ name: 'NSlider' }).vm.$emit('update:value', 150)
    expect(wrapper.emitted('update:exportOptions')?.[0]?.[0]).toEqual({
      ...baseOptions,
      quality: 100,
    })

    wrapper.getComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 300)
    expect(wrapper.emitted('update:exportOptions')?.[1]?.[0]).toEqual({
      ...baseOptions,
      quality: 100,
      targetWidth: 300,
      targetHeight: 200,
    })

    const heightInput = wrapper.findAllComponents({ name: 'NInputNumber' })[1]
    heightInput!.vm.$emit('update:value', null)
    expect(wrapper.emitted('update:exportOptions')?.[2]?.[0]).toEqual({
      ...baseOptions,
      quality: 100,
      targetWidth: null,
      targetHeight: null,
    })

    heightInput!.vm.$emit('update:value', 100)
    expect(wrapper.emitted('update:exportOptions')?.[3]?.[0]).toEqual({
      ...baseOptions,
      quality: 100,
      targetWidth: 150,
      targetHeight: 100,
    })
  })

  it('clears target dimensions when the width input is emptied', () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: {
          ...baseOptions,
          targetWidth: 300,
          targetHeight: 200,
        },
        cropWidth: 1200,
        cropHeight: 800,
        sourceMimeType: 'image/jpeg',
        sourceHasAlpha: false,
        isProcessing: false,
        canCrop: true,
      },
    })

    wrapper.getComponent({ name: 'NInputNumber' }).vm.$emit('update:value', null)

    expect(wrapper.emitted('update:exportOptions')?.[0]?.[0]).toEqual({
      ...baseOptions,
      targetWidth: null,
      targetHeight: null,
    })
  })

  it('ignores invalid format updates', () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: baseOptions,
        cropWidth: 800,
        cropHeight: 400,
        sourceMimeType: 'image/png',
        sourceHasAlpha: true,
        isProcessing: false,
        canCrop: true,
      },
    })

    wrapper.getComponent({ name: 'NSelect' }).vm.$emit('update:value', 42)
    wrapper.getComponent({ name: 'NSelect' }).vm.$emit('update:value', 'gif')

    expect(wrapper.emitted('update:exportOptions')).toBeUndefined()
  })

  it('emits crop requests from the primary action button', async () => {
    const wrapper = mount(CropSettingsPanel, {
      props: {
        exportOptions: baseOptions,
        cropWidth: 500,
        cropHeight: 500,
        sourceMimeType: 'image/png',
        sourceHasAlpha: true,
        isProcessing: false,
        canCrop: true,
      },
    })

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('crop')).toHaveLength(1)
  })
})
