import { beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('./query/DNSQuery.vue', () => ({
  default: {
    emits: ['update:results'],
    template: `<button class="dns-query" @click="$emit('update:results', [
      { question: { name: 'example.com', type: 'A' }, result: { Answer: [] } },
      { question: { name: 'example.com', type: 'AAAA' }, result: null },
    ])" />`,
  },
}))

vi.mock('@shared/ui/domain/domain', () => ({
  DNSResult: {
    props: ['result', 'title'],
    template: '<div class="dns-result" :data-title="title" />',
  },
}))

vi.mock('naive-ui', () => ({
  NP: {
    template: '<p class="n-p"><slot /></p>',
  },
}))

let DNSLookup: typeof import('./DNSLookup.vue').default

beforeAll(async () => {
  DNSLookup = (await import('./DNSLookup.vue')).default
})

describe('DNSLookup', () => {
  it('renders DNS results for resolved records', async () => {
    const wrapper = mount(DNSLookup)

    expect(wrapper.find('.dns-result').exists()).toBe(false)

    await wrapper.find('.dns-query').trigger('click')

    const results = wrapper.findAll('.dns-result')
    expect(results).toHaveLength(1)
    expect(results[0]!.attributes('data-title')).toBe('A')
  })
})
