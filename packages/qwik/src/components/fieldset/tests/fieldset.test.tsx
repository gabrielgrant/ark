import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { Fieldset } from '../index.ts'

const ComponentUnderTest = (props: Fieldset.RootProps) => (
  <Fieldset.Root {...props}>
    <Fieldset.Legend>Legend</Fieldset.Legend>
    <Fieldset.HelperText>Helper</Fieldset.HelperText>
    <Fieldset.ErrorText>Error</Fieldset.ErrorText>
  </Fieldset.Root>
)

describe('Fieldset', () => {
  it('renders a fieldset labelled by its legend', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const root = document.querySelector('[data-part="root"]')
    const legend = document.querySelector('[data-part="legend"]')

    expect(root?.tagName.toLowerCase()).toBe('fieldset')
    expect(root?.getAttribute('aria-labelledby')).toBe(legend?.id)
    expect(document.querySelector('[data-part="error-text"]')).toBeFalsy()
  })

  it('reflects disabled and invalid states', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled invalid />, { qwikLoader: true })

    const root = document.querySelector('[data-part="root"]')
    expect(root?.hasAttribute('disabled')).toBe(true)
    expect(root?.hasAttribute('data-invalid')).toBe(true)
    expect(document.querySelector('[data-part="error-text"]')?.textContent).toBe('Error')
  })
})
