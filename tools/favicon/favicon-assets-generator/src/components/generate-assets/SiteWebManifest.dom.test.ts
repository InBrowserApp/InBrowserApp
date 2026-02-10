import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import type { GeneralInfoOptions } from '../../utils/favicon-generator/general-info'
import SiteWebManifest from './SiteWebManifest.vue'

const generateManifestTextMock = vi.fn()

vi.mock('../../utils/favicon-generator/general-info', () => ({
  generateManifestText: (...args: unknown[]) => generateManifestTextMock(...args),
}))

const NCodeStub = defineComponent({
  name: 'NCode',
  props: {
    code: {
      type: String,
      default: '',
    },
  },
  template: '<pre class="n-code">{{ code }}</pre>',
})

describe('SiteWebManifest', () => {
  it('renders manifest text from options', () => {
    const options: GeneralInfoOptions = {
      name: 'App',
      short_name: 'App',
      description: 'Description',
      start_url: '/',
      display: 'standalone',
      theme_color: '#ffffff',
      theme_color_dark_enabled: false,
      theme_color_dark: '#000000',
      background_color: '#cccccc',
      path: '/assets/',
    }

    generateManifestTextMock.mockReturnValue('{"name":"App"}')

    const wrapper = mount(SiteWebManifest, {
      props: {
        generalInfoOptions: options,
      },
      global: {
        stubs: {
          NCode: NCodeStub,
        },
      },
    })

    expect(generateManifestTextMock).toHaveBeenCalledWith(options)
    expect(wrapper.find('.n-code').text()).toContain('"name":"App"')
  })
})
