import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VATResult from './VATResult.vue'
import { validateVAT } from '../data/vat'

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

describe('VATResult', () => {
  it('renders valid VAT details', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('BE0123456749'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Valid')
    expect(wrapper.text()).toContain('Supported')
    expect(wrapper.text()).toContain('Pass')
    expect(wrapper.text()).toContain('10 digits')
    expect(wrapper.text()).toContain('BE0123456749')
    expect(wrapper.text()).toContain('0123456749')

    const copyContents = wrapper
      .findAll('.copy-button')
      .map((button) => button.attributes('data-content'))
    expect(copyContents).toEqual(expect.arrayContaining(['BE0123456749', '0123456749']))
  })

  it('shows unsupported country status', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('US123456789'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Unsupported')
    expect(wrapper.text()).toContain('US')
    expect(wrapper.text()).toContain('Fail')
  })

  it('shows invalid country code status', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('1A123'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Invalid code')
  })

  it('shows checksum not supported for format-only countries', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('BG123456789'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not supported')
  })

  it('shows checksum failure when checksum is invalid', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('BE0123456748'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Fail')
    expect(wrapper.text()).not.toContain('Not supported')
  })

  it('shows checksum not available when format is invalid', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT('BE123'),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not available')
  })

  it('renders placeholders when input is empty', () => {
    const wrapper = mount(VATResult, {
      props: {
        validationResult: validateVAT(''),
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('Not available')
    expect(wrapper.findAll('.copy-button')).toHaveLength(0)
  })

  it('falls back to country code when display names are unavailable', () => {
    const originalDisplayNames = Intl.DisplayNames
    ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames = undefined

    try {
      const wrapper = mount(VATResult, {
        props: {
          validationResult: validateVAT('BE0123456749'),
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).not.toContain('Belgium')
    } finally {
      ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
        originalDisplayNames
    }
  })

  it('falls back when display names return nullish values', () => {
    const originalDisplayNames = Intl.DisplayNames

    class DisplayNamesMock {
      of() {
        return undefined
      }
    }

    ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
      DisplayNamesMock as unknown as typeof Intl.DisplayNames

    try {
      const wrapper = mount(VATResult, {
        props: {
          validationResult: validateVAT('BE0123456749'),
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('BE')
      expect(wrapper.text()).not.toContain('Belgium')
    } finally {
      ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
        originalDisplayNames
    }
  })

  it('uses display names when fallback succeeds', () => {
    const originalDisplayNames = Intl.DisplayNames
    let shouldThrow = true

    class DisplayNamesMock {
      constructor() {
        if (shouldThrow) {
          shouldThrow = false
          throw new Error('boom')
        }
      }

      of(code: string) {
        return code === 'BE' ? 'Belgium' : code
      }
    }

    ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
      DisplayNamesMock as unknown as typeof Intl.DisplayNames

    try {
      const wrapper = mount(VATResult, {
        props: {
          validationResult: validateVAT('BE0123456749'),
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Belgium (BE)')
    } finally {
      ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
        originalDisplayNames
    }
  })

  it('maps EL to GR for display names', () => {
    const originalDisplayNames = Intl.DisplayNames

    class DisplayNamesMock {
      of(code: string) {
        return code === 'GR' ? 'Greece' : code
      }
    }

    ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
      DisplayNamesMock as unknown as typeof Intl.DisplayNames

    try {
      const wrapper = mount(VATResult, {
        props: {
          validationResult: validateVAT('EL123456789'),
        },
        global: {
          stubs,
        },
      })

      expect(wrapper.text()).toContain('Greece (EL)')
    } finally {
      ;(Intl as unknown as { DisplayNames?: typeof Intl.DisplayNames }).DisplayNames =
        originalDisplayNames
    }
  })
})
