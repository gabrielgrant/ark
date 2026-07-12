import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

const testFile = () => new File(['hello world'], 'test.jpg', { type: 'image/jpg' })

describe('FileUpload', () => {
  it('renders the label, dropzone, and trigger', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-testid="label"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="dropzone"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })

  it('renders the hidden input as a file input, excluded from the accessibility tree', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const input = document.querySelector('[data-testid="hidden-input"]')
    expect(input?.getAttribute('type')).toBe('file')
    expect(input?.getAttribute('aria-hidden')).toBe('true')
  })

  it('renders an item for each default accepted file', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultAcceptedFiles={[testFile()]} />, {
      qwikLoader: true,
    })

    const item = document.querySelector('[data-testid="item-test.jpg"]')
    expect(item).toBeTruthy()
    expect(document.querySelector('[data-testid="item-name-test.jpg"]')?.textContent).toBe('test.jpg')
  })

  it('renders the item size text', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultAcceptedFiles={[testFile()]} />, {
      qwikLoader: true,
    })

    const sizeText = document.querySelector('[data-testid="item-size-test.jpg"]')?.textContent
    expect(sizeText).toBeTruthy()
  })

  it('renders the item preview image part only for matching mime types', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest defaultAcceptedFiles={[testFile()]} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="item-preview-test.jpg"]')).toBeTruthy()
  })

  it('reflects disabled state on the root and dropzone', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled />, { qwikLoader: true })

    expect(document.querySelector('[data-part="root"]')?.hasAttribute('data-disabled')).toBe(true)
    expect(document.querySelector('[data-testid="dropzone"]')?.hasAttribute('data-disabled')).toBe(true)
    expect(document.querySelector('[data-testid="hidden-input"]')?.hasAttribute('disabled')).toBe(true)
  })

  it('serializes QRL callback props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onFileChange$={$(() => {})} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })
})
