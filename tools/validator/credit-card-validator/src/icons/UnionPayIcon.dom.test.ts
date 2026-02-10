import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { UnionPayIcon } from './UnionPayIcon'

describe('UnionPayIcon', () => {
  it('renders the svg icon markup', () => {
    const wrapper = mount(UnionPayIcon)

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(true)
  })
})
