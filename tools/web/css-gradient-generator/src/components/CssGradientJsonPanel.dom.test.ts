import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientJsonPanel from './CssGradientJsonPanel.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })

  const NInput = defineComponent({
    name: 'NInput',
    props: ['value', 'modelValue', 'placeholder'],
    emits: ['update:value'],
    template:
      '<textarea v-bind="$attrs" :value="value || modelValue" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: ['href', 'download', 'disabled'],
    emits: ['click'],
    template:
      '<button v-bind="$attrs" :href="href" :download="download" :data-disabled="String(disabled)" @click="$emit(\'click\', $event)"><slot name="icon" /><slot /></button>',
  })

  return {
    NAlert: makeStub('NAlert'),
    NButton,
    NCard: makeStub('NCard'),
    NFlex: makeStub('NFlex'),
    NIcon: makeStub('NIcon'),
    NInput,
  }
})

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy"><slot name="label" /></button>',
  },
}))

describe('CssGradientJsonPanel', () => {
  it('falls back to an undefined download url and emits updates', async () => {
    const wrapper = mount(CssGradientJsonPanel, {
      props: {
        serializedConfig: '{"layers":[]}',
        jsonInput: '',
        showError: false,
      },
    })

    const downloadButton = wrapper.get('[data-testid="download-json"]')
    expect(downloadButton.attributes('href')).toBeUndefined()
    expect(downloadButton.attributes('data-disabled')).toBe('true')

    const input = wrapper.get('[data-testid="json-input"]')
    await input.setValue('{"layers":[{"id":"custom"}]}')
    expect(wrapper.emitted('update:jsonInput')?.[0]).toEqual(['{"layers":[{"id":"custom"}]}'])

    await wrapper.get('[data-testid="load-json"]').trigger('click')
    expect(wrapper.emitted('load-json')).toBeTruthy()
    expect(wrapper.find('[data-testid="json-error"]').exists()).toBe(false)
  })

  it('uses the provided download url and renders the error state', () => {
    const wrapper = mount(CssGradientJsonPanel, {
      props: {
        serializedConfig: '{"layers":[]}',
        jsonInput: '',
        jsonUrl: 'blob:gradient-json',
        showError: true,
      },
    })

    const downloadButton = wrapper.get('[data-testid="download-json"]')
    expect(downloadButton.attributes('href')).toBe('blob:gradient-json')
    expect(downloadButton.attributes('data-disabled')).toBe('false')
    expect(wrapper.find('[data-testid="json-error"]').exists()).toBe(true)
  })
})
