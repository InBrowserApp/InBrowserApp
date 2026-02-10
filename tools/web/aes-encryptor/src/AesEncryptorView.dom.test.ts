import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import AesEncryptorView from './AesEncryptorView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: ['info'],
  template: '<div class="layout"><slot /></div>',
})

const EncryptFormStub = defineComponent({
  name: 'EncryptForm',
  template: '<div class="encrypt-form" />',
})

const WhatIsAesStub = defineComponent({
  name: 'WhatIsAes',
  template: '<div class="what-is-aes" />',
})

describe('AesEncryptorView', () => {
  it('renders tool layout, form, and info section', () => {
    const wrapper = mount(AesEncryptorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          EncryptForm: EncryptFormStub,
          WhatIsAes: WhatIsAesStub,
        },
      },
    })

    const layout = wrapper.findComponent({ name: 'ToolDefaultPageLayout' })
    expect(layout.exists()).toBe(true)
    expect((layout.props('info') as { toolID?: string }).toolID).toBe('aes-encryptor')
    expect(wrapper.find('.encrypt-form').exists()).toBe(true)
    expect(wrapper.find('.what-is-aes').exists()).toBe(true)
  })
})
