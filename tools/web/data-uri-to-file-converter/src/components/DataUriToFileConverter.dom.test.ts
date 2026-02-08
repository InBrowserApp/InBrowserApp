import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import DataUriDetailsSection from './DataUriDetailsSection.vue'
import DataUriDownloadSection from './DataUriDownloadSection.vue'
import DataUriPreviewSection from './DataUriPreviewSection.vue'
import DataUriToFileConverter from './DataUriToFileConverter.vue'

const setDataUri = async (wrapper: VueWrapper, value: string) => {
  const textarea = wrapper.find('textarea')
  await textarea.setValue(value)
  await flushPromises()
}

const getFileNameInput = (wrapper: VueWrapper) => {
  const input = wrapper.find('input')
  if (!input.exists()) {
    throw new Error('Expected file name input to exist')
  }
  return input
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('DataUriToFileConverter', () => {
  it('auto-fills file name from mime type', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    const input = getFileNameInput(wrapper)
    expect(input.element.value).toBe('data.txt')
  })

  it('uses generated download names when the custom file name is blank', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    const input = getFileNameInput(wrapper)
    await input.setValue('   ')
    await flushPromises()

    const download = wrapper.getComponent(DataUriDownloadSection)
    expect(download.props('downloadName')).toBe('data.txt')
  })

  it('preserves base name and updates extension when mime changes', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    const input = getFileNameInput(wrapper)
    await input.setValue('my-file.txt')
    await flushPromises()

    await setDataUri(wrapper, 'data:application/json;base64,eyJvayI6dHJ1ZX0=')

    expect(input.element.value).toBe('my-file.json')
  })

  it('adds an extension when the current file name has no suffix', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    const input = getFileNameInput(wrapper)
    await input.setValue('download')
    await flushPromises()

    await setDataUri(wrapper, 'data:application/json;base64,eyJvayI6dHJ1ZX0=')

    expect(input.element.value).toBe('download.json')
  })

  it('keeps file name when extension matches', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    const input = getFileNameInput(wrapper)
    await input.setValue('notes.txt')
    await flushPromises()

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8h')

    expect(input.element.value).toBe('notes.txt')
  })

  it('shows an error message for malformed input and missing commas', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'not-a-data-uri')
    expect(wrapper.text()).toContain('Invalid Data URI')

    await setDataUri(wrapper, 'data:text/plain;base64SGVsbG8=')
    expect(wrapper.text()).toContain('Invalid Data URI')
  })

  it('keeps the existing name when parsing fails with non-empty input', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:application/json;base64,eyJvayI6dHJ1ZX0=')

    const input = getFileNameInput(wrapper)
    await input.setValue('archive.json')
    await flushPromises()

    await setDataUri(wrapper, 'data:text/plain;base64SGVsbG8=')
    expect(wrapper.text()).toContain('Invalid Data URI')

    await setDataUri(wrapper, 'data:text/plain;base64,SGVsbG8=')

    expect(getFileNameInput(wrapper).element.value).toBe('archive.txt')
  })

  it('creates preview URLs for media and revokes previous URLs and on unmount', async () => {
    const url = URL as Partial<typeof URL>
    if (!url.createObjectURL) {
      Object.defineProperty(URL, 'createObjectURL', {
        value: vi.fn(() => 'blob:fallback'),
        writable: true,
      })
    }
    if (!url.revokeObjectURL) {
      Object.defineProperty(URL, 'revokeObjectURL', {
        value: vi.fn(() => undefined),
        writable: true,
      })
    }

    let index = 0
    const createSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockImplementation(() => `blob:preview-${++index}`)
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:image/png;base64,QQ==')
    let preview = wrapper.findComponent(DataUriPreviewSection)
    expect(preview.props('previewKind')).toBe('image')
    const firstPreviewUrl = preview.props('previewUrl') as string

    await setDataUri(wrapper, 'data:audio/wav;base64,QQ==')
    preview = wrapper.findComponent(DataUriPreviewSection)
    expect(preview.props('previewKind')).toBe('audio')
    const secondPreviewUrl = preview.props('previewUrl') as string
    expect(secondPreviewUrl).not.toBe(firstPreviewUrl)
    expect(revokeSpy).toHaveBeenCalledWith(firstPreviewUrl)

    await setDataUri(wrapper, 'data:video/mp4;base64,QQ==')
    preview = wrapper.findComponent(DataUriPreviewSection)
    expect(preview.props('previewKind')).toBe('video')
    const thirdPreviewUrl = preview.props('previewUrl') as string
    expect(thirdPreviewUrl).not.toBe(secondPreviewUrl)
    expect(revokeSpy).toHaveBeenCalledWith(secondPreviewUrl)

    expect(createSpy).toHaveBeenCalled()

    wrapper.unmount()
    expect(revokeSpy).toHaveBeenCalledWith(thirdPreviewUrl)
  })

  it('does not revoke object URLs on unmount when no preview URL was created', () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)

    const wrapper = mount(DataUriToFileConverter)

    wrapper.unmount()

    expect(revokeSpy).not.toHaveBeenCalled()
  })

  it('parses bare base64 metadata as text/plain with default charset', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:base64,SGVsbG8=')

    const details = wrapper.findComponent(DataUriDetailsSection)
    expect(details.props('mimeType')).toBe('text/plain;charset=US-ASCII')
    expect(details.props('isBase64')).toBe(true)
  })

  it('truncates long decoded text previews', async () => {
    const wrapper = mount(DataUriToFileConverter)
    const longText = 'x'.repeat(2105)

    await setDataUri(wrapper, `data:text/plain,${encodeURIComponent(longText)}`)

    const preview = wrapper.findComponent(DataUriPreviewSection)
    expect(preview.props('previewKind')).toBe('text')

    const textPreview = preview.props('textPreview') as string
    expect(textPreview).toHaveLength(2003)
    expect(textPreview.endsWith('...')).toBe(true)
  })

  it('handles unknown mime extensions and clears stale names after reset', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:text/plain;base64,QQ==')
    let input = getFileNameInput(wrapper)
    await input.setValue('custom.')
    await flushPromises()

    await setDataUri(wrapper, 'data:application/json;base64,eyJvayI6dHJ1ZX0=')
    input = getFileNameInput(wrapper)
    expect(input.element.value).toBe('custom.json')

    await input.setValue('mystery.weird')
    await flushPromises()

    await setDataUri(wrapper, 'data:application/x-unknown;base64,QQ==')
    input = getFileNameInput(wrapper)
    expect(input.element.value).toBe('mystery.weird')

    await setDataUri(wrapper, '')
    await setDataUri(wrapper, 'data:application/x-unknown;base64,QQ==')

    input = getFileNameInput(wrapper)
    expect(input.element.value).toBe('data.bin')
  })

  it('keeps a provided charset when mime type is omitted', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data:;charset=UTF-8,Hello%20World')

    const details = wrapper.findComponent(DataUriDetailsSection)
    expect(details.props('mimeType')).toBe('text/plain;charset=UTF-8')
  })

  it('treats blank mime metadata as non-previewable binary data', async () => {
    const wrapper = mount(DataUriToFileConverter)

    await setDataUri(wrapper, 'data: ;base64,QQ==')

    const preview = wrapper.findComponent(DataUriPreviewSection)
    expect(preview.props('previewKind')).toBeNull()
    expect(getFileNameInput(wrapper).element.value).toBe('data.bin')
  })
})
