import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import CspParser from './CspParser.vue'

const ParserStub = defineComponent({
  name: 'CspParserSection',
  props: ['input', 'directives'],
  emits: ['update:input'],
  setup(props, { emit }) {
    return () =>
      h('div', [
        h('span', { 'data-test': 'count' }, String(props.directives?.length ?? 0)),
        h(
          'button',
          {
            'data-test': 'set-input',
            onClick: () => emit('update:input', "default-src 'self'"),
          },
          'set input',
        ),
      ])
  },
})

describe('CspParser', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('parses directives from input updates', async () => {
    const wrapper = mount(CspParser, {
      global: {
        stubs: {
          CspParserSection: ParserStub,
        },
      },
    })

    expect(wrapper.get('[data-test="count"]').text()).toBe('0')

    await wrapper.get('[data-test="set-input"]').trigger('click')
    expect(wrapper.get('[data-test="count"]').text()).toBe('1')
  })
})
