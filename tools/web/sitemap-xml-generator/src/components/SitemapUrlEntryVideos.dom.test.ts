import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SitemapUrlEntryVideos from './SitemapUrlEntryVideos.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: null,
      },
    },
    emits: ['update:value'],
    setup(props, { emit, attrs }) {
      return () =>
        h('input', {
          ...attrs,
          type: 'number',
          value: props.value ?? '',
          onInput: (event: Event) =>
            emit('update:value', Number((event.target as HTMLInputElement).value)),
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
    NInputNumber,
    NSpace,
    NText,
  }
})

describe('SitemapUrlEntryVideos', () => {
  it('renders and updates video fields', async () => {
    const videos = [
      {
        thumbnailLoc: '',
        title: '',
        description: '',
        contentLoc: '',
        playerLoc: '',
        duration: null,
        publicationDate: '',
      },
    ]

    const wrapper = mount(SitemapUrlEntryVideos, {
      props: {
        videos,
      },
    })

    expect(wrapper.text()).toContain('addVideo')

    await wrapper.find('input').setValue('https://example.com/thumb.jpg')
    expect(videos[0]?.thumbnailLoc).toBe('https://example.com/thumb.jpg')

    wrapper.findComponent({ name: 'NInputNumber' }).vm.$emit('update:value', 42)
    expect(videos[0]?.duration).toBe(42)

    await wrapper.find('.dynamic-input button').trigger('click')
    expect(wrapper.emitted('update:videos')).toBeTruthy()
  })
})
