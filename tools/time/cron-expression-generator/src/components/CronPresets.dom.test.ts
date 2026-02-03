import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronPresets from './CronPresets.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: ['size', 'secondary'],
      emits: ['click'],
      template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

describe('CronPresets', () => {
  it('renders preset buttons', () => {
    const wrapper = mount(CronPresets)
    expect(wrapper.findAll('button')).toHaveLength(11)
  })

  it('emits preset values when clicked', async () => {
    const wrapper = mount(CronPresets)

    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')

    expect(wrapper.emitted('select')?.[0]).toEqual(['* * * * *'])
  })
})
