import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SelectedTemplates from './SelectedTemplates.vue'

const dynamicHandlers = {
  submit: vi.fn(),
  deactivate: vi.fn(),
  activate: vi.fn(),
}

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NDynamicTags = defineComponent({
    name: 'NDynamicTags',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    setup(_, { slots }) {
      return () =>
        h('div', { class: 'n-dynamic-tags' }, [
          slots.input?.({ submit: dynamicHandlers.submit, deactivate: dynamicHandlers.deactivate }),
          slots.trigger?.({ activate: dynamicHandlers.activate, disabled: false }),
          slots.default?.(),
        ])
    },
  })

  const NAutoComplete = defineComponent({
    name: 'NAutoComplete',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value', 'select', 'blur'],
    methods: {
      focus() {},
    },
    template:
      '<input class="n-auto-complete" :value="value" @input="$emit(\'update:value\', $event.target.value)" @blur="$emit(\'blur\')" />',
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<button class="n-button" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon"><slot /></span>',
  })

  return {
    NDynamicTags,
    NAutoComplete,
    NButton,
    NIcon,
  }
})

describe('SelectedTemplates', () => {
  beforeEach(() => {
    dynamicHandlers.submit.mockClear()
    dynamicHandlers.deactivate.mockClear()
    dynamicHandlers.activate.mockClear()
  })

  it('filters options by input and excludes selected', async () => {
    const wrapper = mount(SelectedTemplates, {
      props: {
        allTemplates: ['Node', 'Python', 'Go'],
        modelValue: ['Node'],
      },
    })

    const vm = wrapper.vm as unknown as {
      filteredOptions: Array<{ label: string; value: string }>
      inputValue: string
    }

    expect(vm.filteredOptions.some((option) => option.value === 'Node')).toBe(false)

    vm.inputValue = 'py'
    await nextTick()

    expect(vm.filteredOptions).toEqual([{ label: 'Python', value: 'Python' }])
  })

  it('focuses the autocomplete when the ref is set', async () => {
    const wrapper = mount(SelectedTemplates, {
      props: {
        allTemplates: ['Node'],
        modelValue: [],
      },
    })

    const focus = vi.fn()
    const vm = wrapper.vm as unknown as {
      autoCompleteInstRef: { focus: () => void } | null
    }

    vm.autoCompleteInstRef = { focus }
    await nextTick()
    await nextTick()

    expect(focus).toHaveBeenCalledTimes(1)
  })

  it('wires template interactions to model updates', async () => {
    const wrapper = mount(SelectedTemplates, {
      props: {
        allTemplates: ['Node', 'Python'],
        modelValue: [],
      },
    })

    const dynamicTags = wrapper.findComponent({ name: 'NDynamicTags' })
    dynamicTags.vm.$emit('update:value', ['Node'])
    await nextTick()

    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['Node']])

    const autoComplete = wrapper.findComponent({ name: 'NAutoComplete' })
    autoComplete.vm.$emit('update:value', 'py')
    autoComplete.vm.$emit('select', 'Python')
    autoComplete.vm.$emit('blur')

    const triggerButton = wrapper.findComponent({ name: 'NButton' })
    await triggerButton.trigger('click')

    expect(dynamicHandlers.submit).toHaveBeenCalled()
    expect(dynamicHandlers.deactivate).toHaveBeenCalled()
    expect(dynamicHandlers.activate).toHaveBeenCalled()
  })
})
