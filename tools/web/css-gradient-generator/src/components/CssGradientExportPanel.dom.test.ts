import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientExportPanel from './CssGradientExportPanel.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
    },
    emits: ['click'],
    template:
      '<component :is="tag" v-bind="$attrs" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></component>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<input />',
  })

  return {
    NAlert: makeStub('NAlert'),
    NButton,
    NCard: makeStub('NCard'),
    NFlex: makeStub('NFlex'),
    NIcon: makeStub('NIcon'),
    NInputNumber,
  }
})

describe('CssGradientExportPanel', () => {
  it('emits size updates and download events', async () => {
    const wrapper = mount(CssGradientExportPanel, {
      props: {
        exportWidth: 800,
        exportHeight: 600,
        pngUrl: 'blob:png',
        svgUrl: 'blob:svg',
        isExportingPng: false,
        showError: true,
      },
    })

    expect(wrapper.find('[data-testid="export-error"]').exists()).toBe(true)

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const widthInput = inputs[0]
    const heightInput = inputs[1]
    if (!widthInput || !heightInput) {
      throw new Error('Expected width and height inputs')
    }
    widthInput.vm.$emit('update:value', 300)
    heightInput.vm.$emit('update:value', 400)

    expect(wrapper.emitted('update:exportWidth')?.[0]).toEqual([300])
    expect(wrapper.emitted('update:exportHeight')?.[0]).toEqual([400])

    widthInput.vm.$emit('update:value', null)
    heightInput.vm.$emit('update:value', null)
    expect(wrapper.emitted('update:exportWidth')?.length).toBe(1)
    expect(wrapper.emitted('update:exportHeight')?.length).toBe(1)

    await wrapper.get('[data-testid="download-png"]').trigger('click')
    expect(wrapper.emitted('download-png')).toBeTruthy()
    expect(wrapper.get('[data-testid="download-svg"]').attributes('href')).toBe('blob:svg')
  })

  it('omits the svg href when no export URL is available', () => {
    const wrapper = mount(CssGradientExportPanel, {
      props: {
        exportWidth: 800,
        exportHeight: 600,
        pngUrl: 'blob:png',
        svgUrl: undefined,
        isExportingPng: false,
        showError: false,
      },
    })

    expect(wrapper.get('[data-testid="download-svg"]').attributes('href')).toBeUndefined()
  })
})
