import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsSlug from './WhatIsSlug.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span><slot /></span>',
})

const NUlStub = defineComponent({
  name: 'NUl',
  template: '<ul><slot /></ul>',
})

const NLiStub = defineComponent({
  name: 'NLi',
  template: '<li><slot /></li>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2><slot /></h2>',
})

describe('WhatIsSlug', () => {
  it('renders the slug explanation copy', () => {
    const wrapper = mount(WhatIsSlug, {
      global: {
        stubs: {
          NText: NTextStub,
          NUl: NUlStub,
          NLi: NLiStub,
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
        },
      },
    })

    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('description')
    expect(wrapper.text()).toContain('example1')
    expect(wrapper.text()).toContain('example2')
    expect(wrapper.text()).toContain('example3')
    expect(wrapper.text()).toContain('benefits')
  })
})
