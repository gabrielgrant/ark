import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useComboboxContext } from './use-combobox-context.ts'

export interface ComboboxClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface ComboboxClearTriggerProps extends HTMLProps<'button'>, ComboboxClearTriggerBaseProps {}

export const ComboboxClearTrigger = component$<ComboboxClearTriggerProps>((props) => {
  const api = useComboboxContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
