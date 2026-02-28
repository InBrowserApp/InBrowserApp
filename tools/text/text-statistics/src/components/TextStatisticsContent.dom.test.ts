import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TextStatisticsContent from './TextStatisticsContent.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div class="n-gi"><slot /></div>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
      rows: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        default: 'text',
      },
    },
    emits: ['update:value'],
    template:
      '<textarea class="n-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NGrid,
    NGi,
    NInput,
  }
})

vi.mock('./StatsDisplay.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'StatsDisplay',
      props: {
        stats: {
          type: Object,
          default: () => ({}),
        },
      },
      template:
        '<div data-testid="stats" :data-characters="stats.characters" :data-words="stats.words" />',
    }),
  }
})

describe('TextStatisticsContent', () => {
  it('updates stats when input changes', async () => {
    const wrapper = mount(TextStatisticsContent)

    const input = wrapper.get('textarea.n-input')
    expect(input.attributes('placeholder')).toBe('Enter or paste your text here...')
    expect(wrapper.get('[data-testid="stats"]').attributes('data-characters')).toBe('0')

    await input.setValue('Hello world')
    await nextTick()

    expect(wrapper.get('[data-testid="stats"]').attributes('data-words')).toBe('2')
  })
})
