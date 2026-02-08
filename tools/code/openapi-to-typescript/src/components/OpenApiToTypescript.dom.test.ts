import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

const { fileOpenMock, generateOpenApiTypesMock, parseOpenApiDocumentMock, tMock } = vi.hoisted(
  () => ({
    fileOpenMock: vi.fn(),
    generateOpenApiTypesMock: vi.fn(),
    parseOpenApiDocumentMock: vi.fn(),
    tMock: vi.fn((key: string, params?: { message?: string; count?: number }) => {
      if (params?.message) return `${key}:${params.message}`
      if (typeof params?.count === 'number') return `${key}:${params.count}`
      return key
    }),
  }),
)

vi.mock('@utils/openapi-typescript', () => ({
  generateOpenApiTypes: generateOpenApiTypesMock,
  parseOpenApiDocument: parseOpenApiDocumentMock,
}))

vi.mock('browser-fs-access', () => ({
  fileOpen: fileOpenMock,
}))

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: tMock }),
}))

vi.mock('@vueuse/core', async () => {
  const { computed, ref, watchEffect } = await import('vue')
  return {
    computedAsync: (
      getter: () => unknown | Promise<unknown>,
      initialValue: unknown,
      options?: { evaluating?: { value: boolean } },
    ) => {
      const state = ref(initialValue)
      const evaluating = options?.evaluating
      watchEffect(async () => {
        if (evaluating) evaluating.value = true
        state.value = await getter()
        if (evaluating) evaluating.value = false
      })
      return state
    },
    useDebounce: <T>(value: T) => value,
    useObjectUrl: (blob: { value: Blob | null }) =>
      computed(() => (blob.value ? 'blob:mock' : undefined)),
    useStorage: (_key: string, initialValue: unknown) => ref(initialValue),
  }
})

vi.mock('./OpenApiToolbar.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'OpenApiToolbar',
      props: {
        outputText: {
          type: String,
          default: '',
        },
        downloadUrl: {
          type: String,
          default: undefined,
        },
      },
      emits: ['import', 'import-url', 'load-sample'],
      setup(props, { emit }) {
        return () =>
          h(
            'div',
            {
              'data-testid': 'toolbar',
              'data-output-text': props.outputText,
              'data-download-url': props.downloadUrl ?? '',
            },
            [
              h(
                'button',
                { 'data-testid': 'import-button', onClick: () => emit('import') },
                'import',
              ),
              h(
                'button',
                { 'data-testid': 'import-url-button', onClick: () => emit('import-url') },
                'import-url',
              ),
              h(
                'button',
                { 'data-testid': 'load-sample-button', onClick: () => emit('load-sample') },
                'load-sample',
              ),
            ],
          )
      },
    }),
  }
})

vi.mock('./OpenApiInputOutput.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'OpenApiInputOutput',
      props: {
        openApiText: {
          type: String,
          default: '',
        },
        accept: {
          type: String,
          default: '',
        },
        inputError: {
          type: String,
          default: '',
        },
        inputStatus: {
          type: String,
          default: undefined,
        },
        outputError: {
          type: String,
          default: '',
        },
        outputText: {
          type: String,
          default: '',
        },
        externalRefs: {
          type: Array,
          default: () => [],
        },
        isGenerating: {
          type: Boolean,
          default: false,
        },
        handleInput: {
          type: Function,
          required: true,
        },
      },
      setup(props) {
        return () =>
          h('div', {
            'data-testid': 'input-output',
            'data-openapi-text': props.openApiText,
            'data-input-error': props.inputError,
            'data-input-status': props.inputStatus ?? '',
            'data-output-error': props.outputError,
            'data-output-text': props.outputText,
            'data-external-refs': props.externalRefs.join(','),
            'data-is-generating': String(props.isGenerating),
          })
      },
    }),
  }
})

