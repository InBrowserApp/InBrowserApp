import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsExif from './WhatIsExif.vue'

vi.mock('vue-i18n', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-i18n')>()
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    name: 'ToolSectionHeader',
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NP: defineComponent({
      name: 'NP',
      template: '<p class="n-p"><slot /></p>',
    }),
    NUl: defineComponent({
      name: 'NUl',
      template: '<ul class="n-ul"><slot /></ul>',
    }),
    NLi: defineComponent({
      name: 'NLi',
      template: '<li class="n-li"><slot /></li>',
    }),
    NAlert: defineComponent({
      name: 'NAlert',
      props: {
        title: {
          type: String,
          default: '',
        },
      },
      template: '<div class="n-alert" :data-title="title"><slot /></div>',
    }),
  }
})

describe('WhatIsExif', () => {
  it('renders the EXIF explanation and privacy notice', () => {
    const wrapper = mount(WhatIsExif)

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('contains')

    const items = wrapper.findAll('.n-li')
    expect(items).toHaveLength(5)

    const alert = wrapper.find('.n-alert')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('data-title')).toBe('privacy.title')
    expect(alert.text()).toContain('privacy.description')
  })
})
