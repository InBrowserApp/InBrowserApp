import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
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

  return {
    NGrid: makeStub('NGrid'),
    NGi: makeStub('NGi'),
    NSpin: makeStub('NSpin'),
    NCheckbox,
  }
})

describe('OptimizationOptions', () => {
  it('renders all option toggles', () => {
    const wrapper = mount(OptimizationOptions, {
      props: {
        options: {
          multipass: true,
          removeComments: true,
          removeMetadata: true,
          cleanupIds: true,
          convertColors: true,
          removeDimensions: false,
          inlineStyles: false,
        },
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

    expect(wrapper.findAllComponents({ name: 'NCheckbox' })).toHaveLength(7)
    expect(wrapper.findComponent({ name: 'NSpin' }).exists()).toBe(false)
  })

  it('updates bound options when toggles emit changes', async () => {
    const options = {
      multipass: true,
      removeComments: true,
      removeMetadata: true,
      cleanupIds: true,
      convertColors: true,
      removeDimensions: false,
      inlineStyles: false,
    }

    const wrapper = mount(OptimizationOptions, {
      props: {
        options,
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

    const updates = [false, false, false, false, false, true, true]
    const checkboxes = wrapper.findAllComponents({ name: 'NCheckbox' })
    checkboxes.forEach((checkbox, index) => {
      checkbox.vm.$emit('update:checked', updates[index])
    })

    await nextTick()

    expect(options).toEqual({
      multipass: false,
      removeComments: false,
      removeMetadata: false,
      cleanupIds: false,
      convertColors: false,
      removeDimensions: true,
      inlineStyles: true,
    })
  })

  it('shows a spinner when optimizing', () => {
    const wrapper = mount(OptimizationOptions, {
      props: {
        options: {
          multipass: true,
          removeComments: true,
          removeMetadata: true,
          cleanupIds: true,
          convertColors: true,
          removeDimensions: false,
          inlineStyles: false,
        },
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

    expect(wrapper.findComponent({ name: 'NSpin' }).exists()).toBe(true)
  })
})
