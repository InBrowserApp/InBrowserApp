import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapSettingsSection from './SitemapSettingsSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-flex' }, slots.default?.())
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('input', {
          ...attrs,
          value: props.value,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-space' }, slots.default?.())
    },
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('button', {
          ...attrs,
          'data-value': String(props.value),
          onClick: () => emit('update:value', !props.value),
        })
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', { class: 'n-text' }, slots.default?.())
    },
  })

  return {
    NFlex,
    NInput,
    NSpace,
    NSwitch,
    NText,
  }
})

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent, h } = await import('vue')

  const ToolSection = defineComponent({
    name: 'ToolSection',
    setup(_, { slots }) {
      return () => h('section', { class: 'tool-section' }, slots.default?.())
    },
  })

  const ToolSectionHeader = defineComponent({
    name: 'ToolSectionHeader',
    setup(_, { slots }) {
      return () => h('header', { class: 'tool-section-header' }, slots.default?.())
    },
  })

  return { ToolSection, ToolSectionHeader }
})

describe('SitemapSettingsSection', () => {
  it('emits updates for base url and auto-join', async () => {
    const wrapper = mount(SitemapSettingsSection, {
      props: {
        baseUrl: 'https://example.com',
        autoJoin: true,
      },
    })

    const input = wrapper.get('[data-testid="base-url"]')
    await input.setValue('https://example.org')

    expect(wrapper.emitted('update:baseUrl')?.[0]).toEqual(['https://example.org'])

    const toggle = wrapper.get('[data-testid="auto-join"]')
    await toggle.trigger('click')

    expect(wrapper.emitted('update:autoJoin')?.[0]).toEqual([false])
  })
})
