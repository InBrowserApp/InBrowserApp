import { beforeEach, describe, expect, it } from 'vitest'
import { config, mount } from '@vue/test-utils'
import WhatIsIMEIValidator from './WhatIsIMEIValidator.vue'

const stubs = {
  NText: {
    template: '<p class="n-text"><slot /></p>',
  },
  NH3: {
    template: '<h3 class="n-h3"><slot /></h3>',
  },
  NOl: {
    template: '<ol class="n-ol"><slot /></ol>',
  },
  NLi: {
    template: '<li class="n-li"><slot /></li>',
  },
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-section-header"><slot /></h2>',
  },
}

describe('WhatIsIMEIValidator', () => {
  beforeEach(() => {
    const i18n = config.global.plugins?.[0] as
      | { global?: { locale?: { value: string } } }
      | undefined
    if (i18n?.global?.locale) {
      i18n.global.locale.value = 'en'
    }
  })

  it('renders title and checks in English', () => {
    const wrapper = mount(WhatIsIMEIValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('What is IMEI?')
    expect(wrapper.text()).toContain('What this validator checks')
    expect(wrapper.text()).toContain('Length: IMEI must be exactly 15 digits')
  })

  it('renders localized Spanish copy', () => {
    const i18n = config.global.plugins?.[0] as
      | { global?: { locale?: { value: string } } }
      | undefined
    if (i18n?.global?.locale) {
      i18n.global.locale.value = 'es'
    }

    const wrapper = mount(WhatIsIMEIValidator, {
      global: {
        stubs,
      },
    })

    expect(wrapper.text()).toContain('¿Qué es el IMEI?')
    expect(wrapper.text()).toContain('Qué valida este verificador')
    expect(wrapper.text()).toContain('Longitud: el IMEI debe tener exactamente 15 dígitos')
    expect(wrapper.text()).not.toContain('What is IMEI?')
  })
})
