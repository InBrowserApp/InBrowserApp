import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { rot } from '../utils'

vi.mock('vue', async () => {
  const actual = await vi.importActual<typeof import('vue')>('vue')

  return {
    ...actual,
    watch: (source: unknown, callback: unknown, options?: Record<string, unknown>) =>
      actual.watch(source as never, callback as never, {
        ...options,
        flush: 'sync',
      }),
  }
})

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('../utils', async () => {
  const actual = await vi.importActual<typeof import('../utils')>('../utils')

  return {
    ...actual,
    rot: vi.fn(actual.rot),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NSelect = defineComponent({
    name: 'NSelect',
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
    emits: ['update:value'],
    template:
      '<select class="n-select" :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<textarea class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NSelect,
    NInput,
  }
})

const stubs = {
  ToolSectionHeader: {
    template: '<header><slot /></header>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
  CopyToClipboardButton: {
    template: '<button class="copy" />',
  },
}

describe('RotConverter sync watch guards', () => {
  it('uses guard branches to prevent recursive conversions', async () => {
    const rotMock = vi.mocked(rot)
    rotMock.mockClear()

    const { default: RotConverter } = await import('./RotConverter.vue')
    const wrapper = mount(RotConverter, {
      global: {
        stubs,
      },
    })

    const inputs = wrapper.findAll('textarea.n-input')
    expect(inputs).toHaveLength(2)
    expect(rotMock).toHaveBeenCalledTimes(1)

    await inputs[1]!.setValue('Uryyb')
    await nextTick()
    expect(rotMock).toHaveBeenCalledTimes(2)

    await inputs[0]!.setValue('Test123')
    await nextTick()
    expect(rotMock).toHaveBeenCalledTimes(3)
  })
})
