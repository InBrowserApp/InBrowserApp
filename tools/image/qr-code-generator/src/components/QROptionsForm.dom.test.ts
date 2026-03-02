import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import QROptionsForm from './QROptionsForm.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    props: ['label', 'showFeedback'],
    template: '<div class="n-form-item-gi"><slot /></div>',
  })

  const createModelStub = (name: string, className: string) =>
    defineComponent({
      name,
      props: ['value'],
      emits: ['update:value'],
      template: `<div class="${className}" :data-value="value" />`,
    })

  return {
    NGrid,
    NFormItemGi,
    NSelect: createModelStub('NSelect', 'n-select'),
    NSlider: createModelStub('NSlider', 'n-slider'),
    NColorPicker: createModelStub('NColorPicker', 'n-color-picker'),
  }
})

const baseProps = {
  errorCorrectionLevel: 'M' as const,
  width: 256,
  margin: 4,
  dark: '#000000FF',
  light: '#FFFFFFFF',
}

describe('QROptionsForm', () => {
  it('renders option controls', () => {
    const wrapper = mount(QROptionsForm, {
      props: baseProps,
    })

    expect(wrapper.findAllComponents({ name: 'NFormItemGi' })).toHaveLength(5)
    expect(wrapper.findComponent({ name: 'NSelect' }).exists()).toBe(true)
    expect(wrapper.findAllComponents({ name: 'NSlider' })).toHaveLength(2)
    expect(wrapper.findAllComponents({ name: 'NColorPicker' })).toHaveLength(2)
  })

  it('emits updates from controls', async () => {
    const wrapper = mount(QROptionsForm, {
      props: baseProps,
    })

    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'Q')
    wrapper.findAllComponents({ name: 'NSlider' })[0]?.vm.$emit('update:value', 320)
    wrapper.findAllComponents({ name: 'NSlider' })[1]?.vm.$emit('update:value', 8)
    wrapper.findAllComponents({ name: 'NColorPicker' })[0]?.vm.$emit('update:value', '#111111FF')
    wrapper.findAllComponents({ name: 'NColorPicker' })[1]?.vm.$emit('update:value', '#EEEEEEFF')

    await nextTick()

    expect(wrapper.emitted()['update:error-correction-level']?.[0]).toEqual(['Q'])
    expect(wrapper.emitted()['update:width']?.[0]).toEqual([320])
    expect(wrapper.emitted()['update:margin']?.[0]).toEqual([8])
    expect(wrapper.emitted()['update:dark']?.[0]).toEqual(['#111111FF'])
    expect(wrapper.emitted()['update:light']?.[0]).toEqual(['#EEEEEEFF'])
  })
})
