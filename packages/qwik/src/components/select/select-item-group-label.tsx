import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'
import { useSelectItemGroupPropsContext } from './use-select-item-group-props-context.ts'

export interface SelectItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface SelectItemGroupLabelProps extends HTMLProps<'div'>, SelectItemGroupLabelBaseProps {}

export const SelectItemGroupLabel = component$<SelectItemGroupLabelProps>((props) => {
  const api = useSelectContext()
  const itemGroupProps = useSelectItemGroupPropsContext()
  const labelProps = api ? mergeProps(api.getItemGroupLabelProps({ htmlFor: itemGroupProps.id }), props) : props

  return (
    <ark.div {...labelProps}>
      <Slot />
    </ark.div>
  )
})
