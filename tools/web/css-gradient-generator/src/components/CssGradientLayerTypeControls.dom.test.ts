import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientLayerTypeControls from './CssGradientLayerTypeControls.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
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
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
    expect(wrapper.text()).toContain('Angle')
    expect(wrapper.text()).not.toContain('Center X')
    const angleInput = wrapper.findComponent({ name: 'NInputNumber' })
    angleInput.vm.$emit('update:value', 120)
    expect(wrapper.emitted('update:layerAngle')?.[0]).toEqual([120])
    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'radial')
    expect(wrapper.emitted('update:layerType')?.[0]).toEqual(['radial'])
    await wrapper.setProps({ layerType: 'radial' })
    expect(wrapper.text()).toContain('Center X')
    expect(wrapper.text()).toContain('Center Y')
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
  it('guards non-number updates for center inputs', () => {
    const wrapper = mount(CssGradientLayerTypeControls, {
      props: {
        layerType: 'radial',
        layerAngle: 90,
        layerCenterX: 50,
        layerCenterY: 50,
      },
    })
    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const centerXInput = inputs[0]
    const centerYInput = inputs[1]
    if (!centerXInput || !centerYInput) {
      throw new Error('Expected center inputs')
    }
    centerXInput.vm.$emit('update:value', null)
    centerYInput.vm.$emit('update:value', null)
    expect(wrapper.emitted('update:layerCenterX')).toBeUndefined()
    expect(wrapper.emitted('update:layerCenterY')).toBeUndefined()
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
