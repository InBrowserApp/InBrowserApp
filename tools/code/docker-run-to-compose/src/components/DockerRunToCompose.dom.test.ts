import { beforeEach, describe, expect, it, vi } from 'vitest'

const storage = new Map<string, ReturnType<typeof import('vue').ref>>()
const storageKey = 'tools:docker-run-to-compose:input'
let objectUrlValue: string | null = 'blob:download'

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (key: string, initialValue: string) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key)!
    },
    useObjectUrl: (source: { value: unknown }) => {
      void source.value
      return ref(objectUrlValue)
    },
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
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

vi.mock('../converter', () => ({
  convertDockerRunToCompose: (input: string) => {
    if (!input.trim()) {
      return { output: '', warnings: [] }
    }
    if (input.includes('error')) {
      return { output: '', warnings: ['Something happened'], error: 'Invalid input' }
    }
    if (input.includes('warn')) {
      return { output: 'warned output', warnings: ['Be careful'] }
    }
    return { output: `converted:${input}`, warnings: [] }
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
        '<component :is="tag || \'button\'" v-bind="$attrs"><span data-slot="icon"><slot name="icon" /></span><slot /></component>',
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
      template: '<div><slot name="label" /><slot /></div>',
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
      template: '<textarea :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NSpace: defineComponent({
      name: 'NSpace',
      template: '<div><slot /></div>',
    }),
  }
})

import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import DockerRunToCompose from './DockerRunToCompose.vue'

describe('DockerRunToCompose', () => {
  beforeEach(() => {
    storage.clear()
    objectUrlValue = 'blob:download'
  })

  it('renders output and download link', () => {
    const wrapper = mount(DockerRunToCompose)

    const code = wrapper.get('[data-testid="output-code"]')
    expect(code.attributes('data-language')).toBe('yaml')
    expect(code.text()).toContain('converted:')

    const download = wrapper.get('a')
    expect(download.attributes('href')).toBe('blob:download')
    expect(download.attributes('download')).toBe('docker-compose.yml')

    const copy = wrapper.get('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toContain('converted:')
  })

  it('omits the download href when object url is unavailable', () => {
    objectUrlValue = null

    const wrapper = mount(DockerRunToCompose)

    expect(wrapper.get('a').attributes('href')).toBeUndefined()
  })

  it('shows warning and error alerts', () => {
    storage.set(storageKey, ref('error input'))

    const wrapper = mount(DockerRunToCompose)

    expect(wrapper.find('[data-alert-type="warning"]').exists()).toBe(true)
    expect(wrapper.find('[data-alert-type="error"]').exists()).toBe(true)
  })

  it('updates storage via sample and clear actions', async () => {
    const wrapper = mount(DockerRunToCompose)

    const buttons = wrapper.findAll('button')
    const sampleButton = buttons.find((button) => button.text().includes('sample'))
    const clearButton = buttons.find((button) => button.text().includes('clear'))

    if (!sampleButton || !clearButton) {
      throw new Error('Missing action buttons')
    }

    await sampleButton.trigger('click')
    await nextTick()

    const storedSample = storage.get(storageKey)?.value ?? ''
    expect(storedSample).toContain('docker run --name api')

    await clearButton.trigger('click')
    await nextTick()

    expect(storage.get(storageKey)?.value).toBe('')
  })

  it('updates output when input changes', async () => {
    const wrapper = mount(DockerRunToCompose)

    await wrapper.get('textarea').setValue('warn')
    await nextTick()

    expect(wrapper.find('[data-alert-type="warning"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="output-code"]').text()).toContain('warned output')
  })
})
