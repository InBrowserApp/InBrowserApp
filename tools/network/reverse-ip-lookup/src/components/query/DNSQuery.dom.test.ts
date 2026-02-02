import { ref } from 'vue'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const makeDOHQuery = vi.fn()
const reverseIPDomain = vi.fn((ip: string) => `reverse:${ip}`)

vi.mock('@utils/dns', () => ({
  makeDOHQuery,
  ReverseIPDomain: reverseIPDomain,
}))

vi.mock('@vueuse/core', () => ({
  useStorage: (_key: string, initialValue: string) => ref(initialValue),
}))

vi.mock('@shared/ui/domain/domain', () => ({
  DOHServerSelectFormItem: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="doh-select" :value="value" @input="$emit('update:value', $event.target.value)" />`,
  },
}))

vi.mock('@shared/ui/domain/ip', () => ({
  IPInputFormItem: {
    props: ['ip'],
    emits: ['update:ip'],
    template: `<input class="ip-input" :value="ip" @input="$emit('update:ip', $event.target.value)" />`,
  },
}))

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<h2 class="section-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', () => ({
  NButton: {
    props: ['loading'],
    emits: ['click'],
    template: `<button class="n-button" :data-loading="loading ? 'true' : 'false'" @click="$emit('click')"><slot name="icon" /><slot /></button>`,
  },
  NIcon: {
    template: '<span class="n-icon"><slot /></span>',
  },
}))

vi.mock('@vicons/fluent/DocumentSearch16Regular', () => ({
  default: {
    template: '<svg class="document-search" />',
  },
}))

let DNSQuery: typeof import('./DNSQuery.vue').default

beforeAll(async () => {
  DNSQuery = (await import('./DNSQuery.vue')).default
})

beforeEach(() => {
  makeDOHQuery.mockReset()
  reverseIPDomain.mockClear()
})

describe('DNSQuery', () => {
  it('runs a reverse lookup and emits the result', async () => {
    const response = { Status: 0 }
    makeDOHQuery.mockResolvedValueOnce(response)

    const wrapper = mount(DNSQuery)

    await wrapper.find('.ip-input').setValue('8.8.8.8')
    await wrapper.find('.doh-select').setValue('https://example.com/dns-query')
    await wrapper.find('.n-button').trigger('click')
    await flushPromises()

    expect(reverseIPDomain).toHaveBeenCalledWith('8.8.8.8')
    expect(makeDOHQuery).toHaveBeenCalledWith('https://example.com/dns-query', {
      name: 'reverse:8.8.8.8',
      type: 'PTR',
    })
    expect(wrapper.emitted('update:result')?.[0]?.[0]).toBe(response)
  })

  it('logs errors when lookups fail', async () => {
    const error = new Error('lookup failed')
    makeDOHQuery.mockRejectedValueOnce(error)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(DNSQuery)

    await wrapper.find('.n-button').trigger('click')
    await flushPromises()

    expect(errorSpy).toHaveBeenCalledWith(error)
    expect(wrapper.emitted('update:result')).toBeUndefined()

    errorSpy.mockRestore()
  })
})
