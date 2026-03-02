import { ref } from 'vue'
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const makeDOHQuery = vi.fn()

vi.mock('@utils/dns', () => ({
  makeDOHQuery,
}))

vi.mock('@vueuse/core', () => ({
  useStorage: (_key: string, initialValue: string | string[]) => ref(initialValue),
}))

vi.mock('@shared/ui/domain/domain', () => ({
  DomainInputFormItem: {
    props: ['domain'],
    emits: ['update:domain'],
    template: `<input class="domain-input" :value="domain" @input="$emit('update:domain', $event.target.value)" />`,
  },
  DNSRecordTypeInputFormItem: {
    props: ['types'],
    emits: ['update:types'],
    template: '<button class="record-types" @click="$emit(\'update:types\', [\'MX\'])" />',
  },
  DOHServerSelectFormItem: {
    props: ['value'],
    emits: ['update:value'],
    template: `<input class="doh-select" :value="value" @input="$emit('update:value', $event.target.value)" />`,
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

let DNSQuery: typeof import('./DNSQuery.vue').default

beforeAll(async () => {
  DNSQuery = (await import('./DNSQuery.vue')).default
})

beforeEach(() => {
  makeDOHQuery.mockReset()
})

describe('DNSQuery', () => {
  it('looks up DNS records and emits results', async () => {
    makeDOHQuery.mockResolvedValue({ Status: 0 })

    const wrapper = mount(DNSQuery)

    await wrapper.find('.domain-input').setValue('example.net')
    await wrapper.find('.doh-select').setValue('https://example.com/dns-query')
    await wrapper.find('.n-button').trigger('click')
    await flushPromises()

    expect(makeDOHQuery).toHaveBeenCalledWith('https://example.com/dns-query', {
      name: 'example.net',
      type: 'A',
    })
    expect(makeDOHQuery).toHaveBeenCalledWith('https://example.com/dns-query', {
      name: 'example.net',
      type: 'AAAA',
    })

    const emitted = wrapper.emitted('update:results') as unknown[][] | undefined
    const results = emitted?.[0]?.[0] as { question: { name: string; type: string } }[] | undefined
    expect(results).toHaveLength(2)
    expect(results?.[0]?.question).toEqual({ name: 'example.net', type: 'A' })
  })

  it('uses updated record types from v-model updates', async () => {
    makeDOHQuery.mockResolvedValue({ Status: 0 })

    const wrapper = mount(DNSQuery)

    await wrapper.find('.record-types').trigger('click')
    await wrapper.find('.n-button').trigger('click')
    await flushPromises()

    expect(makeDOHQuery).toHaveBeenCalledTimes(1)
    expect(makeDOHQuery).toHaveBeenCalledWith('https://cloudflare-dns.com/dns-query', {
      name: 'example.com',
      type: 'MX',
    })
  })

  it('logs errors when lookups fail', async () => {
    const error = new Error('lookup failed')
    makeDOHQuery.mockRejectedValueOnce(error)

    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(DNSQuery)

    await wrapper.find('.n-button').trigger('click')
    await flushPromises()

    expect(errorSpy).toHaveBeenCalledWith(error)
    expect(wrapper.emitted('update:results')).toBeUndefined()

    errorSpy.mockRestore()
  })
})
