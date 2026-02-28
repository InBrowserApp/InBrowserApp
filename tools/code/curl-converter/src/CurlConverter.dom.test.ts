import { beforeEach, describe, expect, it, vi } from 'vitest'

const storage = new Map<string, ReturnType<typeof import('vue').ref>>()
let targetOverride: string | null = null
let objectUrlValue: string | null = 'blob:download'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        const value =
          key.includes('target') && targetOverride !== null ? targetOverride : initialValue
        storage.set(key, ref(value))
      }
      return storage.get(key)!
    },
    useObjectUrl: (blobLike: unknown) => {
      if (blobLike && typeof blobLike === 'object' && 'value' in blobLike) {
        void (blobLike as { value: unknown }).value
      }
      return ref(objectUrlValue)
    },
  }
})

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
      props: ['content'],
      template: '<button data-testid="copy" :data-content="content" />',
    }),
  }
})

vi.mock('./converter', () => ({
  convertCurlToTarget: (curlCommand: string, targetId: string) => {
    if (!curlCommand) {
      return { output: '', warnings: [] }
    }
    if (curlCommand.includes('warn')) {
      return { output: `warn:${targetId}`, warnings: ['[WARN] be careful'] }
    }
    if (curlCommand.includes('error')) {
      return { output: '', warnings: [], error: 'Failed to parse' }
    }
    return { output: `${targetId}:${curlCommand}`, warnings: [] }
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NAlert: defineComponent({
      name: 'NAlert',
      props: ['type', 'title'],
      template:
        '<div :data-alert-type="type"><strong>{{ title }}</strong><div><slot /></div></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      props: {
        tag: {
          type: String,
          default: undefined,
        },
      },
      template:
        '<component :is="tag || \'button\'" v-bind="$attrs"><slot name="icon" /><slot /></component>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template: '<div><slot /></div>',
    }),
    NCode: defineComponent({
      name: 'NCode',
      props: ['code', 'language'],
      template: '<pre data-testid="output-code" :data-language="language">{{ code }}</pre>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItemGi: defineComponent({
      name: 'NFormItemGi',
      props: ['label'],
      template: '<div><span data-label>{{ label }}</span><slot /></div>',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div><slot /></div>',
    }),
    NIcon: defineComponent({
      name: 'NIcon',
      template: '<span><slot /></span>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: ['value'],
      emits: ['update:value'],
      template: `<textarea :value="value" @input="$emit('update:value', $event.target.value)" />`,
    }),
    NSelect: defineComponent({
      name: 'NSelect',
      props: {
        value: {
          type: String,
          default: '',
        },
        options: {
          type: Array,
          default: () => [],
        },
      },
      emits: ['update:value'],
      template: `<select :data-value="value" :data-options-length="options.length" @change="$emit('update:value', $event.target.value)" />`,
    }),
    NSpace: defineComponent({
      name: 'NSpace',
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import CurlConverter from './components/CurlConverter.vue'

describe('CurlConverter', () => {
  beforeEach(() => {
    storage.clear()
    targetOverride = null
    objectUrlValue = 'blob:download'
  })

  it('renders default output and download link', () => {
    const wrapper = mount(CurlConverter)

    const select = wrapper.findComponent({ name: 'NSelect' })
    const options = select.props('options') as Array<{ children?: unknown[] }>
    expect(options.length).toBeGreaterThan(0)
    expect(options[0]?.children?.length).toBeGreaterThan(0)

    const code = wrapper.get('[data-testid="output-code"]')
    expect(code.attributes('data-language')).toBe('javascript')
    expect(code.text()).toContain('javascript-fetch')
    expect(code.text()).toContain('curl -X POST')

    const download = wrapper.get('a')
    expect(download.attributes('href')).toBe('blob:download')
    expect(download.attributes('download')).toBe('converted.js')

    const copy = wrapper.get('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toContain('javascript-fetch')

    const labels = wrapper.findAll('[data-label]')
    expect(labels.some((label) => label.text().includes('Converted Code'))).toBe(true)
  })

  it('updates target selection and output metadata', async () => {
    const wrapper = mount(CurlConverter)
    const select = wrapper.findComponent({ name: 'NSelect' })

    await select.vm.$emit('update:value', 'python-requests')
    await nextTick()

    const download = wrapper.get('a')
    expect(download.attributes('download')).toBe('converted.py')

    const code = wrapper.get('[data-testid="output-code"]')
    expect(code.attributes('data-language')).toBe('python')
    expect(code.text()).toContain('python-requests')

    expect(wrapper.text()).toContain('Converted Code (Python (requests))')
  })

  it('handles alerts plus sample and clear actions', async () => {
    const wrapper = mount(CurlConverter)
    const textarea = wrapper.get('textarea')

    await textarea.setValue('warn')
    await nextTick()

    const warningAlert = wrapper.find('[data-alert-type="warning"]')
    expect(warningAlert.exists()).toBe(true)
    expect(warningAlert.text()).toContain('[WARN]')

    await textarea.setValue('error')
    await nextTick()

    const errorAlert = wrapper.find('[data-alert-type="error"]')
    expect(errorAlert.exists()).toBe(true)
    expect(errorAlert.text()).toContain('Failed to parse')
    expect(wrapper.find('[data-alert-type="warning"]').exists()).toBe(false)

    const buttons = wrapper.findAll('button')
    const clearButton = buttons.find((button) => button.text() === 'Clear')
    const sampleButton = buttons.find((button) => button.text() === 'Use sample')
    expect(clearButton).toBeDefined()
    expect(sampleButton).toBeDefined()

    await clearButton!.trigger('click')
    await nextTick()
    expect(wrapper.get('[data-testid="output-code"]').text()).toBe('')

    await sampleButton!.trigger('click')
    await nextTick()
    expect(wrapper.get('[data-testid="output-code"]').text()).toContain('curl -X POST')
  })

  it('falls back to the default target when stored value is invalid', async () => {
    targetOverride = 'invalid-target'
    const wrapper = mount(CurlConverter)

    await nextTick()

    const select = wrapper.findComponent({ name: 'NSelect' })
    expect(select.attributes('data-value')).toBe('javascript-fetch')
  })

  it('uses plaintext defaults when current target is unknown', async () => {
    objectUrlValue = null
    const wrapper = mount(CurlConverter)
    const select = wrapper.findComponent({ name: 'NSelect' })

    await select.vm.$emit('update:value', 'unknown-target')
    await nextTick()

    const code = wrapper.get('[data-testid="output-code"]')
    expect(code.attributes('data-language')).toBe('plaintext')

    const labels = wrapper.findAll('[data-label]')
    expect(labels.some((label) => label.text() === 'Converted Code')).toBe(true)

    const download = wrapper.get('a')
    expect(download.attributes('download')).toBe('converted.txt')
    expect(download.attributes('href')).toBeUndefined()
  })
})
