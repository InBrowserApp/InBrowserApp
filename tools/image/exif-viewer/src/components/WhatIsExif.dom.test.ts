import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsExif from './WhatIsExif.vue'

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

    expect(wrapper.text()).toContain('What is EXIF?')
    expect(wrapper.text()).toContain(
      'EXIF (Exchangeable Image File Format) is a standard that specifies formats for images and sounds used by digital cameras and other systems.',
    )
    expect(wrapper.text()).toContain('EXIF data typically contains:')

    const items = wrapper.findAll('.n-li')
    expect(items).toHaveLength(5)

    const alert = wrapper.find('.n-alert')
    expect(alert.exists()).toBe(true)
    expect(alert.attributes('data-title')).toBe('Privacy Notice')
    expect(alert.text()).toContain(
      'EXIF data may contain sensitive information such as GPS location, device serial numbers, and timestamps. Consider removing EXIF data before sharing photos publicly.',
    )
  })
})
