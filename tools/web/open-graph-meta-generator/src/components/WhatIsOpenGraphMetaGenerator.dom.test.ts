import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsOpenGraphMetaGenerator from './WhatIsOpenGraphMetaGenerator.vue'

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  template: '<h2><slot /></h2>',
})

const NTextStub = defineComponent({
  template: '<span><slot /></span>',
})

const NUlStub = defineComponent({
  template: '<ul><slot /></ul>',
})

const NLiStub = defineComponent({
  template: '<li><slot /></li>',
})

describe('WhatIsOpenGraphMetaGenerator', () => {
  it('renders the explainer content', () => {
    const wrapper = mount(WhatIsOpenGraphMetaGenerator, {
      global: {
        stubs: {
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NText: NTextStub,
          NUl: NUlStub,
          NLi: NLiStub,
        },
      },
    })

    expect(wrapper.text()).toContain('What does this tool generate?')
    expect(wrapper.text()).toContain('Open Graph and Twitter cards')
    expect(wrapper.text()).toContain('paste into the head')
    expect(wrapper.text()).toContain('absolute URLs')
  })
})
