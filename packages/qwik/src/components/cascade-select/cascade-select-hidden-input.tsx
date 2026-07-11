import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface CascadeSelectHiddenInputProps extends HTMLProps<'input'>, CascadeSelectHiddenInputBaseProps {}

export const CascadeSelectHiddenInput = component$<CascadeSelectHiddenInputProps>((props) => {
  const api = useCascadeSelectContext()
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps() as unknown as Record<string, unknown>, props as Record<string, unknown>)
    : props

  return <ark.input {...inputProps} />
})
