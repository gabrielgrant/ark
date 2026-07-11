import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface SelectClearTriggerProps extends HTMLProps<'button'>, SelectClearTriggerBaseProps {}

export const SelectClearTrigger = component$<SelectClearTriggerProps>((props) => {
  const api = useSelectContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
