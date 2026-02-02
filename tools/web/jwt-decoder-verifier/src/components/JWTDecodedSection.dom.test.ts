import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JWTDecodedSection from './JWTDecodedSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

const JWTJsonCardStub = defineComponent({
  name: 'JWTJsonCard',
  props: {
    json: {
      type: Object,
      default: null,
    },
  },
  template: '<div data-testid="json-card" />',
})

describe('JWTDecodedSection', () => {
  it('renders nothing when payload is missing', () => {
    const wrapper = mount(JWTDecodedSection, {
      props: {
        decodedPayload: null,
        decodedHeader: null,
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          NGrid: {
            template: '<div><slot /></div>',
          },
          NGi: {
            template: '<div><slot /></div>',
          },
          NH3: {
            template: '<h3><slot /></h3>',
          },
          JWTJsonCard: JWTJsonCardStub,
        },
      },
    })

    expect(wrapper.text()).not.toContain('decoded')
    expect(wrapper.findComponent(JWTJsonCardStub).exists()).toBe(false)
  })

  it('renders header and payload cards when decoded', () => {
    const wrapper = mount(JWTDecodedSection, {
      props: {
        decodedPayload: { sub: 'user' },
        decodedHeader: { alg: 'HS256' },
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          NGrid: {
            template: '<div><slot /></div>',
          },
          NGi: {
            template: '<div><slot /></div>',
          },
          NH3: {
            template: '<h3><slot /></h3>',
          },
          JWTJsonCard: JWTJsonCardStub,
        },
      },
    })

    expect(wrapper.text()).toContain('decoded')
    const cards = wrapper.findAllComponents(JWTJsonCardStub)
    expect(cards).toHaveLength(2)
    expect(cards[0]?.props('json')).toEqual({ sub: 'user' })
    expect(cards[1]?.props('json')).toEqual({ alg: 'HS256' })
  })
})