vi.mock('./OpenApiOptions.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'OpenApiOptions',
      props: {
        additionalProperties: {
          type: Boolean,
          default: false,
        },
        defaultNonNullable: {
          type: Boolean,
          default: false,
        },
        propertiesRequiredByDefault: {
          type: Boolean,
          default: false,
        },
        exportType: {
          type: Boolean,
          default: false,
        },
        enumOutput: {
          type: Boolean,
          default: false,
        },
        pathParamsAsTypes: {
          type: Boolean,
          default: false,
        },
        rootTypes: {
          type: Boolean,
          default: false,
        },
        makePathsEnum: {
          type: Boolean,
          default: false,
        },
        generatePathParams: {
          type: Boolean,
          default: false,
        },
        immutable: {
          type: Boolean,
          default: false,
        },
        excludeDeprecated: {
          type: Boolean,
          default: false,
        },
        includeHeader: {
          type: Boolean,
          default: true,
        },
      },
      emits: [
        'update:additionalProperties',
        'update:defaultNonNullable',
        'update:propertiesRequiredByDefault',
        'update:exportType',
        'update:enumOutput',
        'update:pathParamsAsTypes',
        'update:rootTypes',
        'update:makePathsEnum',
        'update:generatePathParams',
        'update:immutable',
        'update:excludeDeprecated',
        'update:includeHeader',
      ],
      setup(props, { emit }) {
        return () =>
          h('div', { 'data-testid': 'options', 'data-header': String(props.includeHeader) }, [
            h(
              'button',
              {
                'data-testid': 'toggle-additional',
                onClick: () => emit('update:additionalProperties', !props.additionalProperties),
              },
              'toggle-additional',
            ),
            h(
              'button',
              {
                'data-testid': 'toggle-include-header',
                onClick: () => emit('update:includeHeader', !props.includeHeader),
              },
              'toggle-include-header',
            ),
          ])
      },
    }),
  }
})

vi.mock('./OpenApiImportUrlModal.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'OpenApiImportUrlModal',
      props: {
        show: {
          type: Boolean,
          default: false,
        },
        importUrl: {
          type: String,
          default: '',
        },
        importUrlError: {
          type: String,
          default: '',
        },
        importUrlStatus: {
          type: String,
          default: undefined,
        },
        isImporting: {
          type: Boolean,
          default: false,
        },
        onUpdateInput: {
          type: Function,
          required: true,
        },
        onEnter: {
          type: Function,
          required: true,
        },
        onClose: {
          type: Function,
          required: true,
        },
        onConfirm: {
          type: Function,
          required: true,
        },
      },
      emits: ['update:show'],
      setup(props) {
        return () =>
          h('div', {
            'data-testid': 'import-url-modal',
            'data-show': String(props.show),
            'data-import-url': props.importUrl,
            'data-error': props.importUrlError,
            'data-status': props.importUrlStatus ?? '',
            'data-importing': String(props.isImporting),
          })
      },
    }),
  }
})

import OpenApiToTypescript from './OpenApiToTypescript.vue'
import { sampleOpenApi } from '../sampleOpenApi'

const getInputOutput = (wrapper: ReturnType<typeof mount>) =>
  wrapper.getComponent({ name: 'OpenApiInputOutput' })

const getModal = (wrapper: ReturnType<typeof mount>) =>
  wrapper.getComponent({ name: 'OpenApiImportUrlModal' })

