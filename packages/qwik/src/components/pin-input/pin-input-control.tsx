import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePinInputContext } from './use-pin-input-context.ts'

export interface PinInputControlBaseProps extends PolymorphicProps<'div'> {}
export interface PinInputControlProps extends HTMLProps<'div'>, PinInputControlBaseProps {}

export const PinInputControl = component$<PinInputControlProps>((props) => {
  const api = usePinInputContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
