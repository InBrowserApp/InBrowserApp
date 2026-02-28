import { beforeEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CIDRsMergeExcludeResult from './CIDRsMergeExcludeResult.vue'

const { excludeCidrMock } = vi.hoisted(() => ({
  excludeCidrMock: vi.fn(),
}))

vi.mock('cidr-tools', () => ({
  excludeCidr: (...args: unknown[]) => excludeCidrMock(...args),
}))

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

beforeEach(() => {
  excludeCidrMock.mockReset()
})

describe('CIDRsMergeExcludeResult', () => {
  it('renders merged CIDRs when available', () => {
    excludeCidrMock.mockReturnValue(['10.0.0.0/24'])

    const wrapper = mount(CIDRsMergeExcludeResult, {
      props: {
        cidrsToMerge: ['10.0.0.0/24'],
        cidrsToExclude: [],
      },
    })

    expect(wrapper.findAll('.list-item')).toHaveLength(1)
    expect(wrapper.text()).toContain('10.0.0.0/24')
  })

  it('renders an empty state when no CIDRs remain', () => {
    excludeCidrMock.mockReturnValue([])

    const wrapper = mount(CIDRsMergeExcludeResult, {
      props: {
        cidrsToMerge: ['10.0.0.0/24'],
        cidrsToExclude: ['10.0.0.0/24'],
      },
    })

    expect(wrapper.text()).toContain('No CIDRs')
  })

  it('renders an error state when exclusion fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    excludeCidrMock.mockImplementation(() => {
      throw new Error('boom')
    })

    const wrapper = mount(CIDRsMergeExcludeResult, {
      props: {
        cidrsToMerge: ['10.0.0.0/24'],
        cidrsToExclude: [],
      },
    })

    expect(wrapper.text()).toContain('Error')
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
