import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useFieldsetContext } from './use-fieldset-context.ts'

export interface FieldsetLegendBaseProps extends PolymorphicProps<'legend'> {}
export interface FieldsetLegendProps extends HTMLProps<'legend'>, FieldsetLegendBaseProps {}

export const FieldsetLegend = component$<FieldsetLegendProps>((props) => {
  const api = useFieldsetContext()
  const legendProps = api ? mergeProps(api.getLegendProps(), props) : props

  return (
    <ark.legend {...legendProps}>
      <Slot />
    </ark.legend>
  )
})
