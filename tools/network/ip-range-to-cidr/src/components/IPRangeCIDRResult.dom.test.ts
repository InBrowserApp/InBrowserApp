import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import IPRangeCIDRResult from './IPRangeCIDRResult.vue'

vi.mock('cidr-calc', () => {
  class Cidr {
    value: string
    constructor(value: string) {
      this.value = value
    }
    toString() {
      return this.value
    }
  }

  class IpAddress {
    value: string
    constructor(value: string) {
      this.value = value
    }
    static of(value: string) {
      return new IpAddress(value)
    }
  }

  class IpRange {
    start: IpAddress
    end: IpAddress
    constructor(start: IpAddress, end: IpAddress) {
      this.start = start
      this.end = end
    }
    toCidrs() {
      return [new Cidr(`${this.start.value}/32`), new Cidr(`${this.end.value}/32`)]
    }
  }

  return {
    Cidr,
    IpAddress,
    IpRange,
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => `${key} ${params?.count ?? ''}`.trim(),
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NP = defineComponent({
    name: 'NP',
    template: '<p class="np"><slot /></p>',
  })

  const NUl = defineComponent({
    name: 'NUl',
    template: '<ul class="list"><slot /></ul>',
  })

  const NLi = defineComponent({
    name: 'NLi',
    template: '<li class="list-item"><slot /></li>',
  })

  return {
    NP,
    NUl,
    NLi,
  }
})

describe('IPRangeCIDRResult', () => {
  it('renders the computed CIDR list', () => {
    const wrapper = mount(IPRangeCIDRResult, {
      props: {
        ipRange: ['10.0.0.1', '10.0.0.2'],
      },
    })

    const items = wrapper.findAll('.list-item')
    expect(wrapper.text()).toContain('cidrsCount 2')
    expect(items).toHaveLength(2)
    expect(items[0]?.text()).toBe('10.0.0.1/32')
    expect(items[1]?.text()).toBe('10.0.0.2/32')
  })
})
