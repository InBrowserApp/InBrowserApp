import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PrivateKeySection from './PrivateKeySection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', async () => {
  const { computed, isRef } = await import('vue')
  return {
    useObjectUrl: (source: unknown) =>
      computed(() => {
        const value = isRef(source) ? source.value : source
        return value ? 'blob:private' : null
      }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: '',
      },
      download: {
        type: String,
        default: '',
      },
    },
    emits: ['click'],
    template:
      '<component :is="tag" class="n-button" :href="href" :download="download" @click="$emit(\'click\')"><slot name="icon" /><slot /></component>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    inheritAttrs: false,
    template: '<div class="n-input" v-bind="$attrs"></div>',
  })

  return {
    NInput,
    NFlex: Base,
    NButton,
    NIcon: Base,
    NTag: Base,
  }
})

describe('PrivateKeySection', () => {
  it('toggles visibility and exposes download link', async () => {
    const wrapper = mount(PrivateKeySection, {
      props: {
        value: 'PRIVATE',
        filename: 'private.asc',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          CopyToClipboardButton: { template: '<button class="copy" />' },
        },
      },
    })

    expect(wrapper.find('.private-key-hidden').exists()).toBe(true)

    const link = wrapper.find('a.n-button')
    expect(link.attributes('href')).toBe('blob:private')
    expect(link.attributes('download')).toBe('private.asc')

    const toggle = wrapper.findAll('button.n-button').find((button) => {
      return button.text().includes('show') || button.text().includes('hide')
    })
    await toggle!.trigger('click')

    expect(wrapper.find('.private-key-hidden').exists()).toBe(false)
  })
})
