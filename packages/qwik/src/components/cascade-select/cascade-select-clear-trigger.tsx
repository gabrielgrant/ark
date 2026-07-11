import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectClearTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CascadeSelectClearTriggerProps extends HTMLProps<'button'>, CascadeSelectClearTriggerBaseProps {}

export const CascadeSelectClearTrigger = component$<CascadeSelectClearTriggerProps>((props) => {
  const api = useCascadeSelectContext()
  const clearTriggerProps = api ? mergeProps(api.getClearTriggerProps(), props) : props

  return (
    <ark.button {...clearTriggerProps}>
      <Slot />
    </ark.button>
  )
})
