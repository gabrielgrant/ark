import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useSelectContext } from './use-select-context.ts'

export interface SelectControlBaseProps extends PolymorphicProps<'div'> {}
export interface SelectControlProps extends HTMLProps<'div'>, SelectControlBaseProps {}

export const SelectControl = component$<SelectControlProps>((props) => {
  const api = useSelectContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
