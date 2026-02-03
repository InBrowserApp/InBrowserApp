import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import DownloadFileButton from './DownloadFileButton.vue'
import FileMinifiedUsingOxipng from './FileMinifiedUsingOxipng.vue'
import FileMinifiedUsingOxipngAndSvgo from './FileMinifiedUsingOxipngAndSvgo.vue'
import NotUsingDedicatedImageNote from './NotUsingDedicatedImageNote.vue'
import RemoveButton from './RemoveButton.vue'
import UsingDedicatedImageNote from './UsingDedicatedImageNote.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      href: {
        type: String,
        default: undefined,
      },
      download: {
        type: String,
        default: undefined,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    setup(props, { slots, emit, attrs }) {
      return () =>
        h(
          props.tag === 'a' ? 'a' : 'button',
          {
            class: 'n-button',
            href: props.href || undefined,
            download: props.download || undefined,
            disabled: props.disabled || undefined,
            onClick: () => emit('click'),
            ...attrs,
          },
          [slots.icon?.(), slots.default?.()],
        )
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: {
      component: {
        type: Object,
        default: null,
      },
    },
    template: '<span class="n-icon" />',
  })

  const NP = defineComponent({
    name: 'NP',
    template: '<p class="n-p"><slot /></p>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  return {
    NButton,
    NIcon,
    NP,
    NText,
  }
})

describe('common notes', () => {
  it('renders dedicated image notes', () => {
    const notUsing = mount(NotUsingDedicatedImageNote)
    const using = mount(UsingDedicatedImageNote)

    expect(notUsing.text()).toContain('notUsingDedicatedImage')
    expect(using.text()).toContain('usingDedicatedImage')
  })

  it('renders minification notes with icons', () => {
    const oxipng = mount(FileMinifiedUsingOxipng)
    const oxipngSvgo = mount(FileMinifiedUsingOxipngAndSvgo)

    expect(oxipng.text()).toContain('minificationNote')
    expect(oxipngSvgo.text()).toContain('minificationNote')
    expect(oxipng.find('.n-icon').exists()).toBe(true)
    expect(oxipngSvgo.find('.n-icon').exists()).toBe(true)
  })
})

describe('DownloadFileButton', () => {
  it('renders an enabled download link when href is present', () => {
    const wrapper = mount(DownloadFileButton, {
      props: {
        filename: 'favicon.ico',
        href: 'blob:preview',
      },
    })

    const link = wrapper.find('a.n-button')
    expect(link.attributes('href')).toBe('blob:preview')
    expect(link.attributes('download')).toBe('favicon.ico')
    expect(link.attributes('disabled')).toBeUndefined()
  })

  it('disables the link when href is missing', () => {
    const wrapper = mount(DownloadFileButton, {
      props: {
        filename: 'favicon.ico',
        href: null,
      },
    })

    const link = wrapper.find('a.n-button')
    expect(link.attributes('disabled')).toBeDefined()
  })
})

describe('RemoveButton', () => {
  it('emits click when pressed', async () => {
    const wrapper = mount(RemoveButton)

    await wrapper.find('button.n-button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
