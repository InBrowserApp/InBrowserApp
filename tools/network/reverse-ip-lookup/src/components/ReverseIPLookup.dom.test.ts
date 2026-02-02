import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('./query/DNSQuery.vue', () => ({
  default: {
    emits: ['update:result'],
    template: `<button class="dns-query" @click="$emit('update:result', { Answer: [{ name: 'example.com' }] })" />`,
  },
}))

vi.mock('@shared/ui/domain/domain', () => ({
  DNSResult: {
    props: ['result'],
    template: '<div class="dns-result" :data-result="JSON.stringify(result)" />',
  },
}))

let ReverseIPLookup: typeof import('./ReverseIPLookup.vue').default

beforeAll(async () => {
  ReverseIPLookup = (await import('./ReverseIPLookup.vue')).default
})

describe('ReverseIPLookup', () => {
  it('renders results when the query emits an update', async () => {
    const wrapper = mount(ReverseIPLookup)

    expect(wrapper.find('.dns-result').exists()).toBe(false)

    await wrapper.find('.dns-query').trigger('click')

    const result = wrapper.find('.dns-result')
    expect(result.exists()).toBe(true)
    expect(result.attributes('data-result')).toContain('example.com')
  })
})
