import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { useCascadeSelectContext } from './use-cascade-select-context.ts'

export interface CascadeSelectPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface CascadeSelectPositionerProps extends HTMLProps<'div'>, CascadeSelectPositionerBaseProps {}

export const CascadeSelectPositioner = component$<CascadeSelectPositionerProps>((props) => {
  const api = useCascadeSelectContext()
  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