describe('OpenApiToTypescript', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  beforeEach(() => {
    parseOpenApiDocumentMock.mockReset()
    generateOpenApiTypesMock.mockReset()
    fileOpenMock.mockReset()
    tMock.mockClear()

    parseOpenApiDocumentMock.mockImplementation((text: string) => {
      const value = text.trim()
      if (!value) return { ok: false, code: 'empty' }
      if (value.includes('invalid')) {
        return { ok: false, code: 'invalid', message: 'bad' }
      }
      if (value.includes('not-object')) return { ok: false, code: 'not-object' }
      if (value.includes('unsupported')) return { ok: false, code: 'unsupported-version' }
      if (value.includes('external-ref')) {
        return {
          ok: true,
          document: { openapi: '3.0.0' },
          externalRefs: ['https://example.com/schema'],
        }
      }
      return { ok: true, document: { openapi: '3.0.0' }, externalRefs: [] }
    })
    generateOpenApiTypesMock.mockReturnValue('export interface paths {}')
  })

  it('generates output and exposes a download url', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    const inputOutput = getInputOutput(wrapper)
    expect(inputOutput.props('outputText')).toContain('export interface paths')
    expect(inputOutput.props('outputError')).toBe('')
    expect(inputOutput.props('inputStatus')).toBe('success')

    const toolbar = wrapper.getComponent({ name: 'OpenApiToolbar' })
    expect(toolbar.props('downloadUrl')).toBe('blob:mock')
    expect(toolbar.props('outputText')).toContain('export interface paths')
  })

  it('reports parse errors and clears status when empty', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await getInputOutput(wrapper).props('handleInput')('invalid schema')
    await flushPromises()

    let inputOutput = getInputOutput(wrapper)
    expect(inputOutput.props('inputError')).toBe('invalidDocumentWithMessage:bad')
    expect(inputOutput.props('inputStatus')).toBe('error')
    expect(inputOutput.props('outputError')).toBe('invalidDocumentWithMessage:bad')

    await inputOutput.props('handleInput')('')
    await flushPromises()

    inputOutput = getInputOutput(wrapper)
    expect(inputOutput.props('inputError')).toBe('')
    expect(inputOutput.props('inputStatus')).toBeUndefined()
  })

  it('handles not-object and unsupported versions', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await getInputOutput(wrapper).props('handleInput')('not-object')
    await flushPromises()
    expect(getInputOutput(wrapper).props('inputError')).toBe('invalidRoot')

    await getInputOutput(wrapper).props('handleInput')('unsupported')
    await flushPromises()
    expect(getInputOutput(wrapper).props('inputError')).toBe('unsupportedVersion')
  })

  it('falls back to invalid document for unknown parse results', async () => {
    parseOpenApiDocumentMock.mockImplementation(() => ({ ok: false, code: 'mystery' }))

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    expect(getInputOutput(wrapper).props('inputError')).toBe('invalidDocument')
  })

  it('shows external ref errors', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await getInputOutput(wrapper).props('handleInput')('external-ref')
    await flushPromises()

    const inputOutput = getInputOutput(wrapper)
    expect(inputOutput.props('outputError')).toBe('externalRefError:1')
    expect(inputOutput.props('externalRefs')).toEqual(['https://example.com/schema'])
  })

  it('falls back to generic invalid document when detail is missing', async () => {
    parseOpenApiDocumentMock.mockImplementation(() => ({ ok: false, code: 'invalid' }))

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    expect(getInputOutput(wrapper).props('inputError')).toBe('invalidDocument')
  })

  it('surfaces non-Error generator failures', async () => {
    generateOpenApiTypesMock.mockImplementation(() => {
      throw 'string-failure'
    })

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await getInputOutput(wrapper).props('handleInput')('valid schema')
    await flushPromises()

    expect(getInputOutput(wrapper).props('outputError')).toBe('string-failure')
  })

  it('surfaces generator failures', async () => {
    generateOpenApiTypesMock.mockImplementation(() => {
      throw new Error('boom')
    })

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await getInputOutput(wrapper).props('handleInput')('valid schema')
    await flushPromises()

    expect(getInputOutput(wrapper).props('outputError')).toBe('boom')
  })

  it('imports from file and loads the sample', async () => {
    fileOpenMock.mockResolvedValue({
      text: vi.fn().mockResolvedValue('from file'),
    })

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await wrapper.get('[data-testid="import-button"]').trigger('click')
    await flushPromises()

    expect(fileOpenMock).toHaveBeenCalled()
    expect(getInputOutput(wrapper).props('openApiText')).toBe('from file')

    await wrapper.get('[data-testid="load-sample-button"]').trigger('click')
    await flushPromises()
    expect(getInputOutput(wrapper).props('openApiText')).toBe(sampleOpenApi)
  })

  it('reads file input values and handles read errors', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    const file = {
      text: vi.fn().mockResolvedValue('file contents'),
    } as unknown as File

    await getInputOutput(wrapper).props('handleInput')(file)
    await flushPromises()
    expect(getInputOutput(wrapper).props('openApiText')).toBe('file contents')

    const errorFile = {
      text: vi.fn().mockRejectedValue(new Error('fail')),
    } as unknown as File

    await getInputOutput(wrapper).props('handleInput')(errorFile)
    await flushPromises()
    expect(getInputOutput(wrapper).props('openApiText')).toBe('')
  })

  it('syncs option and modal v-model updates', async () => {
    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    const options = wrapper.getComponent({ name: 'OpenApiOptions' })
    const updates: Array<[string, boolean]> = [
      ['update:additionalProperties', true],
      ['update:defaultNonNullable', false],
      ['update:propertiesRequiredByDefault', true],
      ['update:exportType', true],
      ['update:enumOutput', true],
      ['update:pathParamsAsTypes', true],
      ['update:rootTypes', true],
      ['update:makePathsEnum', true],
      ['update:generatePathParams', true],
      ['update:immutable', true],
      ['update:excludeDeprecated', true],
      ['update:includeHeader', false],
    ]

    for (const [eventName, value] of updates) {
      options.vm.$emit(eventName, value)
    }

    getModal(wrapper).vm.$emit('update:show', true)
    await flushPromises()

    expect(options.props('additionalProperties')).toBe(true)
    expect(options.props('defaultNonNullable')).toBe(false)
    expect(options.props('includeHeader')).toBe(false)
    expect(getModal(wrapper).props('show')).toBe(true)
  })

  it('handles composing enter and request-failure fallbacks when importing URLs', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await wrapper.get('[data-testid="import-url-button"]').trigger('click')
    await flushPromises()

    let modal = getModal(wrapper)
    await modal.props('onUpdateInput')('https://example.com/openapi.yaml')
    await flushPromises()

    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('')

    await modal.props('onEnter')({ isComposing: true } as KeyboardEvent)
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 0,
      statusText: '',
      text: vi.fn(),
    })
    await modal.props('onConfirm')()
    await flushPromises()

    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlFetchError:Request failed')

    fetchMock.mockRejectedValueOnce('socket closed')
    await modal.props('onConfirm')()
    await flushPromises()

    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlFetchError:socket closed')
  })

  it('validates and imports from URL', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const wrapper = mount(OpenApiToTypescript)
    await flushPromises()

    await wrapper.get('[data-testid="import-url-button"]').trigger('click')
    await flushPromises()

    let modal = getModal(wrapper)
    expect(modal.props('show')).toBe(true)

    await modal.props('onEnter')({ isComposing: false } as KeyboardEvent)
    await flushPromises()
    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlEmptyError')

    await modal.props('onUpdateInput')('invalid-url')
    await flushPromises()
    await modal.props('onConfirm')()
    await flushPromises()
    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlInvalidError')

    await modal.props('onUpdateInput')('ftp://example.com/openapi.yaml')
    await flushPromises()
    await modal.props('onConfirm')()
    await flushPromises()
    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlInvalidError')

    await modal.props('onUpdateInput')('https://example.com/openapi.yaml')
    await flushPromises()

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: vi.fn(),
    })
    await modal.props('onConfirm')()
    await flushPromises()
    modal = getModal(wrapper)
    expect(modal.props('importUrlError')).toBe('importUrlFetchError:404 Not Found')

    fetchMock.mockResolvedValueOnce({
      ok: true,
      text: vi.fn().mockResolvedValue('from url'),
    })
    await modal.props('onConfirm')()
    await flushPromises()

    modal = getModal(wrapper)
    expect(modal.props('show')).toBe(false)
    expect(getInputOutput(wrapper).props('openApiText')).toBe('from url')
  })
})
