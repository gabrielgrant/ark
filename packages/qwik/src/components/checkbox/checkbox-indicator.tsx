import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCheckboxContext } from './use-checkbox-context.ts'

export interface CheckboxIndicatorBaseProps extends PolymorphicProps<'div'> {
  indeterminate?: boolean
}
export interface CheckboxIndicatorProps extends HTMLProps<'div'>, CheckboxIndicatorBaseProps {}

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const { indeterminate, ...rest } = props
  const api = useCheckboxContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), rest) : rest
  const hidden = api ? !(indeterminate ? api.indeterminate : api.checked) : true

  return (
    <ark.div {...indicatorProps} hidden={hidden}>
      <Slot />
    </ark.div>
  )
})
