import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimestampDateSection from './TimestampDateSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDatePicker = defineComponent({
    name: 'NDatePicker',
    props: {
      value: {
        type: [Number, null],
        default: null,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template: '<div class="date-picker" :data-disabled="String(disabled)" />',
  })

  return {
    NDatePicker,
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
      template: '<button class="copy" :data-content="content" />',
    }),
  }
})

describe('TimestampDateSection', () => {
  it('disables the date picker when invalid and exposes local date string', () => {
    const wrapper = mount(TimestampDateSection, {
      props: {
        date: null,
        isValid: false,
        localDateString: 'local-date',
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Date & Time')
    expect(wrapper.find('.date-picker').attributes('data-disabled')).toBe('true')
    expect(wrapper.find('.copy').attributes('data-content')).toBe('local-date')
  })

  it('emits updates when the date picker changes', async () => {
    const wrapper = mount(TimestampDateSection, {
      props: {
        date: 123,
        isValid: true,
        localDateString: 'local-date',
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    wrapper.findComponent({ name: 'NDatePicker' }).vm.$emit('update:value', 456)
    await nextTick()

    expect(wrapper.emitted('update:date')?.[0]).toEqual([456])
  })
})
