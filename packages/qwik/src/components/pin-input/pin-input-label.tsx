import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePinInputContext } from './use-pin-input-context.ts'

export interface PinInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface PinInputLabelProps extends HTMLProps<'label'>, PinInputLabelBaseProps {}

export const PinInputLabel = component$<PinInputLabelProps>((props) => {
  const api = usePinInputContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
