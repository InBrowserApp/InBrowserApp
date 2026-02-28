import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ValidationSummary from './ValidationSummary.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })

  const NTag = defineComponent({
    name: 'NTag',
    props: {
      type: {
        type: String,
        default: 'default',
      },
      size: {
        type: String,
        default: 'small',
      },
    },
    template: '<span class="n-tag" :data-type="type"><slot /></span>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      code: {
        type: Boolean,
        default: false,
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NDescriptions: Base,
    NDescriptionsItem: Base,
    NFlex: Base,
    NTag,
    NText,
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      template: '<button class="copy-button" :data-content="content" />',
    }),
  }
})

describe('ValidationSummary', () => {
  it('shows valid status and copy button when errors exist', () => {
    const wrapper = mount(ValidationSummary, {
      props: {
        state: 'validated',
        valid: true,
        statusType: 'success',
        draftValue: '2020-12',
        draftDetected: false,
        errorsCount: 2,
        errorsJson: '[{"message":"oops"}]',
      },
    })

    expect(wrapper.find('.n-tag').attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('Valid')
    expect(wrapper.text()).toContain('default')
    expect(wrapper.find('.copy-button').attributes('data-content')).toBe('[{"message":"oops"}]')
  })

  it('renders schema error status and detected draft', () => {
    const wrapper = mount(ValidationSummary, {
      props: {
        state: 'schema-error',
        valid: false,
        statusType: 'error',
        draftValue: 'Draft-07',
        draftDetected: true,
        errorsCount: 0,
        errorsJson: '',
      },
    })

    expect(wrapper.find('.n-tag').attributes('data-type')).toBe('error')
    expect(wrapper.text()).toContain('Schema error')
    expect(wrapper.text()).toContain('from $schema')
    expect(wrapper.find('.copy-button').exists()).toBe(false)
  })
})
