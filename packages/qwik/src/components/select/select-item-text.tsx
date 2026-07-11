import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'
import { useSelectItemPropsContext } from './use-select-item-props-context.ts'

export interface SelectItemTextBaseProps extends PolymorphicProps<'span'> {}
export interface SelectItemTextProps extends HTMLProps<'span'>, SelectItemTextBaseProps {}

export const SelectItemText = component$<SelectItemTextProps>((props) => {
  const api = useSelectContext()
  const itemProps = useSelectItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.span {...textProps}>
      <Slot />
    </ark.span>
  )
})
