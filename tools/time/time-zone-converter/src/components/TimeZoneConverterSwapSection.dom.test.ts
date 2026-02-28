import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import TimeZoneConverterSwapSection from './TimeZoneConverterSwapSection.vue'

vi.mock('naive-ui', async () => {
  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="n-button" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon" />',
  })

  return {
    NButton,
    NFlex,
    NIcon,
  }
})

describe('TimeZoneConverterSwapSection', () => {
  it('emits swap when clicked', async () => {
    const wrapper = mount(TimeZoneConverterSwapSection, {
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
        },
      },
    })

    await wrapper.find('button.n-button').trigger('click')

    expect(wrapper.emitted('swap')).toHaveLength(1)
    expect(wrapper.text()).toContain('Swap')
  })
})
