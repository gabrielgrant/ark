import { mergeProps } from '@zag-js/qwik'
import { Slot, component$ } from '@qwik.dev/core'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory.tsx'
import { usePresenceContext } from '../presence/index.ts'
import { useColorPickerContext } from './use-color-picker-context.ts'

export interface ColorPickerPositionerBaseProps extends PolymorphicProps<'div'> {}
export interface ColorPickerPositionerProps extends HTMLProps<'div'>, ColorPickerPositionerBaseProps {}

export const ColorPickerPositioner = component$<ColorPickerPositionerProps>((props) => {
  const api = useColorPickerContext()
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
