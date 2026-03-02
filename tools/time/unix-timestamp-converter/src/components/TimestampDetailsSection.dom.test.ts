import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TimestampDetailsSection from './TimestampDetailsSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDescriptions = defineComponent({
    name: 'NDescriptions',
    template: '<div class="descriptions"><slot /></div>',
  })

  const NDescriptionsItem = defineComponent({
    name: 'NDescriptionsItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    template: '<div class="description-item" :data-label="label"><slot /></div>',
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NTime = defineComponent({
    name: 'NTime',
    props: {
      time: {
        type: Number,
        required: false,
      },
      to: {
        type: Date,
        default: () => new Date(0),
      },
    },
    template: '<span class="n-time" :data-time="String(time)" :data-to="to.toISOString()" />',
  })

  return {
    NDescriptions,
    NDescriptionsItem,
    NFlex,
    NTime,
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

const sectionStub = {
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
}

describe('TimestampDetailsSection', () => {
  it('renders iso and utc details with relative time', () => {
    const now = new Date('2024-01-01T00:00:00.000Z')
    const wrapper = mount(TimestampDetailsSection, {
      props: {
        isoString: '2024-01-01T00:00:00.000Z',
        utcString: 'Mon, 01 Jan 2024 00:00:00 GMT',
        dateValue: 1704067200000,
        now,
      },
      global: {
        stubs: sectionStub,
      },
    })

    const labels = wrapper.findAll('.description-item').map((item) => item.attributes('data-label'))
    expect(labels).toEqual(['ISO 8601', 'UTC', 'Relative'])
    expect(wrapper.text()).toContain('2024-01-01T00:00:00.000Z')
    expect(wrapper.text()).toContain('Mon, 01 Jan 2024 00:00:00 GMT')
    expect(wrapper.find('.n-time').attributes('data-time')).toBe('1704067200000')
    expect(wrapper.find('.n-time').attributes('data-to')).toBe(now.toISOString())
  })

  it('passes undefined to relative time when date is missing', () => {
    const now = new Date('2024-01-01T00:00:00.000Z')
    const wrapper = mount(TimestampDetailsSection, {
      props: {
        isoString: '',
        utcString: '',
        dateValue: null,
        now,
      },
      global: {
        stubs: sectionStub,
      },
    })

    expect(wrapper.find('.n-time').attributes('data-time')).toBe('undefined')
    expect(wrapper.find('.n-time').attributes('data-to')).toBe(now.toISOString())
  })
})
