import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { NInputNumber, NSwitch } from 'naive-ui'
import type { XmlToJsonOptionsConfig } from '../types'
import XmlToJsonOptions from './XmlToJsonOptions.vue'

const defaultOptions = (): XmlToJsonOptionsConfig => ({
  compact: true,
  ignoreDeclaration: false,
  ignoreInstruction: false,
  ignoreAttributes: false,
  ignoreText: false,
  ignoreCdata: false,
  ignoreDoctype: false,
  ignoreComment: false,
  trim: false,
  nativeType: false,
  alwaysArray: false,
  alwaysChildren: false,
})

const TestHost = defineComponent({
  components: { XmlToJsonOptions },
  setup() {
    const options = ref<XmlToJsonOptionsConfig>(defaultOptions())
    const spaces = ref(2)
    return {
      options,
      spaces,
    }
  },
  template: '<XmlToJsonOptions v-model:options="options" v-model:spaces="spaces" />',
})

describe('XmlToJsonOptions', () => {
  it('updates each option and spaces through component models', async () => {
    const wrapper = mount(TestHost)
    const switches = wrapper.findAllComponents(NSwitch)

    expect(switches).toHaveLength(12)

    await switches[0]!.vm.$emit('update:value', false)
    await switches[1]!.vm.$emit('update:value', true)
    await switches[2]!.vm.$emit('update:value', true)
    await switches[3]!.vm.$emit('update:value', true)
    await switches[4]!.vm.$emit('update:value', true)
    await switches[5]!.vm.$emit('update:value', true)
    await switches[6]!.vm.$emit('update:value', true)
    await switches[7]!.vm.$emit('update:value', true)
    await switches[8]!.vm.$emit('update:value', true)
    await switches[9]!.vm.$emit('update:value', true)
    await switches[10]!.vm.$emit('update:value', true)
    await switches[11]!.vm.$emit('update:value', true)

    const inputNumber = wrapper.findComponent(NInputNumber)
    await inputNumber.vm.$emit('update:value', 6)

    const vm = wrapper.vm as unknown as {
      options: XmlToJsonOptionsConfig
      spaces: number
    }

    expect(vm.options.compact).toBe(false)
    expect(vm.options.ignoreDeclaration).toBe(true)
    expect(vm.options.ignoreInstruction).toBe(true)
    expect(vm.options.ignoreAttributes).toBe(true)
    expect(vm.options.ignoreText).toBe(true)
    expect(vm.options.ignoreCdata).toBe(true)
    expect(vm.options.ignoreDoctype).toBe(true)
    expect(vm.options.ignoreComment).toBe(true)
    expect(vm.options.trim).toBe(true)
    expect(vm.options.nativeType).toBe(true)
    expect(vm.options.alwaysArray).toBe(true)
    expect(vm.options.alwaysChildren).toBe(true)
    expect(vm.spaces).toBe(6)
  })
})
