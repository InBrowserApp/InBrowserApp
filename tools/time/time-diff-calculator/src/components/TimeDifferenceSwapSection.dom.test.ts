import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import TimeDifferenceSwapSection from './TimeDifferenceSwapSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="n-button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })

  return {
    NButton,
    NFlex: Base,
    NIcon: Base,
  }
})

describe('TimeDifferenceSwapSection', () => {
  it('emits swap on click', async () => {
    const wrapper = mount(TimeDifferenceSwapSection, {
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
        },
      },
    })

    await wrapper.find('button.n-button').trigger('click')
    expect(wrapper.emitted('swap')).toEqual([[]])
  })
})
