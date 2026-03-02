import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IcalEventOutputSection from './IcalEventOutputSection.vue'
vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<header><slot /></header>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
}))
vi.mock('@shared/ui/base', () => ({
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy-button" />',
  },
}))
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /><slot name="icon" /></div>',
  })
  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: undefined,
      },
      download: {
        type: String,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    template:
      '<component :is="tag" class="n-button" :href="href" :download="download" :disabled="disabled"><slot /><slot name="icon" /></component>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    template: '<textarea class="n-input" />',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton,
    NCard: StubBase,
    NIcon: StubBase,
    NInput,
    NText: StubBase,
  }
})
describe('IcalEventOutputSection', () => {
  it('renders error messages and empty state', () => {
    const errorWrapper = mount(IcalEventOutputSection, {
      props: {
        icsContent: '',
        outputErrorKey: 'invalid-date-time',
      },
    })
    expect(errorWrapper.text()).toContain('Invalid date/time')
    const emptyWrapper = mount(IcalEventOutputSection, {
      props: {
        icsContent: '',
      },
    })
    expect(emptyWrapper.text()).toContain('Fill in a valid start time to generate the .ics file.')
  })
  it('renders download and copy actions when content is present', () => {
    const wrapper = mount(IcalEventOutputSection, {
      props: {
        icsContent: 'BEGIN:VCALENDAR',
        icsHref: 'blob:mock',
      },
    })
    expect(wrapper.find('.copy-button').exists()).toBe(true)
    const link = wrapper.find('a.n-button')
    expect(link.attributes('href')).toBe('blob:mock')
    expect(link.attributes('download')).toBe('event.ics')
  })
})
