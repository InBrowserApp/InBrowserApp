import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ParsedDirectivesList from './ParsedDirectivesList.vue'

vi.mock('naive-ui', () => ({
  NEmpty: defineComponent({
    name: 'NEmpty',
    props: { description: { type: String, default: '' } },
    setup(props) {
      return () => h('div', props.description)
    },
  }),
  NGrid: defineComponent({
    name: 'NGrid',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  NGi: defineComponent({
    name: 'NGi',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  }),
  NCard: defineComponent({
    name: 'NCard',
    props: { title: { type: String, default: '' } },
    setup(props, { slots }) {
      return () => h('div', [props.title, slots.default?.()])
    },
  }),
  NTag: defineComponent({
    name: 'NTag',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
  NText: defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  }),
}))

describe('ParsedDirectivesList', () => {
  it('renders empty state when there are no directives', () => {
    const wrapper = mount(ParsedDirectivesList, {
      props: {
        directives: [],
        emptyLabel: 'No directives',
        noValuesLabel: 'No values',
      },
    })

    expect(wrapper.text()).toContain('No directives')
  })

  it('renders directive values and empty value labels', () => {
    const wrapper = mount(ParsedDirectivesList, {
      props: {
        directives: [
          { name: 'default-src', values: ["'self'"] },
          { name: 'upgrade-insecure-requests', values: [] },
        ],
        emptyLabel: 'No directives',
        noValuesLabel: 'No values',
      },
    })

    expect(wrapper.text()).toContain('default-src')
    expect(wrapper.text()).toContain("'self'")
    expect(wrapper.text()).toContain('No values')
  })

  it('skips the empty value label when values exist', () => {
    const wrapper = mount(ParsedDirectivesList, {
      props: {
        directives: [{ name: 'script-src', values: ["'self'", 'https://cdn.example.com'] }],
        emptyLabel: 'No directives',
        noValuesLabel: 'No values',
      },
    })

    expect(wrapper.text()).toContain('script-src')
    expect(wrapper.text()).toContain('https://cdn.example.com')
    expect(wrapper.text()).not.toContain('No values')
  })
})
