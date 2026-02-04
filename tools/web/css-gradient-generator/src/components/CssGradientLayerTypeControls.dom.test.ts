import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientLayerTypeControls from './CssGradientLayerTypeControls.vue'

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

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div />',
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

  const NSlider = defineComponent({
    name: 'NSlider',
    props: {
      value: {
        type: Number,
        default: 0,
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })

  return {
    NFlex: makeStub('NFlex'),
    NInputNumber,
    NSelect,
    NSlider,
  }
})

describe('CssGradientLayerTypeControls', () => {
  it('toggles rows based on layer type and emits updates', async () => {
    const wrapper = mount(CssGradientLayerTypeControls, {
      props: {
        layerType: 'linear',
        layerAngle: 45,
        layerCenterX: 50,
        layerCenterY: 50,
      },
    })

    expect(wrapper.text()).toContain('angle')
    expect(wrapper.text()).not.toContain('centerX')

    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'radial')
    expect(wrapper.emitted('update:layerType')?.[0]).toEqual(['radial'])

    await wrapper.setProps({ layerType: 'radial' })
    expect(wrapper.text()).toContain('centerX')
    expect(wrapper.text()).toContain('centerY')

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const centerXInput = inputs[0]
    const centerYInput = inputs[1]
    if (!centerXInput || !centerYInput) {
      throw new Error('Expected center inputs')
    }
    centerXInput.vm.$emit('update:value', 20)
    centerYInput.vm.$emit('update:value', 30)
    expect(wrapper.emitted('update:layerCenterX')?.[0]).toEqual([20])
    expect(wrapper.emitted('update:layerCenterY')?.[0]).toEqual([30])
  })

  it('guards non-number updates for the angle input', () => {
    const wrapper = mount(CssGradientLayerTypeControls, {
      props: {
        layerType: 'linear',
        layerAngle: 90,
        layerCenterX: 50,
        layerCenterY: 50,
      },
    })

    const angleInput = wrapper.findComponent({ name: 'NInputNumber' })
    angleInput.vm.$emit('update:value', null)

    expect(wrapper.emitted('update:layerAngle')).toBeUndefined()
  })
})
