import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import CSPDirectiveCard from './CSPDirectiveCard.vue'
import CSPDirectivesSection from './CSPDirectivesSection.vue'

describe('CSPDirectivesSection', () => {
  it('adds a selected directive', async () => {
    const wrapper = mount(CSPDirectivesSection, {
      props: {
        directives: [],
        'onUpdate:directives': () => undefined,
      },
    })

    ;(wrapper.vm as unknown as { addDirective: () => void }).addDirective()
    expect(wrapper.emitted('update:directives')).toBeUndefined()

    const select = wrapper.getComponent(NSelect)
    await select.vm.$emit('update:value', 'script-src')
    await wrapper.get('button').trigger('click')

    const events = wrapper.emitted('update:directives') ?? []
    expect(events[events.length - 1]?.[0]).toEqual([{ name: 'script-src', tokens: [] }])
  })

  it('removes a directive card', async () => {
    const wrapper = mount(CSPDirectivesSection, {
      props: {
        directives: [{ name: 'script-src', tokens: [] }],
        'onUpdate:directives': () => undefined,
      },
    })

    await wrapper.get('[data-testid="remove-directive"]').trigger('click')

    const events = wrapper.emitted('update:directives') ?? []
    expect(events[events.length - 1]?.[0]).toEqual([])
  })

  it('renders the empty state and propagates directive updates', async () => {
    const emptyWrapper = mount(CSPDirectivesSection, {
      props: {
        directives: [],
        'onUpdate:directives': () => undefined,
      },
    })

    expect(emptyWrapper.text()).toContain('No directives are available yet.')

    const wrapper = mount(CSPDirectivesSection, {
      props: {
        directives: [
          { name: 'script-src', tokens: [] },
          { name: 'x-extra', tokens: [] },
        ],
        'onUpdate:directives': () => undefined,
      },
    })

    wrapper.getComponent(CSPDirectiveCard).vm.$emit('update:directive', {
      name: 'script-src',
      tokens: [{ type: 'scheme', value: 'https:' }],
    })
    await wrapper.vm.$nextTick()

    const events = wrapper.emitted('update:directives') ?? []
    expect(events[events.length - 1]?.[0]).toEqual([
      { name: 'script-src', tokens: [{ type: 'scheme', value: 'https:' }] },
      { name: 'x-extra', tokens: [] },
    ])
  })
})
