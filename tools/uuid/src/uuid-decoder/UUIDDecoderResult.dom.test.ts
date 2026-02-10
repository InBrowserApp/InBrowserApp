import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import UUIDDecoderResult from './UUIDDecoderResult.vue'

const DecodeResultStub = defineComponent({
  name: 'DecodeResult',
  props: ['uuid'],
  template: '<div class="decode-result" :data-uuid="uuid" />',
})

describe('UUIDDecoderResult', () => {
  it('renders the result header and passes the UUID to the decoder', () => {
    const uuid = '11111111-1111-1111-1111-111111111111'

    const wrapper = mount(UUIDDecoderResult, {
      props: {
        uuid,
      },
      global: {
        stubs: {
          DecodeResult: DecodeResultStub,
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<h2><slot /></h2>' },
        },
      },
    })

    expect(wrapper.text()).toContain('Result')
    expect(wrapper.find('.decode-result').attributes('data-uuid')).toBe(uuid)
  })
})
