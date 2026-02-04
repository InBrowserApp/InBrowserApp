import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: 'button',
        },
        href: {
          type: String,
          default: undefined,
        },
        download: {
          type: String,
          default: undefined,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
      },
      emits: ['click'],
      setup(props, { emit, slots }) {
        return () =>
          h(
            props.tag,
            {
              href: props.href,
              download: props.download,
              'data-disabled': props.disabled ? 'true' : 'false',
              onClick: () => emit('click'),
            },
            [slots.icon?.(), slots.default?.()],
          )
      },
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span data-testid="icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/ArrowDownload16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Document16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Link16Regular', () => ({ default: {} }))
vi.mock('@vicons/fluent/Wand16Regular', () => ({ default: {} }))

import OpenApiToolbar from './OpenApiToolbar.vue'

describe('OpenApiToolbar', () => {
  it('emits toolbar actions', async () => {
    const wrapper = mount(OpenApiToolbar, {
      props: {
        outputText: 'types',
        downloadUrl: undefined,
      },
    })

    const buttons = wrapper.findAllComponents({ name: 'NButton' })
    await buttons[0]?.trigger('click')
    await buttons[1]?.trigger('click')
    await buttons[2]?.trigger('click')

    expect(wrapper.emitted('import')).toBeTruthy()
    expect(wrapper.emitted('import-url')).toBeTruthy()
    expect(wrapper.emitted('load-sample')).toBeTruthy()
    expect(wrapper.get('[data-testid="copy"]').attributes('data-content')).toBe('types')
  })

  it('renders download link state', () => {
    const wrapper = mount(OpenApiToolbar, {
      props: {
        outputText: 'types',
        downloadUrl: 'blob:download',
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('blob:download')
    expect(link.attributes('download')).toBe('openapi-types.d.ts')
    expect(link.attributes('data-disabled')).toBe('false')
  })

  it('disables download when no url is available', () => {
    const wrapper = mount(OpenApiToolbar, {
      props: {
        outputText: '',
        downloadUrl: undefined,
      },
    })

    const link = wrapper.get('a')
    expect(link.attributes('data-disabled')).toBe('true')
  })
})
