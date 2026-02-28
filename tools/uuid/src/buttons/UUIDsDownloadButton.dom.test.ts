import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import UUIDsDownloadButton from './UUIDsDownloadButton.vue'

const objectUrlState = vi.hoisted(() => ({
  defaultValues: ['blob:txt', 'blob:csv', 'blob:tsv', 'blob:json'] as Array<string | undefined>,
  values: ['blob:txt', 'blob:csv', 'blob:tsv', 'blob:json'] as Array<string | undefined>,
  index: 0,
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useObjectUrl: (source: { value: Blob | null }) => {
      void source.value
      return ref(objectUrlState.values[objectUrlState.index++])
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NButton = defineComponent({
    name: 'NButton',
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
      text: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          props.tag as string,
          {
            class: 'n-button',
            href: props.href,
            download: props.download,
          },
          [slots.icon?.(), slots.default?.()],
        )
    },
  })

  const NPopover = defineComponent({
    name: 'NPopover',
    setup(_props, { slots }) {
      return () => h('div', { class: 'n-popover' }, [slots.trigger?.(), slots.default?.()])
    },
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon" />',
  })

  return {
    NButton,
    NPopover,
    NFlex,
    NIcon,
  }
})

vi.mock('@vicons/fluent/ArrowDownload16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ArrowDownloadIcon',
      template: '<svg class="download-icon" />',
    }),
  }
})

describe('UUIDsDownloadButton', () => {
  beforeEach(() => {
    objectUrlState.index = 0
    objectUrlState.values = [...objectUrlState.defaultValues]
  })

  it('renders download links with object URLs', () => {
    const wrapper = mount(UUIDsDownloadButton, {
      props: {
        uuids: ['uuid-1', 'uuid-2'],
      },
    })

    expect(wrapper.text()).toContain('Download')

    const links = wrapper.findAll('a.n-button')
    expect(links).toHaveLength(4)

    const downloads = links.map((link) => link.attributes('download'))
    const hrefs = links.map((link) => link.attributes('href'))

    expect(downloads).toEqual(['uuids.txt', 'uuids.csv', 'uuids.tsv', 'uuids.json'])
    expect(hrefs).toEqual(['blob:txt', 'blob:csv', 'blob:tsv', 'blob:json'])
  })

  it('keeps download anchors when object URLs are unavailable', () => {
    objectUrlState.values = [undefined, undefined, undefined, undefined]

    const wrapper = mount(UUIDsDownloadButton, {
      props: {
        uuids: [],
      },
    })

    const links = wrapper.findAll('a.n-button')
    expect(links).toHaveLength(4)

    const downloads = links.map((link) => link.attributes('download'))
    const hrefs = links.map((link) => link.attributes('href'))

    expect(downloads).toEqual(['uuids.txt', 'uuids.csv', 'uuids.tsv', 'uuids.json'])
    expect(hrefs).toEqual([undefined, undefined, undefined, undefined])
  })
})
