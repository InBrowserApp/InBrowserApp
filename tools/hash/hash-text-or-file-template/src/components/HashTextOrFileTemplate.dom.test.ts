import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/base', () => ({
  TextOrFileInput: {
    props: ['value'],
    emits: ['update:value'],
    template: '<button class="text-or-file-input" @click="$emit(\'update:value\', \'hello\')" />',
  },
}))

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h3 class="section-header"><slot /></h3>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}))

vi.mock('./HashResult.vue', () => ({
  default: {
    name: 'HashResult',
    props: ['hash', 'content', 'hideHex', 'hideBase64', 'hideBinary', 'hideDecimal'],
    template:
      '<div class="hash-result" :data-content="content" :data-hide-hex="hideHex" :data-hide-base64="hideBase64" :data-hide-binary="hideBinary" :data-hide-decimal="hideDecimal" />',
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

let HashTextOrFileTemplate: typeof import('./HashTextOrFileTemplate.vue').default

beforeAll(async () => {
  HashTextOrFileTemplate = (await import('./HashTextOrFileTemplate.vue')).default
})

describe('HashTextOrFileTemplate', () => {
  it('hides the result section until input is provided', async () => {
    const hash = vi.fn(async () => new ArrayBuffer(0))
    const wrapper = mount(HashTextOrFileTemplate, { props: { hash } })

    const headers = wrapper.findAll('.section-header')
    expect(headers).toHaveLength(1)
    expect(headers[0]?.text()).toBe('hash-input')
    await wrapper.find('.text-or-file-input').trigger('click')

    const updatedHeaders = wrapper.findAll('.section-header')
    expect(updatedHeaders).toHaveLength(2)
    expect(updatedHeaders[1]?.text()).toBe('hash-result')
    expect(wrapper.find('.hash-result').isVisible()).toBe(true)
  })

  it('passes content and hide flags to the result component', async () => {
    const hash = vi.fn(async () => new ArrayBuffer(0))
    const wrapper = mount(HashTextOrFileTemplate, {
      props: {
        hash,
        hideHex: true,
        hideBase64: true,
        hideBinary: true,
        hideDecimal: true,
      },
    })

    await wrapper.find('.text-or-file-input').trigger('click')

    const result = wrapper.findComponent({ name: 'HashResult' })
    expect(result.props('hash')).toBe(hash)
    expect(result.props('content')).toBe('hello')
    expect(result.props('hideHex')).toBe(true)
    expect(result.props('hideBase64')).toBe(true)
    expect(result.props('hideBinary')).toBe(true)
    expect(result.props('hideDecimal')).toBe(true)
  })
})
