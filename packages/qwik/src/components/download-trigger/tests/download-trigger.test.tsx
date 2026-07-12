import { $ } from '@qwik.dev/core'
import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { ComponentUnderTest } from './basic.tsx'

describe('DownloadTrigger', () => {
  it('renders a native button', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    expect(trigger?.tagName.toLowerCase()).toBe('button')
    expect(trigger?.getAttribute('type')).toBe('button')
    expect(trigger?.textContent).toBe('Download')
  })

  it('does not leak fileName/mimeType/data as DOM attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const trigger = document.querySelector('[data-testid="trigger"]')
    expect(trigger?.hasAttribute('filename')).toBe(false)
    expect(trigger?.hasAttribute('mimetype')).toBe(false)
    expect(trigger?.hasAttribute('data')).toBe(false)
  })

  it('serializes QRL data$/onClick$ props through SSR', async () => {
    const { document } = await ssrRenderToDom(
      <ComponentUnderTest data={undefined} data$={$(() => 'hello world')} onClick$={$(() => {})} />,
      { qwikLoader: true },
    )

    expect(document.querySelector('[data-testid="trigger"]')).toBeTruthy()
  })
})
