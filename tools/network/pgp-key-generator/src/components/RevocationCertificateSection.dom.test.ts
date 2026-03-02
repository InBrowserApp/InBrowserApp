import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RevocationCertificateSection from './RevocationCertificateSection.vue'
vi.mock('@vueuse/core', async () => {
  const { computed, isRef } = await import('vue')
  return {
    useObjectUrl: (source: unknown) =>
      computed(() => {
        const value = isRef(source) ? source.value : source
        return value ? 'blob:revocation' : null
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
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NInput,
    NButton,
    NIcon: Base,
    NTag: Base,
  }
})
describe('RevocationCertificateSection', () => {
  it('renders download link and copy button', () => {
    const wrapper = mount(RevocationCertificateSection, {
      props: {
        value: 'REVOCATION',
        filename: 'revocation.asc',
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
    expect(link.attributes('href')).toBe('blob:revocation')
    expect(link.attributes('download')).toBe('revocation.asc')
    expect(wrapper.find('.copy').exists()).toBe(true)
  })
})
