import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import WhatIsChmod from './WhatIsChmod.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const I18nTStub = defineComponent({
  name: 'I18nT',
  props: ['keypath'],
  template: '<p class="description"><slot /><slot name="example" /></p>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section><slot /></section>',
})

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h2><slot /></h2>',
})

const NTextStub = defineComponent({
  name: 'NText',
  template: '<span><slot /></span>',
})

describe('WhatIsChmod', () => {
  it('renders the description markdown content', () => {
    const wrapper = mount(WhatIsChmod, {
      global: {
        stubs: {
          'i18n-t': I18nTStub,
          ToolSection: ToolSectionStub,
          ToolSectionHeader: ToolSectionHeaderStub,
          NText: NTextStub,
        },
      },
    })

    const description = wrapper.find('.description')
    expect(description.exists()).toBe(true)
    expect(wrapper.text()).toContain('title')
  })
})
