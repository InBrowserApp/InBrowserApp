import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VINResult from './VINResult.vue'
import { validateVIN } from '../data/vin'

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

describe('VINResult', () => {
  it('renders valid VIN details', () => {
    const wrapper = mount(VINResult, {
      props: {
        validationResult: validateVIN('1M8GDM9AXKP042788'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Valid')
    expect(wrapper.text()).toContain('Pass')
    expect(wrapper.text()).toContain('1M8GDM9AXKP042788')
    expect(wrapper.text()).toContain('X')

    const copyContents = wrapper
      .findAll('.copy-button')
      .map((button) => button.attributes('data-content'))
    expect(copyContents).toEqual(expect.arrayContaining(['1M8GDM9AXKP042788']))
  })

  it('shows not available when length is invalid', () => {
    const wrapper = mount(VINResult, {
      props: {
        validationResult: validateVIN('123'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.text()).toContain('Fail')
  })

  it('flags invalid characters', () => {
    const wrapper = mount(VINResult, {
      props: {
        validationResult: validateVIN('1IOGDM9AXKP042788'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Fail')
    expect(wrapper.text()).toContain('Characters')
  })

  it('flags check digit mismatch', () => {
    const wrapper = mount(VINResult, {
      props: {
        validationResult: validateVIN('1M8GDM9A1KP042788'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Fail')
    expect(wrapper.text()).toContain('Expected')
    expect(wrapper.text()).toContain('Actual')
  })

  it('renders placeholders when input is empty', () => {
    const wrapper = mount(VINResult, {
      props: {
        validationResult: validateVIN(''),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })
})
