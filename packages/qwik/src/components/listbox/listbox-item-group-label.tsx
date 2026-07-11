import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'
import { useListboxItemGroupPropsContext } from './use-listbox-item-group-props-context.ts'

export interface ListboxItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxItemGroupLabelProps extends HTMLProps<'div'>, ListboxItemGroupLabelBaseProps {}

export const ListboxItemGroupLabel = component$<ListboxItemGroupLabelProps>((props) => {
  const api = useListboxContext()
  const itemGroupProps = useListboxItemGroupPropsContext()
  const labelProps = api ? mergeProps(api.getItemGroupLabelProps({ htmlFor: itemGroupProps.id }), props) : props

  return (
    <ark.div {...labelProps}>
      <Slot />
    </ark.div>
  )
})
