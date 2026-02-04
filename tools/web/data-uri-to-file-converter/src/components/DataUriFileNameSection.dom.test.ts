import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DataUriFileNameSection from './DataUriFileNameSection.vue'

const NInputStub = defineComponent({
  props: {
    value: String,
    placeholder: String,
  },
  emits: ['update:value'],
  template:
    '<input :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
})

const ToolSectionStub = defineComponent({
  template: '<section><slot /></section>',
})

describe('DataUriFileNameSection', () => {
  it('emits file name updates', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(DataUriFileNameSection, {
      props: {
        fileName: 'data.txt',
        'onUpdate:fileName': onUpdate,
      },
      global: {
        stubs: {
          NInput: NInputStub,
          ToolSection: ToolSectionStub,
        },
      },
    })

    const input = wrapper.get('input')
    expect(input.attributes('placeholder')).toBe('e.g. data.png')

    await input.setValue('report.json')
    expect(onUpdate).toHaveBeenCalledWith('report.json')
  })
})
