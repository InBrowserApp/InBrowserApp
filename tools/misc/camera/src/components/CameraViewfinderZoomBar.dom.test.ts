import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CameraViewfinderZoomBar from './CameraViewfinderZoomBar.vue'

vi.mock('naive-ui', () => ({
  NSlider: defineComponent({
    emits: ['update:value'],
    template: `<div data-testid="slider" @click="$emit('update:value', 2)" />`,
  }),
  NIcon: defineComponent({ template: '<span />' }),
}))

const mountZoomBar = (overrides = {}) =>
  mount(CameraViewfinderZoomBar, {
    props: {
      zoomValue: 1,
      zoomMin: 1,
      zoomMax: 3,
      zoomStep: 0.5,
      zoomDisplay: '1.0x',
      isPreparing: false,
      ...overrides,
    },
  })

describe('CameraViewfinderZoomBar', () => {
  it('emits zoom updates and shows the label', async () => {
    const wrapper = mountZoomBar()
    await wrapper.find('[data-testid="slider"]').trigger('click')

    expect(wrapper.emitted('apply-zoom')).toEqual([[2]])
    expect(wrapper.text()).toContain('1.0x')
  })
})
