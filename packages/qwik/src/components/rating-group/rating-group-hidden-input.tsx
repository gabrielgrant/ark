import { mergeProps } from '@zag-js/qwik'
import { component$ } from '@qwik.dev/core'
import { useFieldContext } from '../field/use-field-context.ts'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRatingGroupContext } from './use-rating-group-context.ts'

export interface RatingGroupHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface RatingGroupHiddenInputProps extends HTMLProps<'input'>, RatingGroupHiddenInputBaseProps {}

export const RatingGroupHiddenInput = component$<RatingGroupHiddenInputProps>((props) => {
  const api = useRatingGroupContext()
  const field = useFieldContext()
  const describedBy: Record<string, unknown> = field?.ariaDescribedby ? { 'aria-describedby': field.ariaDescribedby } : {}
  const inputProps = api
    ? mergeProps(api.getHiddenInputProps(), describedBy, props as Record<string, unknown>)
    : props

  return <ark.input {...inputProps} />
})
