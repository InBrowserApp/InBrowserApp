import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ToolLoadingThing from './ToolLoadingThing.vue'

vi.mock('naive-ui', async () => {
  const actual = await vi.importActual('naive-ui')
  return {
    ...actual,
    useThemeVars: () => ({
      cubicBezierEaseInOut: 'ease',
      hoverColor: '#eee',
    }),
  }
})

describe('ToolLoadingThing', () => {
  it('should render skeletons and avatar placeholder', () => {
    const NThingStub = defineComponent({
      name: 'NThing',
      template:
        '<div class="n-thing"><slot name="avatar" /><slot name="header" /><slot name="description" /></div>',
    })

    const wrapper = mount(ToolLoadingThing, {
      global: {
        stubs: {
          NThing: NThingStub,
          NAvatar: true,
          NSkeleton: true,
        },
      },
    })

    expect(wrapper.find('.tool-link').exists()).toBe(true)
  })
})
