import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BICSwiftResult from './BICSwiftResult.vue'
import { validateBIC } from '../data/bic'

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

describe('BICSwiftResult', () => {
  it('renders primary office details for BIC-8', () => {
    const wrapper = mount(BICSwiftResult, {
      props: {
        validationResult: validateBIC('DEUTDEFF'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Valid')
    expect(wrapper.text()).toContain('BIC-8')
    expect(wrapper.text()).toContain('DEUTDEFF')
    expect(wrapper.text()).toContain('DEUT')
    expect(wrapper.text()).toContain('XXX')
    expect(wrapper.text()).toContain('Primary Office')
    expect(wrapper.text()).toContain('Standard')
    expect(wrapper.text()).toContain('Supported')

    const copyContents = wrapper
      .findAll('.copy-button')
      .map((button) => button.attributes('data-content'))
    expect(copyContents).toEqual(expect.arrayContaining(['DEUTDEFF', 'DEUT', 'XXX']))
  })

  it('renders branch office details for BIC-11', () => {
    const wrapper = mount(BICSwiftResult, {
      props: {
        validationResult: validateBIC('DEUTDEFF500'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('BIC-11')
    expect(wrapper.text()).toContain('500')
    expect(wrapper.text()).toContain('Branch Office')

    const copyContents = wrapper
      .findAll('.copy-button')
      .map((button) => button.attributes('data-content'))
    expect(copyContents).toEqual(expect.arrayContaining(['DEUTDEFF500', 'DEUT', '500']))
  })
})
