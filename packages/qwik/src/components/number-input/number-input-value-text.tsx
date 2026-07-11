import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface NumberInputValueTextProps extends HTMLProps<'span'>, NumberInputValueTextBaseProps {}

export const NumberInputValueText = component$<NumberInputValueTextProps>((props) => {
  const api = useNumberInputContext()
  const valueTextProps = api ? mergeProps(api.getValueTextProps(), props) : props

  return (
    <ark.span {...valueTextProps}>
      <Slot />
    </ark.span>
  )
})
