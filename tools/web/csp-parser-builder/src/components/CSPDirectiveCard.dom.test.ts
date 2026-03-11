import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NDynamicInput } from 'naive-ui'
import CSPDirectiveCard from './CSPDirectiveCard.vue'

describe('CSPDirectiveCard', () => {
  it('emits directive updates when tokens change', async () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: 'img-src',
          tokens: [{ type: 'scheme', value: 'data:' }],
        },
        known: true,
        flag: false,
        quickTokens: ["'self'"],
      },
    })

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('https:')

    const events = wrapper.emitted('update:directive') ?? []
    expect(events[events.length - 1]?.[0]).toEqual({
      name: 'img-src',
      tokens: [{ type: 'scheme', value: 'https:' }],
    })
  })

  it('adds quick tokens', async () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: 'img-src',
          tokens: [],
        },
        known: true,
        flag: false,
        quickTokens: ["'self'"],
      },
    })

    await wrapper.get('button.n-button--secondary').trigger('click')

    const events = wrapper.emitted('update:directive') ?? []
    expect(events[events.length - 1]?.[0]).toEqual({
      name: 'img-src',
      tokens: [{ type: 'keyword', value: "'self'" }],
    })
  })

  it('emits remove when requested', async () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: 'img-src',
          tokens: [],
        },
        known: true,
        flag: true,
        quickTokens: [],
        removable: true,
      },
    })

    await wrapper.get('[data-testid="remove-directive"]').trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('supports custom directives and syncs prop updates', async () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: 'x-test',
          tokens: [],
        },
        known: false,
        flag: false,
        quickTokens: [],
      },
    })

    await wrapper.get('input').setValue(' X-Custom ')

    const events = wrapper.emitted('update:directive') ?? []
    expect(events[events.length - 1]?.[0]).toEqual({
      name: 'x-custom',
      tokens: [],
    })

    await wrapper.setProps({
      directive: {
        name: 'x-next',
        tokens: [{ type: 'scheme', value: 'https:' }],
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0]?.element.value).toBe('x-next')
    expect(inputs[1]?.element.value).toBe('https:')
  })

  it('creates empty token rows through the dynamic input factory', () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: 'script-src',
          tokens: [],
        },
        known: true,
        flag: false,
        quickTokens: [],
      },
    })

    const onCreate = wrapper.getComponent(NDynamicInput).props('onCreate') as
      | ((value?: unknown) => string)
      | undefined

    expect(onCreate?.(undefined)).toBe('')
  })

  it('uses the custom fallback id and creates token inputs from the UI', async () => {
    const wrapper = mount(CSPDirectiveCard, {
      props: {
        directive: {
          name: '',
          tokens: [],
        },
        known: false,
        flag: false,
        quickTokens: [],
      },
    })

    expect(wrapper.find('[data-testid="directive-card-custom"]').exists()).toBe(true)

    const addTokenButton = wrapper.findAll('button').find((button) => button.text() === 'Add token')
    if (!addTokenButton) {
      throw new Error('Missing add token button')
    }

    await addTokenButton.trigger('click')

    expect(wrapper.findAll('input')).toHaveLength(2)
  })
})
