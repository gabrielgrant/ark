import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('Frame', () => {
  it('renders an iframe with a default title and srcdoc', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const frame = document.querySelector('[data-testid="frame"]')
    expect(frame?.tagName.toLowerCase()).toBe('iframe')
    expect(frame?.getAttribute('title')).toMatch(/^frame:/)
    expect(frame?.getAttribute('srcdoc')).toContain('frame-root')
  })

  it('respects a custom srcdoc', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest srcdoc="<html><body>custom</body></html>" />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="frame"]')?.getAttribute('srcdoc')).toBe(
      '<html><body>custom</body></html>',
    )
  })

  it('renders children inline in the main document (R7 caveat: not inside the iframe document)', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const children = document.querySelector('[data-testid="frame-children"]')
    expect(children).toBeTruthy()
    expect(children?.textContent).toBe('Hello from Frame')
  })

  it('renders head content inline in the main document', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest head={<div data-testid="frame-head" />} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="frame-head"]')).toBeTruthy()
  })

  it('forwards arbitrary iframe attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest width="400" height="300" />, {
      qwikLoader: true,
    })

    const frame = document.querySelector('[data-testid="frame"]')
    expect(frame?.getAttribute('width')).toBe('400')
    expect(frame?.getAttribute('height')).toBe('300')
  })

  it('serializes QRL onMount$/onUnmount$ props through SSR', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest onMount$={$(() => {})} onUnmount$={$(() => {})} />, {
      qwikLoader: true,
    })

    expect(document.querySelector('[data-testid="frame"]')).toBeTruthy()
  })
})
