import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import SlugGenerator from './SlugGenerator.vue'

const slugifyMock = vi.fn()

vi.mock('transliteration', () => ({
  slugify: (...args: unknown[]) => slugifyMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button data-testid="copy-button" :data-content="content" />',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  return {
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template: '<textarea :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button data-testid="clear-button" @click="$emit(\'click\')"><slot /></button>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
    NFormItem: defineComponent({
      name: 'NFormItem',
      template: '<div><slot /></div>',
    }),
    NRadioGroup: defineComponent({
      name: 'NRadioGroup',
      emits: ['update:value'],
      template: '<div><slot /></div>',
    }),
    NRadioButton: defineComponent({
      name: 'NRadioButton',
      template: '<button><slot /></button>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template: '<div><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span><slot /></span>',
    }),
  }
})

describe('SlugGenerator', () => {
  beforeEach(() => {
    slugifyMock.mockReset()
    slugifyMock.mockImplementation(
      (text: string, options: { separator: string; lowercase: boolean }) =>
        `slug:${text}:${options.separator}:${options.lowercase}`,
    )
  })

  it('generates slug output and reacts to option changes', async () => {
    const wrapper = mount(SlugGenerator)

    expect(slugifyMock).toHaveBeenCalledWith('Hello World Example', {
      separator: '-',
      lowercase: true,
      trim: true,
    })

    expect(wrapper.text()).toContain('slug:Hello World Example:-:true')
    expect(wrapper.find('[data-testid="copy-button"]').attributes('data-content')).toBe(
      'slug:Hello World Example:-:true',
    )

    const input = wrapper.find('textarea')
    await input.setValue('Custom Title')

    const groups = wrapper.findAllComponents({ name: 'NRadioGroup' })
    expect(groups).toHaveLength(2)

    await groups[0]!.vm.$emit('update:value', '_')
    await groups[1]!.vm.$emit('update:value', 'preserve')
    await wrapper.vm.$nextTick()

    const lastCall = slugifyMock.mock.calls[slugifyMock.mock.calls.length - 1]
    expect(lastCall).toEqual([
      'Custom Title',
      {
        separator: '_',
        lowercase: false,
        trim: true,
      },
    ])
  })

  it('clears input and shows the placeholder when empty', async () => {
    const wrapper = mount(SlugGenerator)
    slugifyMock.mockClear()

    const input = wrapper.find('textarea')
    await input.setValue('')

    const clearButton = wrapper.find('[data-testid="clear-button"]')
    await clearButton.trigger('click')

    expect(wrapper.text()).toContain('outputPlaceholder')
    expect(slugifyMock).not.toHaveBeenCalled()
  })
})
