import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useSelectContext } from './use-select-context.ts'

export interface SelectPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface SelectPositionerProps extends HTMLProps<'div'>, SelectPositionerBaseProps {}

export const SelectPositioner = component$<SelectPositionerProps>((props) => {
  const api = useSelectContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
