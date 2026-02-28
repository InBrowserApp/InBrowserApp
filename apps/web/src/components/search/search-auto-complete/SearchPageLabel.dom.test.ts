import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SearchPageLabel from './SearchPageLabel.vue'

describe('SearchPageLabel', () => {
  it('renders the localized label and links to tools route with query', () => {
    const wrapper = mount(SearchPageLabel, {
      props: {
        query: 'json',
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

    expect(wrapper.text()).toContain('Search json')
    const target = wrapper.get('[data-test="router-link"]').attributes('data-target')

    expect(target).toContain('"name":"tools"')
    expect(target).toContain('"query":"json"')
  })
})
