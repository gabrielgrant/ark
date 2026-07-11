import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressValueTextBaseProps extends PolymorphicProps<'span'> {}
export interface ProgressValueTextProps extends HTMLProps<'span'>, ProgressValueTextBaseProps {}

export const ProgressValueText = component$<ProgressValueTextProps>((props) => {
  const api = useProgressContext()
  const valueTextProps = api ? mergeProps(api.getValueTextProps(), props) : props

  return (
    <ark.span {...valueTextProps}>
      <Slot>{api?.percentAsString}</Slot>
    </ark.span>
  )
})
