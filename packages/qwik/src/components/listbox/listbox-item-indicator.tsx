import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useListboxContext } from './use-listbox-context.ts'
import { useListboxItemPropsContext } from './use-listbox-item-props-context.ts'

export interface ListboxItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface ListboxItemIndicatorProps extends HTMLProps<'div'>, ListboxItemIndicatorBaseProps {}

export const ListboxItemIndicator = component$<ListboxItemIndicatorProps>((props) => {
  const api = useListboxContext()
  const itemProps = useListboxItemPropsContext()
  const indicatorProps = api ? mergeProps(api.getItemIndicatorProps(itemProps), props) : props

  return (
    <ark.div {...indicatorProps}>
      <Slot />
    </ark.div>
  )
})
