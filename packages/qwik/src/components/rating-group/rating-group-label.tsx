import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useRatingGroupContext } from './use-rating-group-context.ts'

export interface RatingGroupLabelBaseProps extends PolymorphicProps<'label'> {}
export interface RatingGroupLabelProps extends HTMLProps<'label'>, RatingGroupLabelBaseProps {}

export const RatingGroupLabel = component$<RatingGroupLabelProps>((props) => {
  const api = useRatingGroupContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
