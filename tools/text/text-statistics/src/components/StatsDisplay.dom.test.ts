import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsDisplay from './StatsDisplay.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    template: '<div><slot /></div>',
  })

  const NStatistic = defineComponent({
    name: 'NStatistic',
    props: {
      label: {
        type: String,
        default: '',
      },
      value: {
        type: [String, Number],
        default: '',
      },
    },
    template: '<div class="stat" :data-label="label" :data-value="value" />',
  })

  return {
    NGrid: Base,
    NGi: Base,
    NCard: Base,
    NStatistic,
  }
})

describe('StatsDisplay', () => {
  it('renders formatted statistics', () => {
    const wrapper = mount(StatsDisplay, {
      props: {
        stats: {
          characters: 10,
          charactersNoSpaces: 8,
          words: 2,
          lines: 1,
          paragraphs: 1,
          sentences: 1,
          readingTimeMinutes: 1.5,
          speakingTimeMinutes: 0.5,
        },
      },
    })

    const stats = wrapper.findAll('.stat')
    expect(stats).toHaveLength(8)
    expect(wrapper.get('[data-label="characters"]').attributes('data-value')).toBe('10')
    expect(wrapper.get('[data-label="readingTime"]').attributes('data-value')).toBe('1m 30s')
    expect(wrapper.get('[data-label="speakingTime"]').attributes('data-value')).toBe('30s')
  })
})
