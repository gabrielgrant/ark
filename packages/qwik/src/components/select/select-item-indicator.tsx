import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'
import { useSelectItemPropsContext } from './use-select-item-props-context.ts'

export interface SelectItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemIndicatorProps extends HTMLProps<'div'>, SelectItemIndicatorBaseProps {}

export const SelectItemIndicator = component$<SelectItemIndicatorProps>((props) => {
  const api = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
