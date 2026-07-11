import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'
import { useListboxItemPropsContext } from './use-listbox-item-props-context.ts'

export interface ListboxItemTextBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxItemTextProps extends HTMLProps<'div'>, ListboxItemTextBaseProps {}

export const ListboxItemText = component$<ListboxItemTextProps>((props) => {
  const api = useListboxContext()
  const itemProps = useListboxItemPropsContext()
  const textProps = api ? mergeProps(api.getItemTextProps(itemProps), props) : props

  return (
    <ark.div {...textProps}>
      <Slot />
    </ark.div>
  )
})
