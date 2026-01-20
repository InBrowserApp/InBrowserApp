import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmailResult from './EmailResult.vue'
import { validateEmail } from '../data/email'

const stubs = {
  NDescriptions: {
    template: '<div class="n-descriptions"><slot /></div>',
  },
  NDescriptionsItem: {
    props: ['label'],
    template:
      '<div class="n-descriptions-item"><span class="label">{{ label }}</span><slot /></div>',
  },
  NTag: {
    props: ['type'],
    template: '<span class="n-tag" :data-type="type"><slot /></span>',
  },
  NText: {
    props: ['tag', 'depth', 'code'],
    template: '<span class="n-text"><slot /></span>',
  },
  NFlex: {
    template: '<div class="n-flex"><slot /></div>',
  },
  CopyToClipboardButton: {
    props: ['content'],
    template: '<button class="copy-button" :data-content="content" />',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}

describe('EmailResult', () => {
  it('renders details for a valid email', () => {
    const wrapper = mount(EmailResult, {
      props: {
        validationResult: validateEmail('hello@example.com'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Valid')
    expect(wrapper.text()).toContain('hello@example.com')
    expect(wrapper.text()).toContain('hello')
    expect(wrapper.text()).toContain('example.com')

    const copyContents = wrapper
      .findAll('.copy-button')
      .map((button) => button.attributes('data-content'))
    expect(copyContents).toEqual(
      expect.arrayContaining(['hello@example.com', 'hello', 'example.com']),
    )
  })

  it('renders placeholders for invalid input', () => {
    const wrapper = mount(EmailResult, {
      props: {
        validationResult: validateEmail('not-an-email'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Invalid')
    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })

  it('renders not available for empty input lengths', () => {
    const wrapper = mount(EmailResult, {
      props: {
        validationResult: validateEmail(''),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not available')
  })

  it('shows fail status for dot placement errors', () => {
    const wrapper = mount(EmailResult, {
      props: {
        validationResult: validateEmail('user..name@example.com'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Fail')
  })
})
