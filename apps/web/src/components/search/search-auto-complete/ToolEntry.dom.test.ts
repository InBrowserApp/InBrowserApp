import { mount } from '@vue/test-utils'
import type { ToolInfo } from '@shared/tools'
import { describe, expect, it } from 'vitest'
import ToolEntry from './ToolEntry.vue'

describe('ToolEntry', () => {
  it('renders tool name and description using the provided i18n meta', () => {
    const wrapper = mount(ToolEntry, {
      props: {
        info: {
          toolID: 'tool-entry',
          path: '/tools/tool-entry',
          tags: [],
          features: [],
          meta: {
            en: {
              name: 'Tool Entry',
              description: 'Entry description',
            },
          },
        } as unknown as ToolInfo,
      },
      global: {
        stubs: {
          CustomRouterLink: {
            name: 'CustomRouterLink',
            props: ['to'],
            template: '<a data-test="router-link" :data-target="JSON.stringify(to)"><slot /></a>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Tool Entry')
    expect(wrapper.text()).toContain('Entry description')
    expect(wrapper.get('[data-test="router-link"]').attributes('data-target')).toContain(
      '/tools/tool-entry',
    )
  })
})
