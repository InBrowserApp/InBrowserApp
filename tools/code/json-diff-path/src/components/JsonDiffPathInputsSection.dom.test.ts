import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import JsonDiffPathInputsSection from './JsonDiffPathInputsSection.vue'

const Harness = defineComponent({
  components: { JsonDiffPathInputsSection },
  setup() {
    const original = ref('{"a":1}')
    const modified = ref('{"b":1}')
    const selected = ref(['add', 'remove', 'replace'])
    const showLargeCompareHint = ref(false)
    const onSwap = vi.fn()
    const onFormat = vi.fn()
    const onCompare = vi.fn()

    return {
      original,
      modified,
      selected,
      showLargeCompareHint,
      onSwap,
      onFormat,
      onCompare,
    }
  },
  template: `
    <JsonDiffPathInputsSection
      v-model:original-text="original"
      v-model:modified-text="modified"
      v-model:selected-operations="selected"
      :show-large-compare-hint="showLargeCompareHint"
      @swap="onSwap"
      @format="onFormat"
      @compare="onCompare"
    />
  `,
})

describe('JsonDiffPathInputsSection', () => {
  it('binds original and modified inputs through v-model', async () => {
    const wrapper = mount(Harness)
    const textareas = wrapper.findAll('textarea')
    expect(textareas).toHaveLength(2)

    const originalTextarea = textareas[0]!
    const modifiedTextarea = textareas[1]!

    expect((originalTextarea.element as HTMLTextAreaElement).value).toBe('{"a":1}')
    expect((modifiedTextarea.element as HTMLTextAreaElement).value).toBe('{"b":1}')

    await modifiedTextarea.setValue('{"b":2}')

    const vm = wrapper.vm as unknown as { modified: string }
    expect(vm.modified).toBe('{"b":2}')
  })

  it('emits swap and format actions from toolbar buttons', async () => {
    const wrapper = mount(Harness)
    const swapButton = wrapper.findAll('button').find((button) => button.text().includes('Swap'))
    const formatButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Format JSON'))

    expect(swapButton).toBeTruthy()
    expect(formatButton).toBeTruthy()

    await swapButton!.trigger('click')
    await formatButton!.trigger('click')

    const vm = wrapper.vm as unknown as {
      onSwap: ReturnType<typeof vi.fn>
      onFormat: ReturnType<typeof vi.fn>
    }
    expect(vm.onSwap).toHaveBeenCalledTimes(1)
    expect(vm.onFormat).toHaveBeenCalledTimes(1)
  })

  it('renders large-json compare controls and emits compare', async () => {
    const wrapper = mount(Harness)
    const vm = wrapper.vm as unknown as {
      showLargeCompareHint: boolean
      onCompare: ReturnType<typeof vi.fn>
    }

    vm.showLargeCompareHint = true
    await wrapper.vm.$nextTick()

    const compareButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Compare Now'))

    expect(compareButton).toBeTruthy()
    expect(wrapper.text()).toContain('Large JSON detected')

    await compareButton!.trigger('click')

    expect(vm.onCompare).toHaveBeenCalledTimes(1)
  })
})
