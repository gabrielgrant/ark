import { ssrRenderToDom } from '@qwik.dev/core/testing'
import { describe, expect, it } from 'vitest'
import { Checkbox } from '../../checkbox/index.ts'
import { Field } from '../index.ts'

const ComponentUnderTest = (props: Field.RootProps) => (
  <Field.Root {...props}>
    <Field.Label>Label</Field.Label>
    <Field.Input data-testid="input" />
    <Field.HelperText>Some helper text</Field.HelperText>
    <Field.ErrorText>Error text</Field.ErrorText>
    <Field.RequiredIndicator data-testid="indicator" />
  </Field.Root>
)

describe('Field', () => {
  it('wires label, input and data attributes', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    const root = document.querySelector('[data-part="root"]')
    const label = document.querySelector('[data-part="label"]')
    const input = document.querySelector('[data-testid="input"]') as HTMLInputElement

    expect(root?.getAttribute('role')).toBe('group')
    expect(label?.getAttribute('for')).toBe(input?.id)
    expect(input?.hasAttribute('disabled')).toBe(false)
  })

  it('reflects disabled/invalid/required states', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest disabled invalid required />, {
      qwikLoader: true,
    })

    const input = document.querySelector('[data-testid="input"]') as HTMLInputElement
    expect(input?.hasAttribute('disabled')).toBe(true)
    expect(input?.getAttribute('aria-invalid')).toBe('true')
    expect(input?.hasAttribute('required')).toBe(true)
    expect(document.querySelector('[data-part="error-text"]')).toBeTruthy()
    expect(document.querySelector('[data-testid="indicator"]')?.textContent).toBe('*')
  })

  it('hides error text and indicator when valid and optional', async () => {
    const { document } = await ssrRenderToDom(<ComponentUnderTest />, { qwikLoader: true })

    expect(document.querySelector('[data-part="error-text"]')).toBeFalsy()
    expect(document.querySelector('[data-testid="indicator"]')).toBeFalsy()
  })

  it('propagates field state into an embedded checkbox', async () => {
    const { document } = await ssrRenderToDom(
      <Field.Root disabled invalid>
        <Checkbox.Root>
          <Checkbox.Label>Agree</Checkbox.Label>
          <Checkbox.Control data-testid="control" />
          <Checkbox.HiddenInput data-testid="hidden-input" />
        </Checkbox.Root>
      </Field.Root>,
      { qwikLoader: true },
    )

    const control = document.querySelector('[data-testid="control"]')
    const input = document.querySelector('[data-testid="hidden-input"]') as HTMLInputElement
    expect(control?.hasAttribute('data-disabled')).toBe(true)
    expect(input?.hasAttribute('disabled')).toBe(true)
    expect(input?.getAttribute('aria-invalid')).toBe('true')
  })
})
