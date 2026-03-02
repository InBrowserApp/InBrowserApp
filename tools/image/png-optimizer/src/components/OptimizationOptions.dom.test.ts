import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import OptimizationOptions from './OptimizationOptions.vue'
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
    template: '<button @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NText: makeStub('NText'),
    NIcon: makeStub('NIcon'),
    NSlider,
    NCheckbox,
    NButton,
  }
})
const mountOptions = (isOptimizing = false) =>
  mount(OptimizationOptions, {
    props: {
      options: { level: 2, interlace: false, optimiseAlpha: true },
      isOptimizing,
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
describe('OptimizationOptions', () => {
  it('renders slider and emits optimize', async () => {
    const wrapper = mountOptions(false)
    const slider = wrapper.findComponent({ name: 'NSlider' })
    expect(slider.props('min')).toBe(0)
    expect(slider.props('max')).toBe(6)
    expect(slider.props('step')).toBe(1)
    expect(Object.keys(slider.props('marks') as Record<string, string>)).toContain('6')
    await wrapper.findComponent({ name: 'NButton' }).vm.$emit('click')
    expect(wrapper.emitted('optimize')).toBeTruthy()
  })
  it('updates options through slider and checkbox models', async () => {
    const wrapper = mountOptions(false)
    await wrapper.findComponent({ name: 'NSlider' }).vm.$emit('update:value', 5)
    await nextTick()
    const checkboxes = wrapper.findAllComponents({ name: 'NCheckbox' })
    await checkboxes[0]?.vm.$emit('update:checked', true)
    await checkboxes[1]?.vm.$emit('update:checked', false)
    await nextTick()
    const slider = wrapper.findComponent({ name: 'NSlider' })
    expect(slider.props('value')).toBe(5)
    const updatedCheckboxes = wrapper.findAllComponents({ name: 'NCheckbox' })
    expect(updatedCheckboxes[0]?.props('checked')).toBe(true)
    expect(updatedCheckboxes[1]?.props('checked')).toBe(false)
  })
  it('shows optimizing state', () => {
    const wrapper = mountOptions(true)
    const button = wrapper.findComponent({ name: 'NButton' })
    expect(button.props('loading')).toBe(true)
    expect(button.props('disabled')).toBe(true)
    expect(wrapper.text()).toContain('Optimizing...')
  })
})
