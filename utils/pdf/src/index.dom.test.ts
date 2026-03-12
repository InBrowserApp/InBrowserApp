import { describe, expect, it, vi } from 'vitest'

const { compressPdfMock, removePDFOwnerPasswordMock } = vi.hoisted(() => ({
  compressPdfMock: vi.fn(),
  removePDFOwnerPasswordMock: vi.fn(),
}))

vi.mock('./compress-pdf', () => ({
  compressPdf: compressPdfMock,
}))

vi.mock('./remove-pdf-owner-password', () => ({
  removePDFOwnerPassword: removePDFOwnerPasswordMock,
}))

import { compressPdf, removePDFOwnerPassword } from './index'

describe('pdf utils index', () => {
  it('re-exports pdf helpers', () => {
    expect(compressPdf).toBe(compressPdfMock)
    expect(removePDFOwnerPassword).toBe(removePDFOwnerPasswordMock)
  })
})
