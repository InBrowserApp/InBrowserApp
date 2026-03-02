import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CssGradientLayerRadialControls from './CssGradientLayerRadialControls.vue'
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
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NSelect,
  }
})
describe('CssGradientLayerRadialControls', () => {
  it('renders only for radial layers and emits updates', async () => {
    const wrapper = mount(CssGradientLayerRadialControls, {
      props: {
        layerType: 'linear',
        layerShape: 'circle',
        layerSize: 'closest-side',
      },
    })
    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(false)
    await wrapper.setProps({ layerType: 'radial' })
    const selects = wrapper.findAllComponents({ name: 'NSelect' })
    expect(selects).toHaveLength(2)
    const shapeSelect = selects[0]
    const sizeSelect = selects[1]
    if (!shapeSelect || !sizeSelect) {
      throw new Error('Expected radial select controls')
    }
    shapeSelect.vm.$emit('update:value', 'ellipse')
    sizeSelect.vm.$emit('update:value', 'farthest-corner')
    expect(wrapper.emitted('update:layerShape')?.[0]).toEqual(['ellipse'])
    expect(wrapper.emitted('update:layerSize')?.[0]).toEqual(['farthest-corner'])
  })
})
