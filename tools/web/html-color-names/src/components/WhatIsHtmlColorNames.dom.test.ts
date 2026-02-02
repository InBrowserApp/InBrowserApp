import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WhatIsHtmlColorNames from './WhatIsHtmlColorNames.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  const NUl = defineComponent({
    name: 'NUl',
    template: '<ul class="n-ul"><slot /></ul>',
  })

  const NLi = defineComponent({
    name: 'NLi',
    template: '<li class="n-li"><slot /></li>',
  })

  return {
    NText,
    NUl,
    NLi,
  }
})

describe('WhatIsHtmlColorNames', () => {
  it('renders the informational content', () => {
    const wrapper = mount(WhatIsHtmlColorNames, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('basicColorsTitle')
    expect(wrapper.text()).toContain('extendedColorsTitle')
    expect(wrapper.text()).toContain('usageTitle')
  })
})
