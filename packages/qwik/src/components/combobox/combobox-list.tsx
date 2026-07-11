import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'

export interface ComboboxListBaseProps extends PolymorphicProps<'div'> {}
export interface ComboboxListProps extends HTMLProps<'div'>, ComboboxListBaseProps {}

export const ComboboxList = component$<ComboboxListProps>((props) => {
  const api = useComboboxContext()
  const listProps = api ? mergeProps(api.getListProps(), props) : props

  return (
    <ark.div {...listProps}>
      <Slot />
    </ark.div>
  )
})
