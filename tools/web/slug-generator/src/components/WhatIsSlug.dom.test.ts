import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsSlug from './WhatIsSlug.vue'

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

    expect(wrapper.text()).toContain('What is a Slug?')
    expect(wrapper.text()).toContain('URL-friendly version of a string')
    expect(wrapper.text()).toContain('"Hello World!" → "hello-world"')
    expect(wrapper.text()).toContain('"Product: iPhone 15 Pro" → "product-iphone-15-pro"')
    expect(wrapper.text()).toContain('Slugs improve URL readability')
  })
})
