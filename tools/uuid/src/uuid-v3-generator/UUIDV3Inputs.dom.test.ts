import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NameInput from './NameInput.vue'
import NamespaceInput from './NamespaceInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
      showFeedback: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div class="n-form-item"><slot /></div>',
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
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    template: '<div class="n-space"><slot /></div>',
  })

  const NTag = defineComponent({
    name: 'NTag',
    emits: ['click'],
    template: '<button class="n-tag" @click="$emit(\'click\')"><slot /></button>',
  })

  return {
    NFormItem,
    NInput,
    NSpace,
    NTag,
  }
})

vi.mock('@shared/ui/domain/uuid', async () => {
  const { defineComponent } = await import('vue')
  return {
    UUIDInput: defineComponent({
      name: 'UUIDInput',
      props: {
        uuid: {
          type: String,
          default: '',
        },
      },
      emits: ['update:uuid'],
      template:
        '<input class="uuid-input" :value="uuid" @input="$emit(\'update:uuid\', $event.target.value)" />',
    }),
  }
})

describe('UUID v3 inputs', () => {
  it('emits name updates', () => {
    const wrapper = mount(NameInput, {
      props: {
        name: 'Ada',
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'Grace')

    expect(wrapper.emitted('update:name')?.[0]).toEqual(['Grace'])
  })

  it('emits namespace updates from UUID input', async () => {
    const wrapper = mount(NamespaceInput, {
      props: {
        namespace: '00000000-0000-0000-0000-000000000000',
      },
    })

    wrapper
      .findComponent({ name: 'UUIDInput' })
      .vm.$emit('update:uuid', '11111111-1111-1111-1111-111111111111')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:namespace')?.[0]).toEqual([
      '11111111-1111-1111-1111-111111111111',
    ])
  })

  it('updates namespace from predefined tags', async () => {
    const wrapper = mount(NamespaceInput, {
      props: {
        namespace: '00000000-0000-0000-0000-000000000000',
      },
    })

    const tags = wrapper.findAllComponents({ name: 'NTag' })
    const firstTag = tags[0]
    if (!firstTag) {
      throw new Error('Expected namespace tags')
    }

    await firstTag.trigger('click')

    expect(wrapper.emitted('update:namespace')?.[0]).toEqual([
      '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    ])
  })
})
