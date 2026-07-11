import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CascadeSelectTriggerProps extends HTMLProps<'button'>, CascadeSelectTriggerBaseProps {}

export const CascadeSelectTrigger = component$<CascadeSelectTriggerProps>((props) => {
  const api = useCascadeSelectContext()
  const triggerProps = api ? mergeProps(api.getTriggerProps(), props) : props

  return (
    <ark.button {...triggerProps}>
      <Slot />
    </ark.button>
  )
})
