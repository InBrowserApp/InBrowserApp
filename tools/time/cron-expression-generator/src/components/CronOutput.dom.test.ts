import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronOutput from './CronOutput.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy" :data-content="content" />',
  },
}))

describe('CronOutput', () => {
  it('shows human description when provided', () => {
    const wrapper = mount(CronOutput, {
      props: {
        expression: '*/5 * * * *',
        humanDescription: 'Every 5 minutes',
      },
    })

    expect(wrapper.text()).toContain('Every 5 minutes')
    expect(wrapper.text()).not.toContain('Invalid cron expression')
    expect(wrapper.find('.copy').attributes('data-content')).toBe('*/5 * * * *')
  })

  it('shows invalid state when description is empty', () => {
    const wrapper = mount(CronOutput, {
      props: {
        expression: 'invalid',
        humanDescription: '',
      },
    })

    expect(wrapper.text()).toContain('Invalid cron expression')
  })
})
