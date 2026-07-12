import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useDatePickerContext } from './use-date-picker-context.ts'

export interface DatePickerPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface DatePickerPositionerProps extends HTMLProps<'div'>, DatePickerPositionerBaseProps {}

export const DatePickerPositioner = component$<DatePickerPositionerProps>((props) => {
  const api = useDatePickerContext()
  const presence = usePresenceContext()

  if (presence?.unmounted) return null

  // Style (containing `--x`/`--y` custom properties) comes straight from the
  // machine's popper positioning and is passed through mergeProps untouched.
  const positionerProps = api ? mergeProps(api.getPositionerProps(), props) : props

  return (
    <ark.div {...positionerProps}>
      <Slot />
    </ark.div>
  )
})
