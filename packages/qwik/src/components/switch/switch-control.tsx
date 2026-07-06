import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSwitchContext } from './use-switch-context.ts'

export interface SwitchControlBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchControlProps extends HTMLProps<'span'>, SwitchControlBaseProps {}

export const SwitchControl = component$<SwitchControlProps>((props) => {
  const api = useSwitchContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.span {...controlProps}>
      <Slot />
    </ark.span>
  )
})
