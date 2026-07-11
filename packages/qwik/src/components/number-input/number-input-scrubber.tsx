import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useNumberInputContext } from './use-number-input-context.ts'

export interface NumberInputScrubberBaseProps extends PolymorphicProps<'div'> {}
export interface NumberInputScrubberProps extends HTMLProps<'div'>, NumberInputScrubberBaseProps {}

export const NumberInputScrubber = component$<NumberInputScrubberProps>((props) => {
  const api = useNumberInputContext()
  const scrubberProps = api ? mergeProps(api.getScrubberProps(), props) : props

  return (
    <ark.div {...scrubberProps}>
      <Slot />
    </ark.div>
  )
})
