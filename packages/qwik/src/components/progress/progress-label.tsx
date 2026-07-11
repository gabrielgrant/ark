import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useProgressContext } from './use-progress-context.ts'

export interface ProgressLabelBaseProps extends PolymorphicProps<'span'> {}
export interface ProgressLabelProps extends HTMLProps<'span'>, ProgressLabelBaseProps {}

export const ProgressLabel = component$<ProgressLabelProps>((props) => {
  const api = useProgressContext()
  const labelProps = api ? mergeProps(api.getLabelProps(), props) : props

  return (
    <ark.span {...labelProps}>
      <Slot />
    </ark.span>
  )
})
