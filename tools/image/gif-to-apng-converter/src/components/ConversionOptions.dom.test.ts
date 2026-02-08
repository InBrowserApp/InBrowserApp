import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ConversionOptions from './ConversionOptions.vue'

vi.mock('naive-ui', () => {
  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: ['value'],
    emits: ['update:value'],
    template: '<div class="input-number"><slot /></div>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: ['value', 'options'],
    emits: ['update:value'],
    template: '<div class="select"><slot /></div>',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    props: ['value'],
    emits: ['update:value'],
    template: '<div class="switch"><slot /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="convert-btn" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })

  const NCollapseTransition = defineComponent({
    name: 'NCollapseTransition',
    props: {
      show: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div><slot v-if="show" /></div>',
  })

  return {
    NButton,
    NCollapseTransition,
    NFlex: BaseStub,
    NFormItemGi: BaseStub,
    NGrid: BaseStub,
    NIcon: BaseStub,
    NInputNumber,
    NSelect,
    NSwitch,
    NText: BaseStub,
  }
})

vi.mock('@shared/ui/tool', () => {
  const BaseStub = defineComponent({
    name: 'BaseStub',
    template: '<div><slot /></div>',
  })

  return {
    ToolSection: BaseStub,
    ToolSectionHeader: BaseStub,
  }
})

const baseProps = {
  title: 'Options',
  scaleLabel: 'Scale',
  scaleHint: 'Scale hint',
  speedLabel: 'Speed',
  speedHint: 'Speed hint',
  loopLabel: 'Loop',
  loopHint: 'Loop hint',
  loopCountLabel: 'Loop count',
  loopInheritLabel: 'Inherit',
  loopInfiniteLabel: 'Infinite',
  loopCustomLabel: 'Custom',
  optimizeLabel: 'Optimize',
  optimizeLevelLabel: 'Optimize level',
  optimizeHint: 'Optimize hint',
  convertLabel: 'Convert',
  convertingLabel: 'Converting',
  minScale: 10,
  maxScale: 200,
  minSpeed: 0.25,
  maxSpeed: 4,
  isConverting: false,
  canConvert: true,
  scale: 100,
  speed: 1,
  loopMode: 'custom' as const,
  loopCount: 2,
  optimize: true,
  optimizeLevel: 3,
}

describe('ConversionOptions', () => {
  it('forwards template model updates and convert clicks', async () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        ...baseProps,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const scaleInput = inputs[0]
    const speedInput = inputs[1]
    const loopCountInput = inputs[2]
    const optimizeLevelInput = inputs[3]

    scaleInput?.vm.$emit('update:value', 120)
    speedInput?.vm.$emit('update:value', 1.5)
    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'infinite')
    loopCountInput?.vm.$emit('update:value', 6)
    wrapper.findComponent({ name: 'NSwitch' }).vm.$emit('update:value', false)
    optimizeLevelInput?.vm.$emit('update:value', 5)
    await wrapper.find('button.convert-btn').trigger('click')

    expect(wrapper.emitted('update:scale')?.[0]).toEqual([120])
    expect(wrapper.emitted('update:speed')?.[0]).toEqual([1.5])
    expect(wrapper.emitted('update:loopMode')?.[0]).toEqual(['infinite'])
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([6])
    expect(wrapper.emitted('update:optimize')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:optimizeLevel')?.[0]).toEqual([5])
    expect(wrapper.emitted('convert')?.length).toBe(1)
  })

  it('ignores null updates from numeric controls', () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        ...baseProps,
      },
    })

    const inputs = wrapper.findAllComponents({ name: 'NInputNumber' })
    const scaleInput = inputs[0]
    const speedInput = inputs[1]
    const loopCountInput = inputs[2]
    const optimizeLevelInput = inputs[3]

    scaleInput?.vm.$emit('update:value', null)
    speedInput?.vm.$emit('update:value', null)
    loopCountInput?.vm.$emit('update:value', null)
    optimizeLevelInput?.vm.$emit('update:value', null)

    expect(wrapper.emitted('update:scale')).toBeUndefined()
    expect(wrapper.emitted('update:speed')).toBeUndefined()
    expect(wrapper.emitted('update:loopCount')?.[0]).toEqual([null])
    expect(wrapper.emitted('update:optimizeLevel')).toBeUndefined()
  })

  it('shows the converting label when conversion is in progress', () => {
    const wrapper = mount(ConversionOptions, {
      props: {
        ...baseProps,
        isConverting: true,
      },
    })

    expect(wrapper.text()).toContain('Converting')
  })
})
