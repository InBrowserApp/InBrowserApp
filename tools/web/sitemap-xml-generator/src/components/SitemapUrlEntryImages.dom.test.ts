import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapUrlEntryImages from './SitemapUrlEntryImages.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NDynamicInput = defineComponent({
    name: 'NDynamicInput',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      onCreate: {
        type: Function,
        default: undefined,
      },
    },
    emits: ['update:value'],
    setup(props, { slots, emit }) {
      return () =>
        h('div', { class: 'dynamic-input' }, [
          h(
            'button',
            {
              type: 'button',
              onClick: () => {
                if (!props.onCreate) return
                const next = props.onCreate()
                emit('update:value', [...props.value, next])
              },
            },
            slots['create-button-default']?.(),
          ),
          slots.default?.({ index: 0 }),
        ])
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('input', {
          ...attrs,
          value: props.value,
          placeholder: props.placeholder,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    setup(_, { slots }) {
      return () => h('div', { class: 'n-space' }, slots.default?.())
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', { class: 'n-text' }, slots.default?.())
    },
  })

  return {
    NDynamicInput,
    NInput,
    NSpace,
    NText,
  }
})

describe('SitemapUrlEntryImages', () => {
  it('renders and updates image fields', async () => {
    const images = [
      {
        loc: '',
        title: '',
        caption: '',
        license: '',
      },
    ]

    const wrapper = mount(SitemapUrlEntryImages, {
      props: {
        images,
      },
    })

    expect(wrapper.text()).toContain('Add image')

    await wrapper
      .get('input[placeholder="https://example.com/image.jpg"]')
      .setValue('https://example.com/image.jpg')
    await wrapper.get('input[placeholder="Title"]').setValue('Hero image')
    await wrapper.get('input[placeholder="Caption"]').setValue('Homepage hero')
    await wrapper
      .get('input[placeholder="https://example.com/license"]')
      .setValue('https://example.com/license')

    expect(images[0]?.loc).toBe('https://example.com/image.jpg')
    expect(images[0]?.title).toBe('Hero image')
    expect(images[0]?.caption).toBe('Homepage hero')
    expect(images[0]?.license).toBe('https://example.com/license')

    await wrapper.find('.dynamic-input button').trigger('click')
    expect(wrapper.emitted('update:images')).toBeTruthy()
  })
})
