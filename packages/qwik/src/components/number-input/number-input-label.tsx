import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputLabelBaseProps extends PolymorphicProps<'label'> {}
export interface NumberInputLabelProps extends HTMLProps<'label'>, NumberInputLabelBaseProps {}

export const NumberInputLabel = component$<NumberInputLabelProps>((props) => {
  const api = useNumberInputContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.label {...labelProps}>
      <Slot />
    </ark.label>
  )
})
