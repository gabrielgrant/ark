import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSwitchContext } from './use-switch-context.ts'

export interface SwitchLabelBaseProps extends PolymorphicProps<'span'> {}
export interface SwitchLabelProps extends HTMLProps<'span'>, SwitchLabelBaseProps {}

export const SwitchLabel = component$<SwitchLabelProps>((props) => {
  const api = useSwitchContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
