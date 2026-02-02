import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OptimizationOptions from './OptimizationOptions.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
      step: {
        type: Number,
        default: 1,
      },
      marks: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template: '<div><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template: '<button @click="$emit(\'click\')"><slot /></button>',
  })

  return {
    NFlex: makeStub('NFlex'),
    NText: makeStub('NText'),
    NIcon: makeStub('NIcon'),
    NSlider,
    NCheckbox,
    NButton,
  }
})

describe('OptimizationOptions', () => {
  it('renders slider and emits optimize', async () => {
    const wrapper = mount(OptimizationOptions, {
      props: {
        options: { level: 2, interlace: false, optimiseAlpha: true },
        isOptimizing: false,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    const slider = wrapper.findComponent({ name: 'NSlider' })
    expect(slider.props('min')).toBe(0)
    expect(slider.props('max')).toBe(6)
    expect(slider.props('step')).toBe(1)
    expect(Object.keys(slider.props('marks') as Record<string, string>)).toContain('6')

    await wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')
    expect(wrapper.emitted('optimize')).toBeTruthy()
  })

  it('shows optimizing state', () => {
    const wrapper = mount(OptimizationOptions, {
      props: {
        options: { level: 2, interlace: false, optimiseAlpha: true },
        isOptimizing: true,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
        },
      },
    })

    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('loading')).toBe(true)
    expect(button.props('disabled')).toBe(true)
    expect(wrapper.text()).toContain('optimizing')
  })
})
