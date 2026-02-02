import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CIDRMergerExcluder from './CIDRMergerExcluder.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const CIDRsInputStub = defineComponent({
  name: 'CIDRsInput',
  emits: ['update:cidrs'],
  template: '<div class="cidrs-input" />',
})

const CIDRsMergeExcludeResultStub = defineComponent({
  name: 'CIDRsMergeExcludeResult',
  props: {
    cidrsToMerge: {
      type: Array,
      default: () => [],
    },
    cidrsToExclude: {
      type: Array,
      default: () => [],
    },
  },
  template:
    '<div class="merge-result" :data-merge="cidrsToMerge.join(\',\')" :data-exclude="cidrsToExclude.join(\',\')" />',
})

describe('CIDRMergerExcluder', () => {
  it('shows merge/exclude result when both inputs have CIDRs', async () => {
    const wrapper = mount(CIDRMergerExcluder, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          CIDRsInput: CIDRsInputStub,
          CIDRsMergeExcludeResult: CIDRsMergeExcludeResultStub,
        },
      },
    })

    expect(wrapper.text()).toContain('cidrsToMerge')
    expect(wrapper.text()).toContain('cidrsToExclude')
    expect(wrapper.find('.merge-result').exists()).toBe(false)

    const inputs = wrapper.findAllComponents({ name: 'CIDRsInput' })
    expect(inputs).toHaveLength(2)

    const [mergeInput, excludeInput] = inputs
    if (!mergeInput || !excludeInput) {
      throw new Error('Expected two CIDRsInput instances')
    }

    mergeInput.vm.$emit('update:cidrs', ['10.0.0.0/24'])
    excludeInput.vm.$emit('update:cidrs', ['10.0.1.0/24'])
    await nextTick()

    const result = wrapper.find('.merge-result')
    expect(result.exists()).toBe(true)
    expect(result.attributes('data-merge')).toBe('10.0.0.0/24')
    expect(result.attributes('data-exclude')).toBe('10.0.1.0/24')
    expect(wrapper.text()).toContain('mergeAndExcludeResult')
  })
})
