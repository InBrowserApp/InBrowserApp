import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CertificatePublicKeyParserView from './CertificatePublicKeyParserView.vue'
import * as toolInfo from './info'

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ParserStub = defineComponent({
  name: 'CertificatePublicKeyParser',
  template: '<div data-testid="parser" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsCertificatePublicKey',
  template: '<div data-testid="what-is" />',
})

describe('CertificatePublicKeyParserView', () => {
  it('renders the layout and sections', () => {
    const wrapper = mount(CertificatePublicKeyParserView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          CertificatePublicKeyParser: ParserStub,
          WhatIsCertificatePublicKey: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)
    expect(wrapper.find('[data-testid="parser"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="what-is"]').exists()).toBe(true)
  })
})
