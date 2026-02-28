import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import TimeDifferenceResults from './TimeDifferenceResults.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const Base = defineComponent({
    inheritAttrs: false,
    template: '<div><slot /></div>',
  })

  return {
    NDescriptions: Base,
    NDescriptionsItem: Base,
    NFlex: Base,
  }
})

const emptyProps = {
  signedDurationLabel: '',
  absoluteDurationLabel: '',
  isoDuration: '',
  totalMilliseconds: '',
  totalSeconds: '',
  totalMinutes: '',
  totalHours: '',
  totalDays: '',
}

describe('TimeDifferenceResults', () => {
  it('shows placeholders when values are empty', () => {
    const wrapper = mount(TimeDifferenceResults, {
      props: emptyProps,
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<header><slot /></header>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: {
            template: '<button class="copy-btn" />',
          },
        },
      },
    })

    const codes = wrapper.findAll('code')
    expect(codes).toHaveLength(8)
    expect(codes[0]?.text()).toBe('-')
    expect(wrapper.findAll('.copy-btn')).toHaveLength(0)
  })

  it('renders copy buttons when values are present', () => {
    const wrapper = mount(TimeDifferenceResults, {
      props: {
        signedDurationLabel: '1d 00:00:00.000',
        absoluteDurationLabel: '1d 00:00:00.000',
        isoDuration: 'P1D',
        totalMilliseconds: '86400000',
        totalSeconds: '86400',
        totalMinutes: '1440',
        totalHours: '24',
        totalDays: '1',
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<header><slot /></header>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: {
            template: '<button class="copy-btn" />',
          },
        },
      },
    })

    expect(wrapper.findAll('.copy-btn')).toHaveLength(8)
  })
})
