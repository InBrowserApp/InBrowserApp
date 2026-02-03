import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import PublicKeySection from './PublicKeySection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@vueuse/core', async () => {
  const { computed } = await import('vue')
  return {
    useObjectUrl: () => computed(() => 'blob:public'),
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
    template:
      '<component :is="tag" class="n-button" :href="href" :download="download"><slot name="icon" /><slot /></component>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<textarea class="n-input">{{ value }}</textarea>',
  })

  return {
    NInput,
    NFlex: Base,
    NButton,
    NIcon: Base,
    NTag: Base,
  }
})

describe('PublicKeySection', () => {
  it('renders download link and copy button', () => {
    const wrapper = mount(PublicKeySection, {
      props: {
        value: 'PUBLIC',
        filename: 'id_ed25519.pub',
      },
      global: {
        stubs: {
          ToolSection: { template: '<section><slot /></section>' },
          ToolSectionHeader: { template: '<header><slot /></header>' },
          CopyToClipboardButton: { template: '<button class="copy" />' },
        },
      },
    })

    const link = wrapper.find('a.n-button')
    expect(link.attributes('href')).toBe('blob:public')
    expect(link.attributes('download')).toBe('id_ed25519.pub')
    expect(wrapper.find('.copy').exists()).toBe(true)
    expect(wrapper.find('.n-input').text()).toContain('PUBLIC')
  })
})
