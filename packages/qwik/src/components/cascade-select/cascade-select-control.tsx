import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectControlBaseProps extends PolymorphicProps<'div'> {}
export interface CascadeSelectControlProps extends HTMLProps<'div'>, CascadeSelectControlBaseProps {}

export const CascadeSelectControl = component$<CascadeSelectControlProps>((props) => {
  const api = useCascadeSelectContext()
  const controlProps = api ? mergeProps(api.getControlProps(), props) : props

  return (
    <ark.div {...controlProps}>
      <Slot />
    </ark.div>
  )
})
