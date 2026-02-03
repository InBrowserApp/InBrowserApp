import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, type Ref } from 'vue'
import UUIDV4BulkGeneratorView from './UUIDV4BulkGeneratorView.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (key: string, initialValue: unknown) => {
      if (!storage.has(key)) {
        storage.set(key, ref(initialValue))
      }
      return storage.get(key) as Ref<unknown>
    },
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NVirtualList = defineComponent({
    name: 'NVirtualList',
    props: {
      items: {
        type: Array,
        default: () => [],
      },
    },
    setup(props, { slots }) {
      return () =>
        h(
          'div',
          { class: 'n-virtual-list' },
          props.items.map((item) => slots.default?.({ item })),
        )
    },
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  const NDivider = defineComponent({
    name: 'NDivider',
    template: '<span class="n-divider" />',
  })

  return {
    NVirtualList,
    NText,
    NDivider,
  }
})

const RegenerateButtonStub = {
  name: 'RegenerateButton',
  template: '<button class="regenerate" @click="$emit(\'click\')" />',
}

const CopyToClipboardButtonStub = {
  name: 'CopyToClipboardButton',
  props: ['content'],
  template: '<button class="copy" :data-content="content" />',
}

const UUIDsDownloadButtonStub = {
  name: 'UUIDsDownloadButton',
  props: ['uuids'],
  template: '<div class="download" />',
}

const SizeInputStub = {
  name: 'SizeInput',
  props: ['size'],
  template: '<input class="size-input" />',
}

describe('UUIDV4BulkGeneratorView', () => {
  beforeEach(() => {
    storage.clear()
    let counter = 0
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => `uuid-${++counter}`),
    })
  })

  it('renders and regenerates bulk UUIDs', async () => {
    storage.set('tools:uuid-v4-bulk-generator:size', ref(2))

    const wrapper = mount(UUIDV4BulkGeneratorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            inheritAttrs: false,
            props: ['info'],
            template: '<div><slot /></div>',
          },
          ToolSectionHeader: {
            template: '<h2><slot /></h2>',
          },
          ToolSection: {
            template: '<section><slot /></section>',
          },
          ToolConfigHeader: {
            template: '<div class="config-header" />',
          },
          RegenerateButton: RegenerateButtonStub,
          CopyToClipboardButton: CopyToClipboardButtonStub,
          UUIDsDownloadButton: UUIDsDownloadButtonStub,
          SizeInput: SizeInputStub,
          WhatIsUUIDv4: { template: '<div />' },
        },
      },
    })

    const download = wrapper.findComponent(UUIDsDownloadButtonStub)
    const copy = wrapper.findComponent(CopyToClipboardButtonStub)
    const initialUuids = [...(download.props('uuids') as string[])]
    expect(initialUuids).toHaveLength(2)
    expect(copy.props('content')).toBe(initialUuids.join('\n'))

    const list = wrapper.findComponent({ name: 'NVirtualList' })
    expect(list.props('items')).toHaveLength(2)

    await wrapper.findComponent(RegenerateButtonStub).trigger('click')
    await nextTick()

    const regeneratedUuids = download.props('uuids') as string[]
    expect(regeneratedUuids).toHaveLength(2)
    expect(regeneratedUuids).not.toEqual(initialUuids)
    expect(copy.props('content')).toBe(regeneratedUuids.join('\n'))

    const sizeRef = storage.get('tools:uuid-v4-bulk-generator:size') as Ref<number>
    sizeRef.value = 3
    await nextTick()

    expect(download.props('uuids')).toHaveLength(3)
  })
})
