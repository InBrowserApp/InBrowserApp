import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NInputNumber } from 'naive-ui'
import ClockSeqInput from './ClockSeqInput.vue'

describe('ClockSeqInput v1', () => {
  it('emits clock sequence updates', () => {
    const wrapper = mount(ClockSeqInput, {
      props: {
        clockSeq: 1,
      },
    })

    wrapper.findComponent(NInputNumber).vm.$emit('update:value', 1024)

    expect(wrapper.emitted('update:clockSeq')?.[0]).toEqual([1024])
  })
})
