import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import ResizeOptionsPanel from './ResizeOptionsPanel.vue'
import type { ResizeOptions } from '../types'

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual<typeof import('naive-ui')>('naive-ui')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      props: [
        'value',
        'min',
        'max',
        'step',
        'disabled',
        'label',
        'options',
        'span',
        'showFeedback',
      ],
      emits: ['update:value', 'click'],
      template: '<div><slot /></div>',
    })

  return {
    ...actual,
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button @click="$emit(\'click\')"><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label', 'span', 'showFeedback'],
      template: '<div><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span><slot /></span>',
    }),
    NInputNumber: makeStub('NInputNumber'),
    NSelect: makeStub('NSelect'),
    NSlider: makeStub('NSlider'),
    NSwitch: makeStub('NSwitch'),
  }
})

const Host = defineComponent({
  components: { ResizeOptionsPanel },
  setup() {
    const options = ref<ResizeOptions>({
      width: 800,
      height: 400,
      keepAspectRatio: true,
      allowUpscale: true,
      algorithm: 'browser-high' as const,
      outputFormat: 'auto' as const,
      quality: 92,
    })

    return {
      options,
      algorithms: [{ label: 'Browser high quality', value: 'browser-high' }],
      formats: [{ label: 'Auto', value: 'auto' }],
    }
  },
  render() {
    return h(ResizeOptionsPanel, {
      options: this.options,
      'onUpdate:options': (value) => {
        this.options = value
      },
      sourceDimensions: { width: 800, height: 400 },
      algorithms: this.algorithms,
      formats: this.formats,
      allowUpscaleLabel: 'Allow enlarging beyond original size',
      maxDimension: 4096,
      qualityDisabled: true,
      isProcessing: false,
      hasImage: true,
    })
  },
})

describe('ResizeOptionsPanel', () => {
  it('passes input limits and disables quality when requested', () => {
    const wrapper = mount(Host, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          AlgorithmInfoPopover: { template: '<span class="algo-help" />' },
        },
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    expect(inputs[0]?.props('max')).toBe(4096)
    expect(inputs[1]?.props('max')).toBe(4096)
    expect(wrapper.findComponent({ name: 'NSlider' }).props('disabled')).toBe(true)
  })

  it('updates the bound model when the allow upscale switch changes', async () => {
    const wrapper = mount(Host, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          AlgorithmInfoPopover: { template: '<span class="algo-help" />' },
        },
      },
    })

    const switches = wrapper.findAllComponents({ name: 'NSwitch' })
    await switches[1]?.vm.$emit('update:value', false)
    await nextTick()

    expect((wrapper.vm as { options: { allowUpscale: boolean } }).options.allowUpscale).toBe(false)
  })
})
