import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface SelectIndicatorProps extends HTMLProps<'div'>, SelectIndicatorBaseProps {}

export const SelectIndicator = component$<SelectIndicatorProps>((props) => {
  const api = useSelectContext()
  const indicatorProps = api ? mergeProps(api.getIndicatorProps(), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
