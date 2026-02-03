import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import RegexTesterReplacer from './RegexTesterReplacer.vue'

vi.mock('@vueuse/core', async () => {
  const { ref, watchEffect } = await import('vue')

  const computedAsync = (getter: () => unknown, initialValue: unknown, _isReading?: unknown) => {
    const state = ref(initialValue)
    watchEffect(() => {
      const value = getter()
      if (value && typeof (value as Promise<unknown>).then === 'function') {
        void (value as Promise<unknown>).then((resolved) => {
          state.value = resolved
        })
      } else {
        state.value = value
      }
    })
    return state
  }

  return {
    computedAsync,
    useDebounceFn: (fn: () => void) => fn,
    useStorage: (_key: string, initialValue: unknown) => ref(initialValue),
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

  return { NGrid, NGi }
})

vi.mock('./RegexInputs.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'RegexInputs',
      props: {
        textOrFile: {
          type: [String, Object],
          default: '',
        },
        pattern: {
          type: String,
          default: '',
        },
        selectedFlags: {
          type: Array,
          default: () => [],
        },
        replacement: {
          type: String,
          default: '',
        },
        autoRun: {
          type: Boolean,
          default: false,
        },
        patternStatus: {
          type: String,
          default: undefined,
        },
        patternError: {
          type: String,
          default: '',
        },
        flagOptions: {
          type: Array,
          default: () => [],
        },
      },
      emits: [
        'run',
        'update:textOrFile',
        'update:pattern',
        'update:selectedFlags',
        'update:replacement',
        'update:autoRun',
      ],
      template: '<div data-testid="regex-inputs"></div>',
    }),
  }
})

vi.mock('./RegexResults.vue', async () => {
  const { defineComponent } = await import('vue')

  return {
    default: defineComponent({
      name: 'RegexResults',
      props: {
        activeTab: {
          type: String,
          default: 'preview',
        },
        patternError: {
          type: String,
          default: '',
        },
        showSummaryCounts: {
          type: Boolean,
          default: false,
        },
        matchesCount: {
          type: Number,
          default: 0,
        },
        groupsCount: {
          type: Number,
          default: 0,
        },
        zeroLengthCount: {
          type: Number,
          default: 0,
        },
        previewText: {
          type: String,
          default: '',
        },
        previewHtml: {
          type: String,
          default: '',
        },
        previewTruncated: {
          type: Boolean,
          default: false,
        },
        previewLimit: {
          type: Number,
          default: 0,
        },
        matchesTruncated: {
          type: Boolean,
          default: false,
        },
        matchLimit: {
          type: Number,
          default: 0,
        },
        matches: {
          type: Array,
          default: () => [],
        },
        replaceOutput: {
          type: String,
          default: '',
        },
      },
      emits: ['update:activeTab'],
      template: '<div data-testid="regex-results"></div>',
    }),
  }
})

describe('RegexTesterReplacer', () => {
  it('computes default results when auto run is enabled', async () => {
    const wrapper = mount(RegexTesterReplacer)

    await nextTick()
    await nextTick()

    const results = wrapper.getComponent({ name: 'RegexResults' })

    expect(results.props('showSummaryCounts')).toBe(true)
    expect(results.props('matchesCount')).toBe(2)
    expect(results.props('groupsCount')).toBe(4)
    expect(results.props('replaceOutput')).toContain('ID:123 Code:ABC')
    expect(results.props('previewText')).toContain('Order #123-ABC')
    expect(results.props('matches')).toHaveLength(2)
  })

  it('clears results for invalid patterns and runs on demand', async () => {
    const wrapper = mount(RegexTesterReplacer)

    await nextTick()

    const inputs = wrapper.getComponent({ name: 'RegexInputs' })
    inputs.vm.$emit('update:autoRun', false)
    inputs.vm.$emit('update:pattern', '[')
    inputs.vm.$emit('run')

    await nextTick()

    const results = wrapper.getComponent({ name: 'RegexResults' })

    expect(results.props('patternError')).not.toBe('')
    expect(results.props('showSummaryCounts')).toBe(false)
    expect(results.props('matchesCount')).toBe(0)
    expect(results.props('replaceOutput')).toBe('')
  })
})
