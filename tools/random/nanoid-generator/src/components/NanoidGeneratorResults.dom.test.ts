import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import NanoidGeneratorResults from './NanoidGeneratorResults.vue'
vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: defineComponent({
    name: 'ToolSectionHeader',
    template: '<h2><slot /></h2>',
  }),
  ToolSection: defineComponent({
    name: 'ToolSection',
    template: '<section><slot /></section>',
  }),
}))
vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: defineComponent({
    name: 'CopyToClipboardButton',
    template: '<button data-testid="copy" type="button" />',
  }),
  RegenerateButton: defineComponent({
    name: 'RegenerateButton',
    emits: ['click'],
    template: '<button data-testid="regenerate" type="button" @click="$emit(\'click\')" />',
  }),
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      template: '<textarea :value="value"></textarea>',
    }),
  }
})
describe('NanoidGeneratorResults', () => {
  it('renders output and emits regenerate', async () => {
    const wrapper = mount(NanoidGeneratorResults, {
      props: {
        output: 'abc',
      },
    })
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('abc')
    await wrapper.get('[data-testid="regenerate"]').trigger('click')
    expect(wrapper.emitted('regenerate')).toHaveLength(1)
  })
})
